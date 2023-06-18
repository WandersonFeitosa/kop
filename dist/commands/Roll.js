"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Roll = void 0;
function Roll(interaction) {
    const rolada = String(Math.floor(Math.random() * 20));
    interaction.reply(`Sua rolada deu ${rolada}`);
}
exports.Roll = Roll;
