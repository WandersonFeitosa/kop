import { Request, Response } from 'express';
import mongoose from 'mongoose';
import { client } from '..';
import { TextChannel, ChannelType, Channel } from 'discord.js';

interface MessageData {
    content: string;
    author: string;
    date: Date;
    discordMessageId: string;
    channelName: string;
}

const scrapperSchema = new mongoose.Schema({
    channelId: String,
    content: String,
    author: String,
    discordMessageId: String,
    date: Date,
    channelName: String
});

const ScrapperData = mongoose.model('topics', scrapperSchema);

export class Scrapper {
    private totalMessages = 0;
    private processedMessages = 0;
    private startTime: Date | null = null;
    private userCache: Map<string, string> = new Map();
    private includedChannels = process.env.INCLUDED_CHANNELS?.split(',') || [];
    private scrapeLock = false;
    private userMap = new Map([
        ['552859738476380170', 'Buba'],
        ['332525786273939458', 'André'],
        ['500908554752884737', 'Gótica'],
        ['653577745086939147', 'Ana'],
        ['709910500393222235', 'Kol'],
        ['529116315265400832', 'Shu'],
        ['572951467959517195', 'Lee'],
        ['339177530772815875', 'Vandaum']
    ]);
    private saveQueue: Array<{ message: MessageData, channelId: string }> = [];
    private isSaving = false;
    private saveInterval: NodeJS.Timeout | null = null;
    private skippedMessages = 0;

    startScrapper = async (req: Request, res: Response) => {
        const guildId = req.params.guildId;
        this.startTime = new Date();
        this.totalMessages = 0;
        this.processedMessages = 0;

        const scrapeKey = process.env.SCRAPE_KEY || '1234567890';
        const recievedKey = req.headers['x-scrape-key'];

        if (scrapeKey !== recievedKey) {
            console.log('[Scrapper] Invalid scrape key');
            res.status(401).json({ message: 'Unauthorized' });
            return;
        }

        if (this.scrapeLock) {
            console.log('[Scrapper] Scrape already in progress');
            res.status(400).json({ message: 'Scrape already in progress' });
            return;
        }
        this.scrapeLock = true;

        console.log(`[Scrapper] Starting scrape for guild ${guildId}`);
        res.status(200).json({ message: "Scrapper started" });

        // Start the save queue processor immediately
        this.startSaveQueueProcessor();

        try {
            const channels = (await this.getTextChannels(guildId)).sort((a, b) => a.type === 'topic' ? 1 : -1);

            for (const channel of channels) {
                console.log(`[Scrapper] Starting channel: ${channel.name} (${channel.id})`);
                await this.scrapeMessages(channel.id);
                console.log(`[Scrapper] Completed channel: ${channel.name}`);
            }

            // Wait for remaining saves to complete
            while (this.saveQueue.length > 0) {
                await new Promise(resolve => setTimeout(resolve, 1000));
                console.log(`[Scrapper] Waiting for ${this.saveQueue.length} messages to be saved...`);
            }

            // Stop the save queue processor
            if (this.saveInterval) {
                clearInterval(this.saveInterval);
                this.saveInterval = null;
            }

            const duration = this.getScrapeDuration();
            console.log(`[Scrapper] Completed! Processed ${this.totalMessages} messages in ${duration}`);
        } catch (error) {
            console.error('[Scrapper] Error:', error);
        } finally {
            this.scrapeLock = false;
            if (this.saveInterval) {
                clearInterval(this.saveInterval);
                this.saveInterval = null;
            }
        }
    }

    private shouldSkipMessage(content: string, author: string): boolean {
        // Skip if author is Rollem
        if (author.toLowerCase() === 'rollem') {
            return true;
        }

        // Pattern 1: number followed by 'd' and another number (e.g., "123d32")
        const diceRollPattern = /^\d+d\d+/;

        // Pattern 2: number followed by '#' (e.g., "21#d38")
        const numberHashPattern = /^\d+#/;

        return diceRollPattern.test(content) || numberHashPattern.test(content);
    }

    private startSaveQueueProcessor() {
        this.saveInterval = setInterval(async () => {
            if (this.isSaving || this.saveQueue.length === 0) return;

            this.isSaving = true;
            const batch = this.saveQueue.splice(0, 10); // Process 10 at a time

            try {
                await Promise.all(batch.map(async ({ message, channelId }) => {
                    try {
                        // Updated to pass both content and author
                        if (this.shouldSkipMessage(message.content, message.author)) {
                            this.skippedMessages++;
                            if (this.skippedMessages % 100 === 0) {
                                console.log(`[Scrapper] Skipped ${this.skippedMessages} messages so far`);
                            }
                            return;
                        }

                        const existingMessage = await ScrapperData.findOne({
                            discordMessageId: message.discordMessageId
                        }).select('discordMessageId');

                        if (!existingMessage) {
                            await ScrapperData.create({
                                channelId,
                                content: message.content,
                                author: message.author,
                                discordMessageId: message.discordMessageId,
                                date: message.date,
                                channelName: message.channelName
                            });
                        }
                    } catch (error) {
                        console.error(`[Scrapper] Error saving message ${message.discordMessageId}: ${error}`);
                        this.saveQueue.push({ message, channelId });
                    }
                }));
            } catch (error) {
                console.error('[Scrapper] Batch save error:', error);
            }

            this.isSaving = false;
        }, 100); // Run every 100ms
    }

