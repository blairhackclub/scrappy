import { ModalBuilder, ActionRowBuilder, TextInputBuilder, TextInputStyle } from 'discord.js';

const config = {
  name: 'modal',
  description: '(TEST) Creates a modal'
};

const run = async (client, interaction) => {
  const modal = new ModalBuilder()
    .setTitle('Test modal')
    .setCustomId('testModal')
    .setComponents(
      new ActionRowBuilder().setComponents(
        new TextInputBuilder()
          .setLabel('Short input')
          .setCustomId('testInput')
          .setStyle(TextInputStyle.Short)
      ),
      new ActionRowBuilder().setComponents(
        new TextInputBuilder()
          .setLabel('Paragraph input')
          .setCustomId('testParagraphInput')
          .setStyle(TextInputStyle.Paragraph)
      ),
    );

    interaction.showModal(modal);
};

export default { config, run };