require('dotenv').config({ path: 'config.env' });

const express = require('express');
const cors = require('cors')
const mysql = require('mysql2');
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
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
app.post('/login', async (req, res) => {
  // console.log(req.body);
  const { email, password } = req.body;

  //query
  try {
    const query = 'SELECT * FROM users WHERE Email = ?';
    const [users] = await connection.promise().execute(query, [email]);

    // Check if the user exists
    if (users.length > 0) {
      const user = users[0];

      // Compare provided password with stored hashed password
      const isMatch = await bcryptjs.compare(password, user.Password);

      if (isMatch) {
        const payload = { id: user.UserID, role: user.Role };
        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

        // Respond with token and user details
        res.json({
          message: 'User logged in successfully',
          token: token,
          user: {
            id: user.UserID,
            role: user.Role,
            firstName: user.FirstName,
            lastName: user.LastName
          }
        });
      } else {
        // Password does not match
        res.status(401).json({ message: 'Invalid email or password' });
      }
    } else {
      // User not found
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Error logging in', error: error });
  }
});

app.delete('/users/:id', async (req, res) => {
  const userId = req.params.id;

  try {
      const query = 'DELETE FROM users WHERE UserID = ?';

      const [result] = await connection.promise().execute(query, [userId]);

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

// Get all Students
app.get('/students', async (req, res) => {
  try {
    const query = 'SELECT * FROM users WHERE Role = "Student"';
    const [students] = await connection.promise().execute(query);
    res.status(200).json({ students });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching students', error });
  }
})

// Get all instructos
app.get('/instructors', async (req, res) => {
  try {
      const query = 'SELECT * FROM users WHERE Role = "Instructor"';
      const [instructors] = await connection.promise().execute(query);
      res.status(200).json({ instructors });
    } catch (error) {
      res.status(500).json({ message: 'Error fetching instructors', error });
    }
})

app.put('/users/:id', async (req, res) => {
  const userId = req.params.id;
  const { FirstName, LastName, Email, Role } = req.body;

  // console.log(`Updating user ${userId} with data`, req.body);

  if (!FirstName || !LastName || !Email || !Role) {
    return res.status(400).json({ message: 'All fields are required' });
}
  try {
      const query = 'UPDATE users SET FirstName = ?, LastName = ?, Email = ?, Role = ? WHERE UserID = ?';
      const [result] = await connection.promise().execute(query, [FirstName, LastName, Email, Role, userId]);

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

app.get('/departments', async (res) => {
  try {
    const query = 'SELECT * FROM departments';
    const [rows] = await connection.promise().execute(query);

    res.status(200).json({ message: 'Departments retrieved successfully', departments: rows });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Error retrieving departments', error: error });
  }
});


app.delete('/department/:id', async (res) => {
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

//getting rooms
app.get('/rooms', async (res) => {
  try {

    const query = 'SELECT * FROM rooms';
    const [rows] = await connection.promise().execute(query);
    res.status(200).json({ message: 'Rooms retrieved successfully', rooms: rows });

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Error retrieving rooms', error: error });
  }
});


app.delete('/rooms/:id', async (res) => {
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
});



//getting courses 
app.get('/courses', async (req, res) => {

  try {
    const query = 'SELECT * FROM courses';
  
    const [courses] = await connection.promise().execute(query);
  
    res.status(200).json({ courses });
  
  } catch (error) {
    res.status(500).json({ error: 'Error fetching courses', error });
  }
});


//WORKS YIPPEEE
//getting course instances
app.get('/courseinstances', async (req, res) => {
  try {
    const query = 'SELECT * FROM courseinstances';
    const [course_inst] = await connection.promise().execute(query);
    res.status(200).json({ courseInstances: course_inst }); 
  } catch (error) {
    res.status(500).json({ error: 'Error fetching course instances', error });
  }
});


// Get studentID of currently logged-in user
app.get('/api/studentID', async (req, res) => {
  try {
      // Getting userID from the JWT payload
      const token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const userID = decoded.id;

      const query = 'SELECT UserID FROM users WHERE UserID = ? AND Role = "Student"';
      const [result] = await connection.promise().execute(query, [userID]);

      if (result.length > 0) {
          const studentID = result[0].UserID;
          res.status(200).json({ studentID });
      } else {
          res.status(404).json({ message: 'StudentID not found for user' });
      }
  } catch (error) {
      console.error('Error fetching studentID:', error);
      res.status(500).json({ error: 'Internal server error' });
  }
});


//For course enroll (student view)
app.post('/enroll', async (req, res) => {
  try {

    const { studentID, courseID } = req.body;

    // Check if the student is already enrolled in the course
    const existingEnrollmentQuery = 'SELECT * FROM enrollments WHERE StudentID = ? AND CourseInstanceID = ?';
    const [existingEnrollmentRows] = await connection.promise().execute(existingEnrollmentQuery, [studentID, courseID]);

    if (existingEnrollmentRows.length > 0) {
      // Student is already enrolled in the course
      return res.status(400).json({ error: 'Student is already enrolled in this course' });
    }

    //just gets irl date for when the enroll button is clicked LOLs 
    const enrollmentDate = new Date().toISOString().slice(0, 10); 

    //i check
    console.log('Student ID:', studentID);
    console.log('Course ID:', courseID);
    console.log('Enrollment Date:', enrollmentDate);

    const query = 'INSERT INTO enrollments (StudentID, CourseInstanceID, EnrollmentDate) VALUES (?, ?, ?)';
    const [result] = await connection.promise().execute(query, [studentID, courseID, enrollmentDate]);

    res.status(201).json({ message: 'Enrollment successful', result });
  } catch (error) {
    console.error('Error enrolling in course:', error);
    res.status(500).json({ error: 'Failed to enroll in course', error });
  }
});

//gets the enrollments for the specific user 
//most likely students + instructor???
app.get('/enrollments', (req, res) => {
  try {
    connection.query('SELECT * FROM enrollments', (error, results) => {
      if (error) {
        console.error('Error executing MySQL query: ' + error.stack);
        return res.status(500).json({ error: 'Internal Server Error' });
      }
      res.json(results);
    });
  } catch (error) {
    console.error('Error occurred during database query: ' + error.stack);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/instructor-courses/:instructorId', async (req, res) => {
  const instructorId = req.params.instructorId;

  // Ensure that instructorId is valid (e.g., not null, is a number)
  if (!instructorId || isNaN(instructorId)) {
      return res.status(400).json({ message: 'Invalid instructor ID provided' });
  }

  try {
      // Adjusted query to check the correct linkage and fields
      const query = `
          SELECT c.CourseName, c.CourseID, ci.StartTime, ci.EndTime, ci.DaysOfWeek, ci.RoomID
          FROM courseinstances ci
          JOIN courses c ON ci.CourseID = c.CourseID
          WHERE ci.InstructorID = ?
      `;
      
      // Execute the query with parameter safety
      const [courses] = await connection.promise().execute(query, [instructorId]);

      if (courses.length > 0) {
          res.status(200).json({ courses });
      } else {
          res.status(404).json({ message: 'No courses found for this instructor' });
      }
  } catch (error) {
      console.error('Error fetching courses for instructor:', error);
      res.status(500).json({ error: 'Internal server error', message: error.message });
  }
});

//for getting student IDs in the Student page
app.get('/students/:id', async (req, res) => {
  const { id } = req.params;

  try {
      const query = 'SELECT * FROM users WHERE UserID = ? AND Role = "Student"';
      const [students] = await connection.promise().execute(query, [id]);

      if (students.length > 0) {
          res.status(200).json(students[0]);
      } else {
          res.status(404).json({ message: 'Student not found' });
      }
  } catch (error) {
      console.error('Error fetching student:', error);
      res.status(500).json({ message: 'Internal server error', error });
  }
});

//for deleting enrollments in the student page 
//hopefully it works? question mark question mark
app.delete('/enrollments/:enrollmentId', async (req, res) => {
  const { enrollmentId } = req.params;

  try {
      const query = 'DELETE FROM enrollments WHERE EnrollmentID = ?';
      const [result] = await connection.promise().execute(query, [enrollmentId]);

      if (result.affectedRows === 1) {
          res.status(200).json({ message: 'Enrollment deleted successfully' });
      } else {
          res.status(404).json({ message: 'Enrollment not found' });
      }
  } catch (error) {
      console.error('Error deleting enrollment:', error);
      res.status(500).json({ message: 'Internal server error', error });
  }
});


//adding course
app.post('/courses', async (req, res) => {
  try {

      console.log('Request Body:', req.body);
      const { CourseName, DepartmentID, CourseCapacity, credits, Description, StartTime, EndTime, DaysOfWeek, RoomID, InstructorID } = req.body;

      // Add the course to the courses table
      const courseQuery = 'INSERT INTO courses (CourseName, DepartmentID, CourseCapacity, credits, Description) VALUES (?, ?, ?, ?, ?)';
      const courseValues = [CourseName, DepartmentID, CourseCapacity, credits, Description];

      // Execute the course insertion query
      const [courseInsertionResult] = await connection.promise().execute(courseQuery, courseValues);

      // Retrieve the newly generated CourseID
      const CourseID = courseInsertionResult.insertId;

      // Add the course instance to the courseinstances table
      const courseInstanceQuery = 'INSERT INTO courseinstances (CourseID, StartTime, EndTime, DaysOfWeek, RoomID, InstructorID) VALUES (?, ?, ?, ?, ?, ?)';
      const courseInstanceValues = [CourseID, StartTime, EndTime, DaysOfWeek, RoomID, InstructorID];

      // Execute the course instance insertion query
      await connection.promise().execute(courseInstanceQuery, courseInstanceValues);

      res.status(201).json({ message: 'Course and CourseInstance added successfully' });
  } catch (error) {
      console.error('Error adding course:', error);
      res.status(500).json({ message: 'Internal server error', error });
  }
});

// Update a course
app.put('/courses/:id', async (req, res) => {
  const courseId = req.params.id;
  const { CourseName, DepartmentID, CourseCapacity, credits, Description } = req.body;
  try {
    const query = 'UPDATE courses SET CourseName = ?, DepartmentID = ?, CourseCapacity = ?, credits = ?, Description = ? WHERE CourseID = ?';
    const [result] = await connection.promise().execute(query, [CourseName, DepartmentID, CourseCapacity, credits, Description, courseId]);
    if (result.affectedRows === 0) {
      res.status(404).json({ message: 'Course not found' });
    } else {
      res.status(200).json({ message: 'Course updated successfully' });
    }
  } catch (error) {
    console.error('Error updating course:', error);
    res.status(500).json({ message: 'Internal server error', error });
  }
});

app.delete('/courses/:id', async (req, res) => {
  const courseId = req.params.id;
  try {
    // Delete dependent records from the courseinstances table
    const deleteInstancesQuery = 'DELETE FROM courseinstances WHERE CourseID = ?';
    await connection.promise().execute(deleteInstancesQuery, [courseId]);

    // Now that dependent records are deleted, delete the course
    const deleteCourseQuery = 'DELETE FROM courses WHERE CourseID = ?';
    const [result] = await connection.promise().execute(deleteCourseQuery, [courseId]);

    if (result.affectedRows === 0) {
      res.status(404).json({ message: 'Course not found' });
    } else {
      res.status(200).json({ message: 'Course deleted successfully' });
    }
  } catch (error) {
    console.error('Error deleting course:', error);
    res.status(500).json({ message: 'Internal server error', error });
  }
});



app.get('/coursesWithInstances', async (req, res) => {
  try {
    const query = `
      SELECT 
        ci.CourseInstanceID,
        ci.CourseID,
        ci.StartTime,
        ci.EndTime,
        ci.DaysOfWeek,
        ci.RoomID,
        ci.InstructorID,
        c.CourseName,
        c.DepartmentID,
        c.CourseCapacity,
        c.credits,
        c.Description
      FROM 
        courseinstances ci
      INNER JOIN 
        courses c ON ci.CourseID = c.CourseID;
    `;
    
    const [results] = await connection.promise().query(query);
    
    res.status(200).json(results);
  } catch (error) {
    console.error('Error fetching course instances:', error);
    res.status(500).json({ message: 'Internal server error', error });
  }
});
