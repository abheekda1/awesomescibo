"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.paginateInteraction = exports.paginateMessage = void 0;
const discord_js_1 = require("discord.js");
function paginateMessage(message, embeds) {
    return __awaiter(this, void 0, void 0, function* () {
        let index = 0;
        const row = new discord_js_1.MessageActionRow;
        row.addComponents(new discord_js_1.MessageButton()
            .setCustomId('paginator-left')
            .setEmoji('868552005977788466')
            .setStyle('SECONDARY'), new discord_js_1.MessageButton()
            .setCustomId('paginator-right')
            .setEmoji('868551772887711754')
            .setStyle('SECONDARY'));
        yield message.reply({ content: `Page 1 of ${embeds.length}:`, embeds: [embeds[index]], components: [row] })
            .then((paginatorMessage) => __awaiter(this, void 0, void 0, function* () {
            const filter = m => m.author.id === message.author.id;
            const paginatorCollector = paginatorMessage.createMessageComponentCollector({ componentType: 'BUTTON', filter: filter });
            paginatorCollector.on('collect', (i) => __awaiter(this, void 0, void 0, function* () {
                switch (i.customId) {
                    case 'paginator-left':
                        index--;
                        if (index < 0)
                            index = embeds.length - 1;
                        break;
                    case 'paginator-right':
                        index++;
                        if (index > embeds.length - 1)
                            index = 0;
                        break;
                }
                paginatorMessage.edit({ content: `Page ${index + 1} of ${embeds.length}:`, embeds: [embeds[index]] });
            }));
        }));
    });
}
exports.paginateMessage = paginateMessage;
function paginateInteraction(interaction, embeds) {
    return __awaiter(this, void 0, void 0, function* () {
        let index = 0;
        const row = new discord_js_1.MessageActionRow;
        row.addComponents(new discord_js_1.MessageButton()
            .setCustomId('paginator-left')
            .setEmoji('868552005977788466')
            .setStyle('SECONDARY'), new discord_js_1.MessageButton()
            .setCustomId('paginator-right')
            .setEmoji('868551772887711754')
            .setStyle('SECONDARY'));
        yield interaction.followUp({ content: `Page 1 of ${embeds.length}:`, embeds: [embeds[index]], components: [row], fetchReply: true })
            .then((p) => __awaiter(this, void 0, void 0, function* () {
            const paginatorMessage = p;
            const filter = i => i.user.id === interaction.user.id;
            const paginatorCollector = paginatorMessage.createMessageComponentCollector({ componentType: 'BUTTON', filter: filter });
            paginatorCollector.on('collect', (i) => __awaiter(this, void 0, void 0, function* () {
                switch (i.customId) {
                    case 'paginator-left':
                        index--;
                        if (index < 0)
                            index = embeds.length - 1;
                        break;
                    case 'paginator-right':
                        index++;
                        if (index > embeds.length - 1)
                            index = 0;
                        break;
                }
                yield i.update({ content: `Page ${index + 1} of ${embeds.length}:`, embeds: [embeds[index]] });
            }));
        }));
    });
}
exports.paginateInteraction = paginateInteraction;
