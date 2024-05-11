**How to run this program: 

Upon cloning this program you'll need to have a couple dependencies.
The dependencies in question are :**

**Frontend:
**
    "axios": "^1.6.8",

    "bootstrap": "^5.3.3",

    "react": "^18.2.0",

    "react-bootstrap": "^2.10.2",

    "react-dom": "^18.2.0",

    "react-router-dom": "^6.23.0"


**Backend:**

    "bcrypt": "^5.1.1",

    "bcryptjs": "^2.4.3",

    "body-parser": "^1.20.2",

    "cors": "^2.8.5",

    "dotenv": "^16.4.5",

    "express": "^4.19.2",

    "jsonwebtoken": "^9.0.2",

    "mysql": "^2.18.1",

    "mysql2": "^3.9.7"


**Once you have all the necessary dependencies installed, you will want to create a config.env file that has the following format:**

DB_HOST=ProbabyLocalhost

DB_USER=WhateverYourDatabaseUserIS

DB_PASS=WhateverYourDatabasePWIS

DB_NAME=WhateverYouDecidetoNameYourDB

JWT_SECRET=**********
*This can be random it just has to be some numerical values and probably dont make it too long*
Replace the asterisk for the secret okay? lols



**Now we'll be setting up the database. The database has 6 tables and I will just simply paste the database commands used by our group:

You'll want to create the tables for the database in a certain order. **

**First, you'll want to create the departments table:**

--
-- Table structure for table `departments`
--

CREATE TABLE `departments` (
  `DepartmentID` int NOT NULL AUTO_INCREMENT,
  `DepartmentName` varchar(50) DEFAULT NULL,
  `CollegeName` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`DepartmentID`)
);



Then afterwards, you'll want to create the rooms table:

--
-- Table structure for table `rooms`
--


CREATE TABLE `rooms` (
  `RoomID` int NOT NULL AUTO_INCREMENT,
  `Building` varchar(60) DEFAULT NULL,
  `RoomNum` varchar(60) DEFAULT NULL,
  `Capacity` int DEFAULT NULL,
  PRIMARY KEY (`RoomID`)
);



**Now, we will need courses table: **



--
-- Table structure for table `courses`
--

CREATE TABLE `courses` (
  `CourseID` int NOT NULL AUTO_INCREMENT,
  `CourseName` varchar(60) DEFAULT NULL,
  `DepartmentID` int DEFAULT NULL,
  `CourseCapacity` int DEFAULT NULL,
  `credits` decimal(10,0) DEFAULT NULL,
  `Description` text,
  PRIMARY KEY (`CourseID`),
  KEY `DepartmentID` (`DepartmentID`),
  CONSTRAINT `courses_ibfk_1` FOREIGN KEY (`DepartmentID`) REFERENCES `departments` (`DepartmentID`)
);


**Next is the users table:**

--
-- Table structure for table `users`
--


CREATE TABLE `users` (
  `UserID` int NOT NULL AUTO_INCREMENT,
  `FirstName` varchar(50) DEFAULT NULL,
  `LastName` varchar(50) DEFAULT NULL,
  `Email` varchar(80) DEFAULT NULL,
  `Password` varchar(80) NOT NULL,
  `Role` enum('Admin','Instructor','Student') DEFAULT NULL,
  `DepartmentID` int DEFAULT NULL,
  PRIMARY KEY (`UserID`),
  UNIQUE KEY `Email` (`Email`),
  KEY `DepartmentID` (`DepartmentID`),
  CONSTRAINT `users_ibfk_1` FOREIGN KEY (`DepartmentID`) REFERENCES `departments` (`DepartmentID`)
);




**Then the courseInstances table:**


--
-- Table structure for table `courseinstances`
--


CREATE TABLE `courseinstances` (
  `CourseInstanceID` int NOT NULL AUTO_INCREMENT,
  `CourseID` int DEFAULT NULL,
  `StartTime` time DEFAULT NULL,
  `EndTime` time DEFAULT NULL,
  `DaysOfWeek` varchar(60) DEFAULT NULL,
  `RoomID` int DEFAULT NULL,
  `InstructorID` int DEFAULT NULL,
  PRIMARY KEY (`CourseInstanceID`),
  KEY `CourseID` (`CourseID`),
  KEY `RoomID` (`RoomID`),
  KEY `InstructorID` (`InstructorID`),
  CONSTRAINT `courseinstances_ibfk_1` FOREIGN KEY (`CourseID`) REFERENCES `courses` (`CourseID`),
  CONSTRAINT `courseinstances_ibfk_2` FOREIGN KEY (`RoomID`) REFERENCES `rooms` (`RoomID`),
  CONSTRAINT `courseinstances_ibfk_3` FOREIGN KEY (`InstructorID`) REFERENCES `users` (`UserID`)
);



