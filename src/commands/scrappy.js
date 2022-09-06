// import dotenv from 'dotenv';
// import base from '../base.js';

// dotenv.config();

const base = require('../base.js');
require('dotenv').config();

const supportedAvatarFileTypes = [
  'image/png',
  'image/jpeg',
  'image/svg+xml',
  'image/webp',
  'image/gif'
];

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
    },
    {
      name: 'setavatar',
      description: 'Changes your Scrapbook avatar',
      type: 1,
      options: [
        {
          name: 'avatar',
          description: `The new avatar file (supported types: ${supportedAvatarFileTypes.map(a => a.split('/')[1]).join(', ')})`,
          type: 11,
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
    case 'setavatar':
      setAvatarCommand(client, interaction);
      break;
  }
};

// export default { config, run };
module.exports = { config, run };


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

function setAvatar(userRecordId, newAvatarURL) { // TODO: check
  return new Promise((resolve, reject) => {
    base('Users').update([
      {
        id: userRecordId,
        fields: {
          "Avatar": [
            {
              "url": newAvatarURL
            }
          ]
        }
      }
    ], (err, records) => {
      if (err) { console.error(err); return reject(err); }
      resolve(records[0]);
    });
  });
}


// SUBCOMMANDS

async function setUsernameCommand(client, interaction) {
  await interaction.deferReply({ ephemeral: true });

  const newUsername = interaction.options.get('username').value.replace(/[^a-zA-Z0-9]/g, '');

  // check if user has a scrapbook account
  const user = await fetchUser(interaction.user.id);
  if (!user) {
    await interaction.editReply(`You don't have a Scrapbook account yet! First make a post in <#${process.env.SCRAPBOOK_CHANNEL_ID}> and I'll automatically create one for you. 😊`);
    return;
  }

  // check if username is not taken
  const userWithNewUsername = await fetchUserByUsername(newUsername);
  if (userWithNewUsername) {
    await interaction.editReply(`The username \`${newUsername}\` is already taken 😭`);
    return;
  }

  // change username
  await setUsername(user.id, newUsername);

  await interaction.editReply(`I changed your Scrapbook username to \`${newUsername}\` 👏`);
}

async function setAvatarCommand(client, interaction) {
  await interaction.deferReply({ ephemeral: true });

  const newAvatarURL = interaction.options.get('avatar').attachment.url;
  const newAvatarFileType = interaction.options.get('avatar').attachment.contentType;

  // check if file type is supported
  if (!supportedAvatarFileTypes.includes(newAvatarFileType)) {
    await interaction.editReply(`The file type \`${newAvatarFileType}\` is not supported 😳`);
    return;
  }

  // check if user has a scrapbook account
  const user = await fetchUser(interaction.user.id);
  if (!user) {
    await interaction.editReply(`You don't have a Scrapbook account yet! First make a post in <#${process.env.SCRAPBOOK_CHANNEL_ID}> and I'll automatically create one for you. 😊`);
    return;
  }

  // change avatar
  await setAvatar(user.id, newAvatarURL);

  await interaction.editReply(`I updated your Scrapbook avatar! 👏`);
}