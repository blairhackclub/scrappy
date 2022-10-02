# Scrappy
Work in progress!

## How to start
### Airtable
Setup an [AirTable](https://airtable.com/).

Add a `Users` and `Scraps` table.

Refer to [AirTable Integration section](https://github.com/blairhackclub/scrappy/blob/master/README.md#airtable-integration) and copy the field names.

### Discord Bot

Clone this repository into a desired folder.
```
git clone https://github.com/blairhackclub/scrappy/ SCRAPPYFOLDERNAME
```

Install dependencies.
```
npm i
```

Add a `.env` file with the following environment variables.
```
AIRTABLE_BASE_ID=found in AirTable URL
NEXT_PUBLIC_AIRTABLE_API_KEY=found in AirTable personal settings
CLIENT_ID=found in Discord Developer Applications page
TOKEN=found in Discord Developer Applications page
GUILD_ID=found in Discord
SCRAPBOOK_CHANNEL_ID=found in Discord
```

Run the bot.
```
npm start
```

### Website
Clone [Blair Hack Club's site](https://github.com/blairhackclub/site-v2).

```
git clone https://github.com/blairhackclub/site-v2 SITEFOLDERNAME
```

Install dependencies.
```
npm i
```

Isolate scrapbook feature as needed. Blair Hack Club scrapbook uses the `pages/scrapbook` folder, `lib` folder, `public/assets` folder, `components` folder, and `.env` (including all the required Next directories).

Run the site.
```
npm run dev
```

## Airtable integration
This bot integrates with an Airtable base to store and manage data. The base should have the following tables with the following fields:
- `Scraps` table
  - `Scrap ID`: Autonumber
  - `Created time`: Created time
  - `Discord Message ID`: Single line text
  - `Discord Thread ID`: Single line text
  - `Description`: Long text
  - `Attachments`: Attachment
  - `Tags`: Multiple select (not implemented yet)
  - `Mentions`: Link to Users, Allow linking to multiple records (not implemented yet)
  - `User`: Link to Users
  - `User Record ID`: Lookup, User, Record ID
  - `Username (from User)`: Lookup, User, Username
  - `Avatar (from User)`: Lookup, User, Avatar
- `Users` table
  - `Username`: Single line text
  - `Record ID`: Formula, `RECORD_ID()` (optional)
  - `Discord UID`: Single line text
  - `Avatar`: Attachment,
  - `GitHub User`: Single line text (not implemented yet)
  - `Website`: Single line text (not implemented yet)
  - `Scraps`: Link to Scraps, Allow linking to multiple records
  - `Mentions`: Link to scraps, Allow linking to multiple records (not implemented yet)

Read more about Airtable's API: https://airtable.com/api
