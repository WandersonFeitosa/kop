import { Message } from "discord.js";
interface FlowiseResponse {
    text: string;
    question: string;
    chatId: string;
    chatMessageId: string;
    isStreamValid: boolean;
    sessionId: string;
    memoryType: string;
}
let chatId: string | null = null;
export class Flowise {

    messageReply = async (message: Message) => {
        const processingMessage = await message.reply('Calmô to pensando...');
        if (message.content.includes("resetar")) {
            chatId = null;
            await message.reply("Histórico resetado com sucesso!");
            await processingMessage.delete();
            return;
        }
        const response = await this.sendMessageToFlowise(message.content);
        const parts = this.parseMaxCharacters(response);
        await processingMessage.delete();
        for (const part of parts) {
            await message.reply(part);
        }
    }

    async sendMessageToFlowise(message: string): Promise<string> {
        try {
            message = message.replaceAll("<@1061711667249037342>", "Kop");
            console.log("Sending message to Flowise: ", message, chatId);
            const flowiseUrl = process.env.FLOWISE_API_URL;
            const flowiseToken = process.env.FLOWISE_API_TOKEN;
            const flowiseChatflowId = process.env.FLOWISE_CHATFLOW_ID;
            const response = await fetch(`${flowiseUrl}/api/v1/prediction/${flowiseChatflowId}`, {
                method: 'POST',
                body: JSON.stringify({ question: message, chatId: chatId }),
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${flowiseToken}`
                }
            });
            const data = await response.json() as FlowiseResponse;
            console.log(data);
            chatId = data.chatId;
            return data.text || 'An error occurred while processing your message.';
        } catch (error) {
            console.error(error);
            return 'An error occurred while processing your message.';
        }
    }

    parseMaxCharacters(text: string): string[] {
        const maxCharacters = 1800;
        if (text.length <= maxCharacters) {
            return [text];
        }

        const parts: string[] = [];
        let currentText = text;

        while (currentText.length > maxCharacters) {
            // Find the last space before maxCharacters
            let splitIndex = currentText.lastIndexOf(' ', maxCharacters);

            // If no space found, force split at maxCharacters
            if (splitIndex === -1) {
                splitIndex = maxCharacters;
            }

            // Add the chunk to parts array
            parts.push(currentText.substring(0, splitIndex).trim());

            // Update currentText to remaining text
            currentText = currentText.substring(splitIndex).trim();
        }

        // Add any remaining text
        if (currentText.length > 0) {
            parts.push(currentText);
        }

        return parts;
    }
}