require('dotenv').config();
const { Client } = require('pg');
const client = new Client({ connectionString: process.env.DATABASE_URL });
async function run() {
  await client.connect();
  const res = await client.query('DELETE FROM "Gallery" WHERE type = \'image\' AND url LIKE \'data:application/octet-stream%\' RETURNING id, title');
  console.log(`Deleted ${res.rowCount} broken HEIC images:`);
  console.log(res.rows);
  await client.end();
}
run().catch(console.error);
