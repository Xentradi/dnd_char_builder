require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2');

const app = express();
const port = process.env.PORT || 3000;

/// Mysql connection
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

app.use(express.static('public'));

/// Middleware
app.use(bodyParser.json());

// Routes
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
})

app.get('/characters', (req, res) => {
  pool.query('SELECT * FROM characters', (err, result) => {
    if (err) {
      return res.status(500).json({error: err.message});
    }
    res.json(result);
  })
})

app.get('/characters/:id', (req, res) => {
  pool.query('SELECT * FROM characters WHERE id =?', [req.params.id], (err, result) => {
    if (err) {
      return res.status(500).json({error: err.message});
    }
    res.json(result);
  });
});