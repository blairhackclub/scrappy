// import ShortUniqueId from 'short-unique-id';
// import base from './base.js';

const ShortUniqueId = require('short-unique-id');
const base = require('./base.js');

const uid = new ShortUniqueId({ length: 10 });

// TODO: add error messages
// TODO: send different messages for new users
// TODO: link to scrapbook page on post (special welcome page for new users)
// TODO: use uuid instead of discord tag for temp username

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

function createUser(discordUid, discordUsername, avatarURL) {
  return new Promise((resolve, reject) => {
    const tempUsername = discordUsername.replace(/[^a-zA-Z0-9]/g, '').concat('-', uid()); // temp username before user sets their own
    // const tempUsername = discordTag.replace(/[^a-zA-Z0-9]/g, '');
    if (!avatarURL) avatarURL = `https://avatars.dicebear.com/api/jdenticon/${tempUsername}.svg`; // https://avatars.dicebear.com/docs/http-api

    base('Users').create([
      {
        fields: {
          "Username": tempUsername,
          "Discord UID": discordUid,
          "Avatar": [{ url: avatarURL }]
        },
      }
    ], (err, records) => {
      if (err) { console.error(err); return reject(err); }

      resolve(records[0]);
    });
  });
}

function uploadScrap(discordUid, message, threadChannelId) {
  return new Promise((resolve, reject) => {
    base('Scraps').create([
      {
        fields: {
          "Discord Message ID": message.id,
          "Discord Thread ID": threadChannelId,
          "Description": message.content,
          "Attachments": message.attachments.map(a => {
            return { url: a.url };
          }),
          "User": [discordUid]
        },
      }
    ], (err, records) => {
      if (err) { console.error(err); return reject(err); }

      resolve(records[0]);
    });
  });
}

/*export */async function handleScrapbook(client, message) {
  if (message.channelId !== process.env.SCRAPBOOK_CHANNEL_ID) return;
  if (message.author.bot) return;

  if (!message.content || message.attachments.size === 0) return; // make sure message is a valid post (has content and attachments)

  // get user record id from discord uid
  let user = await fetchUser(message.author.id);

  // if user doesn't exist, create it
  if (!user) {
    let avatarURL = await message.author.avatarURL();
    user = await createUser(message.author.id, message.author.username, avatarURL);    
  }

  // create thread from message
  const threadChannel = await message.startThread({
    name: `${user.fields['Username']} — ${message.content}`.slice(0,100),
    autoArchiveDuration: 1440,
    reason: `Scrapbook thread for ${message.author.tag} (${message.author.id})`,
    //rateLimitPerUser: 30,
  });
  
  // upload scrap to airtable
  client.channels.cache.get(threadChannel.id).send('Hang on! I\'m uploading your scrap to Scrapbook...');
  await uploadScrap(user.id, message, threadChannel.id);
  client.channels.cache.get(threadChannel.id).send('Your post is live! 🙌');
}

module.exports = { handleScrapbook };