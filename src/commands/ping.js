
const config = {
  name: 'ping',
  description: 'Replies with Pong!'
};

const run = async (client, interaction) => {
  await interaction.reply('Pong!');
};

// export default { config, run };
module.exports = { config, run };