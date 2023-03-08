const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('products.db');

db.run(`CREATE TABLE IF NOT EXISTS products (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT,
  cost FLOAT,
  price FLOAT,
  quantity INTEGER
)`);