**And finally, the enrollments table: **


--
-- Table structure for table `enrollments`
--

CREATE TABLE `enrollments` (
  `EnrollmentID` int NOT NULL AUTO_INCREMENT,
  `StudentID` int DEFAULT NULL,
  `CourseInstanceID` int DEFAULT NULL,
  `EnrollmentDate` date DEFAULT NULL,
  PRIMARY KEY (`EnrollmentID`),
  KEY `StudentID` (`StudentID`),
  KEY `CourseInstanceID` (`CourseInstanceID`),
  CONSTRAINT `enrollments_ibfk_1` FOREIGN KEY (`StudentID`) REFERENCES `users` (`UserID`),
  CONSTRAINT `enrollments_ibfk_2` FOREIGN KEY (`CourseInstanceID`) REFERENCES `courseinstances` (`CourseInstanceID`)
);




**Next, populating the database.**

Given that there are many foreign key references for each table, you'll want to make sure that the tables with foreign keys accurately match or you will be in a world of pain. 

For starters, the only two tables that dont have foreign keys are the department and room tables. They will be referenced by other tables though so make sure that you reference them properly in other tables.

In our case, we only made 1 department to make it easier for ourselves:

INSERT INTO departments (DepartmentID, DepartmentName, CollegeName) 
VALUES (1, 'Computer Science', 'Engineering');

However you can create as many departments as needed. Just make sure that you reference them properly. 


Next for rooms, it's the same thing in that you can create as different and as many as you want. Just make sure you reference them properly in other tables. 

In our case, these rows were plenty: 

INSERT INTO rooms (RoomID, Building, RoomNum, Capacity)
VALUES
    (1, 'A', 101, 50),
    (2, 'B', 201, 40),
    (3, 'C', 301, 35),
    (4, 'D', 401, 45),
    (5, 'E', 501, 30),
    (6, 'F', 601, 40),
    (7, 'G', 701, 25),
    (8, 'H', 801, 30),
    (9, 'I', 901, 35),
    (10, 'J', 1001, 25),
    (11, 'K', 1101, 30),
    (12, 'L', 1201, 35),
    (13, 'M', 1301, 25),
    (14, 'N', 1401, 30),
    (15, 'O', 1501, 35),
    (16, 'P', 1601, 25),
    (17, 'Q', 1701, 30),
    (18, 'R', 1801, 35),
    (19, 'S', 1901, 25),
    (20, 'T', 2001, 30),
    (21, 'U', 2101, 35),
    (22, 'V', 2201, 25),
    (23, 'W', 2301, 30),
    (24, 'X', 2401, 35),
    (25, 'Y', 2501, 25),
    (26, 'Z', 2601, 30),
    (27, 'AA', 2701, 35),
    (28, 'BB', 2801, 25),
    (29, 'CC', 2901, 30),
    (30, 'DD', 3001, 35);



Now for courses. Again, you can create as different and as many as you want. Just make sure you reference them properly in other tables. 

We started off with 15 entries shown below: 

INSERT INTO `courses` (`CourseID`, `CourseName`, `DepartmentID`, `CourseCapacity`, `credits`, `Description`)
VALUES 
(NULL, 'Introduction to Computer Science', 1, 30, 3, 'An introductory course covering fundamental concepts of computer science.'),
(NULL, 'Data Structures and Algorithms', 1, 25, 4, 'A course focusing on data structures, algorithms, and their analysis.'),
(NULL, 'Database Systems', 1, 20, 3, 'A study of database systems, including data modeling, query languages, and database design.'),
(NULL, 'Operating Systems', 1, 35, 4, 'An exploration of operating system principles and concepts.'),
(NULL, 'Computer Networks', 1, 30, 3, 'A course covering the principles and protocols of computer networking.'),
(NULL, 'Software Engineering', 1, 25, 4, 'An overview of software engineering principles and practices.'),
(NULL, 'Artificial Intelligence', 1, 20, 3, 'An introduction to artificial intelligence techniques and applications.'),
(NULL, 'Machine Learning', 1, 35, 4, 'A study of algorithms and models that computer systems use to perform tasks without explicit instructions.'),
(NULL, 'Cybersecurity', 1, 30, 3, 'An overview of cybersecurity principles and practices to protect computer systems and data.'),
(NULL, 'Computer Graphics', 1, 25, 4, 'A course covering the principles and algorithms used in computer graphics.'),
(NULL, 'Web Development', 1, 20, 3, 'An introduction to web development technologies and practices.'),
(NULL, 'Software Testing and Quality Assurance', 1, 35, 4, 'A study of techniques and methodologies for testing and ensuring the quality of software products.'),
(NULL, 'Parallel and Distributed Computing', 1, 30, 3, 'An exploration of parallel and distributed computing systems and algorithms.'),
(NULL, 'Computer Architecture', 1, 25, 4, 'A study of computer architecture principles and design techniques.'),
(NULL, 'Embedded Systems', 1, 20, 3, 'An introduction to the design and programming of embedded systems.');


