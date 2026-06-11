require('dotenv').config();
const { Client } = require('pg');
const client = new Client({ connectionString: process.env.DATABASE_URL });
async function run() {
  await client.connect();
  const res = await client.query('SELECT id, title, type, album, LENGTH(url) as len, SUBSTRING(url from 1 for 50) as start FROM "Gallery" ORDER BY "createdAt" DESC LIMIT 10');
  console.log(res.rows);
  await client.end();
}
run().catch(console.error);
