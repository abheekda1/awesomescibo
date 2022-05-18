import log from '../helpers/log';

export const name = 'interactionCreate';

export const once = false;

export async function execute(interaction) {
	const client = interaction.client;

	if (!interaction.isCommand()) return;

	const command = client.commands.get(interaction.commandName);

	if (!command) return; //h

	try {
		await command.execute(interaction);
	}
	catch (error) {
		log({ logger: 'interaction', content: `Interaction ${interaction.name} failed!`, level: 'error' });
		await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
	}
}