import base from '../base.js';

const config = {
  name: 'scrappy',
  description: 'Get help with Scrappy',
  options: [
    {
      name: 'setusername',
      description: 'Changes your Scrapbook username',
      type: 1,
      options: [
        {
          name: 'username',
          description: 'The new username',
          type: 3,
          required: true,
        }
      ]
    }
  ]
};

const run = async (client, interaction) => {
  // await interaction.reply('This command is not yet implemented.');
  
  switch (interaction.options.getSubcommand()) {
    case 'setusername':
      setUsernameCommand(client, interaction);
      break;
  }
};

export default { config, run };


function fetchUser(discordUid) {
  return new Promise((resolve, reject) => {
    base('Users').select({
      maxRecords: 1,
      view: 'Grid view',
      filterByFormula: `{Discord UID} = "${discordUid}"`
    }).firstPage(async (err, records) => {
      if (err) { console.error(err); return reject(err); }
      resolve(records[0]);
    });
  });
}

function fetchUserByUsername(username) {
  return new Promise((resolve, reject) => {
    base('Users').select({
      maxRecords: 1,
      view: 'Grid view',
      filterByFormula: `{Username} = "${username}"`
    }).firstPage(async (err, records) => {
      if (err) { console.error(err); return reject(err); }
      resolve(records[0]);
    });
  });
}

function setUsername(userRecordId, newUsername) {
  return new Promise((resolve, reject) => {
    base('Users').update([
      {
        id: userRecordId,
        fields: {
          "Username": newUsername,
        }
      }
    ], (err, records) => {
      if (err) { console.error(err); return reject(err); }
      resolve(records[0]);
    });
  });
}

async function setUsernameCommand(client, interaction) {
  const newUsername = interaction.options.get('username').value.replace(/[^a-zA-Z0-9]/g, '');
  await interaction.deferReply({ ephemeral: true});

  // check if username is not taken
  const userWithNewUsername = await fetchUserByUsername(newUsername);
  if (userWithNewUsername) {
    await interaction.editReply(`The username \`${newUsername}\` is already taken 😭`);
    return;
  }

  // change username
  const userUid = (await fetchUser(interaction.user.id)).id;
  await setUsername(userUid, newUsername);

  await interaction.editReply(`I changed your Scrapbook username to \`${newUsername}\` 👏`);
}