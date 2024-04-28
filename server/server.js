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

app.delete('/users/:id', async (req, res) => {
  const userId = req.params.id;

  try {
      const connection = await pool.getConnection();

      const [result] = await connection.query('DELETE FROM users WHERE id = ?', [userId]);

      connection.release();

      if (result.affectedRows === 1) {
          res.status(200).json({ message: 'User deleted successfully' });
      } else {
          res.status(404).json({ error: 'User not found' });
      }
  } catch (error) {
      console.error('Error deleting user:', error);
      res.status(500).json({ error: 'Internal server error' });
  }
});

app.put('/users/:id', async (req, res) => {
  const userId = req.params.id;
  const userData = req.body; 

  try {
      const connection = await pool.getConnection();
      const [result] = await connection.query('UPDATE users SET ? WHERE id = ?', [userData, userId]);

      connection.release();

      if (result.affectedRows === 1) {
          res.status(200).json({ message: 'User updated successfully' });
      } else {
          res.status(404).json({ error: 'User not found' });
      }
  } catch (error) {
      console.error('Error updating user:', error);
      res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/department', async (req, res) => {
  try {
    console.log(req.body);

    const { Name, CollegeName } = req.body;
    const query = 'INSERT INTO departments (DepartmentName, CollegeName) VALUES (?, ?)';
    const [results] = await connection.promise().execute(query, [Name, CollegeName]);

    res.status(201).json({ message: 'Department created successfully', results: results });
  } catch (error) {
      console.log(error);
      res.status(500).json({ message: 'Error creating department', error: error });
  }
});

app.delete('/department/:id', async (req, res) => {
  try {
    const connection = await pool.getConnection();

    const [result] = await connection.query('DELETE FROM department WHERE id = ?', [DepartmentID]);

    connection.release();

    if (result.affectedRows === 1) {
      res.status(200).json({ message: 'Department deleted successfully' });
    } else {
      res.status(404).json({ error: 'Department not found' });
    }
  } catch (error) {
    console.error('Error deleting Department:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/rooms', async (req, res) => {
  try {
    console.log(req.body);

    const { Building, RoomNum, Capacity } = req.body;
    const query = 'INSERT INTO rooms (Building, RoomNum, Capacity) VALUES (?, ?, ?';
    const [results] = await connection.promise().execute(query, [Building, RoomNum, Capacity]);
    
    res.status(201).json({ message: 'Room added successfully', results: results });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Error adding room', error: error });
  }
})

app.delete('/rooms/:id', async (req, res) => {
  try {
    const connection = await pool.getConnection();

    const [result] = await connection.query('DELETE FROM Rooms WHERE id = ?', [RoomID]);

    connection.release();

    if (result.affectedRows === 1) {
      res.status(200).json({ message: 'Room deleted successfully' });
    } else {
      res.status(404).json({ error: 'Room not found' });
    }
  } catch {
    console.error('Error removing Room', error);
    res.status(500).json({ error: 'Internal server error' });
  }
})