This is the critical part and what might make the program not run properly: creating courseinstances that match with the courses. 

Our courseinstances table that matches the 15 entries above. 

INSERT INTO courseinstances (CourseInstanceID, CourseID, StartTime, EndTime, DaysOfWeek, RoomID, InstructorID)
VALUES 
(NULL, 1, '08:00:00', '10:00:00', 'Monday,Wednesday,Friday', 1, 4),
(NULL, 2, '09:00:00', '11:00:00', 'Tuesday,Thursday', 2, 2),
(NULL, 3, '10:00:00', '12:00:00', 'Monday,Wednesday,Friday', 3, 3),
(NULL, 4, '11:00:00', '13:00:00', 'Tuesday,Thursday', 4, 4),
(NULL, 5, '12:00:00', '14:00:00', 'Monday,Wednesday,Friday', 5, 2), 
(NULL, 6, '13:00:00', '15:00:00', 'Tuesday,Thursday', 6, 3),
(NULL, 7, '14:00:00', '16:00:00', 'Monday,Wednesday,Friday', 7, 4),
(NULL, 8, '15:00:00', '17:00:00', 'Tuesday,Thursday', 8, 2),
(NULL, 9, '16:00:00', '18:00:00', 'Monday,Wednesday,Friday', 9, 3),
(NULL, 10, '17:00:00', '19:00:00', 'Tuesday,Thursday', 10, 4),
(NULL, 11, '18:00:00', '20:00:00', 'Monday,Wednesday,Friday', 11, 2),
(NULL, 12, '19:00:00', '21:00:00', 'Tuesday,Thursday', 12, 3),
(NULL, 13, '08:30:00', '10:30:00', 'Monday,Wednesday,Friday', 13, 4),
(NULL, 14, '09:30:00', '11:30:00', 'Tuesday,Thursday', 14, 2),
(NULL, 15, '10:30:00', '12:30:00', 'Monday,Wednesday,Friday', 15, 3);


**NOW** You might notice that there's technically an insertion anomally since the InstructorID which is a foreign key for UserID does not yet exist.
If you get an error for it, then please do the following:
Manually create instructors by inserting them into the users table OR
Run the actual program and sign up as an instructor in the signup page.  

Whatever you do, just make sure that you can login as the instructor after and that the instructor user is inserted properly.

Additionally, in the courseinstances sql insert commands that you see above, the InstructorIDs are within 2, 3 and 4. Make sure that whatever UserID the instructor 
that you created was that you replace it in the commands and match them. Otherwise, you will have a nonexistent instructor teaching certain courses.
In our case, we already had set up instructors that were at the 2, 3 and 4 IDs. 

Now, you'll probably want at least 1 admin user to manage everything. Just simply make an insert query into the users table like so: 

INSERT INTO users (UserID, FirstName, LastName, Email, Password, Role, DepartmentID)
VALUES (1, 'Name', 'Name', 'email@gmail.com', 'PWthatwillbehashedsorememberit', 'Admin', NULL);

If you already made new students/instructor users before this, then you will have to change the UserID probably. 
It is autoincrement though, so if you leave the UserID as NULL, that should be fine too.

To actually launch the project, make sure to open up two console windows in your IDE (We're going to assume it's VSCode). 
Then, you'll want to:

cd Client 
npm run dev

(Click/navigate to localhost on your browser)

on one console. Then:

cd Server
node server.js

At this point, you should be able to run the project all the way through!
