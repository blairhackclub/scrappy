import base from './base.js';

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

function uploadScrap(user, message, threadChannel) {
  return new Promise((resolve, reject) => {
    base('Scraps').create([
      {
        fields: {
          "Discord Message ID": message.id,
          "Discord Thread ID": threadChannel.id,
          "Description": message.content,
          "Attachments": message.attachments.map(a => {
            return { url: a.url };
          }),
          "User": [user.id]
        },
      }
    ], (err, records) => {
      if (err) { console.error(err); return reject(err); }

      resolve(records[0]);
    });
  });
}

export async function handleScrapbook(client, message) {
  if (message.channelId !== process.env.SCRAPBOOK_CHANNEL_ID) return;
  if (message.author.bot) return;

  if (!message.content || message.attachments.size === 0) return; // make sure message is a valid post (has content and attachments)

  // get user record id from discord uid, TODO: create user if doesn't exist
  let user = await fetchUser(message.author.id);

  // create thread from message
  const threadChannel = await message.startThread({
    name: `${user.fields['Username']} — ${message.content}`,
    autoArchiveDuration: 1440,
    reason: `Scrapbook thread for ${message.author.tag} (${message.author.id})`,
    //rateLimitPerUser: 30,
  });
  
  // upload scrap to airtable
  client.channels.cache.get(threadChannel.id).send('Hang on! I\'m uploading your scrap to Scrapbook...');
  await uploadScrap(user, message, threadChannel);
  client.channels.cache.get(threadChannel.id).send('Your post is live! 🙌');
}
