const { Client } = require('pg');

const client = new Client({
  user: "avnadmin",
  password: "AVNS_hY07Gqp7ZI5tZXhpQKg",
  host: "pg-34a4cee4-jessymolsebastian1971-88f9.g.aivencloud.com",
  port: 25050,
  database: "defaultdb",
  ssl: {
    rejectUnauthorized: false, // <-- Bypass SSL strict check
  },
});

client.connect()
  .then(() => console.log("✅ Connected to Aiven PostgreSQL"))
  .catch((err) => console.error("❌ Connection error", err.stack));

module.exports = client;
