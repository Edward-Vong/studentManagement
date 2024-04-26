require('dotenv').config({ path: 'config.env' });
const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

app.use(bodyParser.json());

// Set up MySQL connection
const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME
});

connection.connect(error => {
  if (error) throw error;
  console.log("Successfully connected to the database.");
});

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.post('/users', (req, res) => {
  const sql = 'INSERT INTO users SET ?';
  const newUser = {
      UserName: req.body.UserName,
      DepartmentID: req.body.DepartmentID,
      Role: req.body.Role
  };
  connection.query(sql, newUser, (error, results) => {
      if (error) throw error;
      res.status(201).send('User added');
  });
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
