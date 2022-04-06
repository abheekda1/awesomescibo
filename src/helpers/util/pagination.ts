import { Message, MessageActionRow, MessageButton, MessageEmbed } from 'discord.js';

export default async function(message : Message, embeds : MessageEmbed[]) {
	let index = 0;

	const row = new MessageActionRow;
	row.addComponents(
		new MessageButton()
			.setCustomId('paginator-left')
			.setEmoji('868552005977788466')
			.setStyle('SECONDARY'),
		new MessageButton()
			.setCustomId('paginator-right')
			.setEmoji('868551772887711754')
			.setStyle('SECONDARY')
	);

	await message.reply({ content: `Page 1 of ${embeds.length}:`, embeds: [embeds[index]], components: [row] })
		.then(async paginatorMessage => {
			const filter = m => m.author.id === message.author.id;

			const paginatorCollector = paginatorMessage.createMessageComponentCollector({ componentType: 'BUTTON', filter: filter });

			paginatorCollector.on('collect', async i => {
				switch (i.customId) {
				case 'paginator-left':
					index--;
					if (index < 0) index = embeds.length - 1;
					break;
				case 'paginator-right':
					index++;
					if (index > embeds.length - 1) index = 0;
					break;
				}
				paginatorMessage.edit({ content: `Page ${index + 1} of ${embeds.length}:`, embeds: [embeds[index]] });
			});
		});
}