import log from '../helpers/log';

export const name = 'interactionCreate';

export const once = false;

declare global {
	var client;
}

export async function execute(interaction) {
	const client = interaction.client;

	if (!interaction.isCommand()) return;

	const command = client.commands.get(interaction.commandName);

	client.on('interactionCreate', async interaction => {
		if (!interaction.isSelectMenu()) return;
		var values = interaction.values[1];
		switch(values)  {
			case "subjects":
				await interaction.editReply({ content: 'subjects was selected!', components: [] });
				break;
			case "gradeLevels":
				await interaction.editReply({ content: 'levels was selected!', components: [] });
				break;
		}
	});

	if (!command) return;

	try {
		await command.execute(interaction);
	}
	catch (error) {
		log({ logger: 'interaction', content: `Interaction ${interaction.name} failed!`, level: 'error' });
		await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
	}
//

}