    private async getTextChannels(guildId: string) {
        const guild = client.guilds.cache.get(guildId);
        if (!guild) throw new Error('Guild not found');

        const channels = await guild.channels.fetch();
        const result = [];

        // Get all channels first
        for (const channel of channels.values()) {
            if (!channel) continue;

            // Handle forum channels (always include all forum channels)
            if (channel.type === ChannelType.GuildForum) {
                // Get active threads
                const activeThreads = await channel.threads.fetchActive();
                // Get archived threads (public)
                const archivedThreads = await channel.threads.fetchArchived();
                // Get archived threads (private)
                const archivedPrivateThreads = await channel.threads.fetchArchived({ type: 'private' });

                // Combine all threads
                [...activeThreads.threads.values(),
                ...archivedThreads.threads.values(),
                ...archivedPrivateThreads.threads.values()
                ].forEach(thread => {
                    result.push({
                        id: thread.id,
                        name: thread.name,
                        type: 'topic',
                        parentName: channel.name,
                        archived: thread.archived
                    });
                });
                continue;
            }

            // Handle text channels (only if included)
            if (channel.isTextBased()) {
                if (this.includedChannels.includes(channel.id)) result.push({
                    id: channel.id,
                    name: channel.name,
                    type: 'text'
                });

                // Get threads for text channels if they exist
                if ('threads' in channel) {
                    try {
                        // Get active threads
                        const activeThreads = await channel.threads.fetchActive();
                        // Get archived threads (public)
                        const archivedThreads = await channel.threads.fetchArchived();
                        // Get archived threads (private)
                        const archivedPrivateThreads = await channel.threads.fetchArchived({ type: 'private' });

                        // Combine all threads
                        [...activeThreads.threads.values(),
                        ...archivedThreads.threads.values(),
                        ...archivedPrivateThreads.threads.values()
                        ].forEach(thread => {
                            result.push({
                                id: thread.id,
                                name: thread.name,
                                type: 'thread',
                                parentName: channel.name,
                                archived: thread.archived
                            });
                        });
                    } catch (error) {
                        console.error(`[Scrapper] Error fetching threads for channel ${channel.name}:`, error);
                    }
                }
            }
        }

        console.log(`[Scrapper] Found ${result.length} channels and threads`);
        return result;
    }

    private async scrapeMessages(channelId: string, lastMessageId?: string) {
        try {
            const messages = await this.readMessages(channelId, lastMessageId);

            if (!messages.messages.length) {
                console.log('[Scrapper] No more messages to process');
                return;
            }

            this.totalMessages += messages.messages.length;
            console.log(`[Scrapper] Batch: Processing ${messages.messages.length} messages (Total: ${this.totalMessages})`);

            // Queue messages and update processed count
            messages.messages.forEach(msg => {
                this.saveQueue.push({ message: msg, channelId });
                this.processedMessages++; // Move this here to count each message
                
                // Log progress every 100 messages
                if (this.processedMessages % 100 === 0) {
                    const duration = this.getScrapeDuration();
                    console.log(`[Scrapper] Progress: ${this.processedMessages}/${this.totalMessages} messages (${duration})`);
                }
            });

            // Continue to next batch immediately
            if (messages.olderMessage && messages.messages[0] !== messages.olderMessage) {
                await this.scrapeMessages(channelId, messages.olderMessage.discordMessageId);
            }
        } catch (error) {
            console.error(`[Scrapper] Error processing batch: ${error}`);
            throw error;
        }
    }

    private async getUsernameFromMention(userId: string): Promise<string> {
        // Check predefined map first
        if (this.userMap.has(userId)) {
            return this.userMap.get(userId)!;
        }

        // Check cache next
        if (this.userCache.has(userId)) {
            return this.userCache.get(userId)!;
        }

        // Fallback to API call
        try {
            const user = await client.users.fetch(userId);
            const username = user.username;
            this.userCache.set(userId, username);
            return username;
        } catch (error) {
            console.error(`[Scrapper] Error fetching username for ${userId}:`, error);
            return `<@${userId}>`;
        }
    }

    private async replaceUserMentions(content: string): Promise<string> {
        const mentionPattern = /<@!?(\d+)>/g;
        let newContent = content;
        const mentions = content.match(mentionPattern);

        if (!mentions) return content;

        for (const mention of mentions) {
            const userId = mention.replace(/<@!?(\d+)>/, '$1');
            const username = await this.getUsernameFromMention(userId);
            newContent = newContent.replace(mention, username);
        }

        return newContent;
    }

    private async readMessages(channelId: string, lastMessageId?: string): Promise<{
        messages: MessageData[],
        olderMessage: MessageData
    }> {
        const channel = client.channels.cache.get(channelId) as TextChannel | null;
        if (!channel?.isTextBased()) throw new Error('Channel is not text based');

        try {
            const messages = await channel.messages.fetch({
                limit: 100,
                before: lastMessageId
            });

            const scrappedMessages: MessageData[] = await Promise.all(
                messages.map(async message => ({
                    discordMessageId: message.id,
                    content: await this.replaceUserMentions(message.content),
                    author: this.userMap.get(message.author.id) || message.author.username,
                    date: message.createdAt,
                    channelName: channel.name
                }))
            );

            return {
                messages: scrappedMessages,
                olderMessage: scrappedMessages[scrappedMessages.length - 1]
            };
        } catch (error) {
            console.error(`[Scrapper] Error fetching messages: ${error}`);
            throw error;
        }
    }

    private getScrapeDuration(): string {
        if (!this.startTime) return '0s';
        const duration = new Date().getTime() - this.startTime.getTime();
        const seconds = Math.floor(duration / 1000);
        const minutes = Math.floor(seconds / 60);
        return minutes > 0 ?
            `${minutes}m ${seconds % 60}s` :
            `${seconds}s`;
    }
}
