require('dotenv').config({ path: 'config.env' });

const express = require('express');
const cors = require('cors')
const mysql = require('mysql2');
const bcryptjs = require('bcryptjs');
const app = express();
const port = 3000;

app.use(express.json());
app.use(cors());

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




app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});



// CREATE USER
app.post('/signup', async (req, res) => {
  try {
    console.log(req.body);

    const { Role, FirstName, LastName, Email, Password } = req.body;
    const hashedPassword = await bcryptjs.hash(Password, 10);
    // Remove this console.log
    // console.log(hashedPassword);

    // query
    const query = 'INSERT INTO users (Role, FirstName, LastName, Email, Password) VALUES (?, ?, ?, ?, ?)';

    const [results] = await connection.promise().execute(query, [Role, FirstName, LastName, Email, hashedPassword]);

    // Send a success response
    res.status(201).json({ message: 'User signed up successfully', results: results });
  } catch (error) {
      // Log error and send error response
      console.log(error);
      res.status(500).json({ message: 'Error signing up user', error: error });
    }
});

//LOG IN
app.post('/login', (req, res) => {
  console.log(req.body);
  const { email, password } = req.body;

  //query
  const query = 'SELECT * FROM users WHERE Email = ? AND Password = ?';
  connection.execute(query, [email, password], (error, results) => {

    if (error) {
      res.status(500).json({ message: 'Error logging in', error: error });
    }

    else {

      // Good Login
      if (results.length > 0) {
        res.status(200).json({ message: 'User logged in successfully', user: results[0] });
      }
        // No user found with the login credentials
        else {
        res.status(401).json({ message: 'Invalid email or password' });
      }
    }
  });
});
