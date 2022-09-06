// import dotenv from 'dotenv';
// import Airtable from 'airtable';

// dotenv.config();

const Airtable = require('airtable');
require('dotenv').config();

Airtable.configure({
  endpointUrl: 'https://api.airtable.com',
  apiKey: process.env.NEXT_PUBLIC_AIRTABLE_API_KEY
});
const base = Airtable.base(process.env.AIRTABLE_BASE_ID);

// export default base;
module.exports = base;