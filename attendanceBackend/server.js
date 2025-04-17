/**********************************************************************************************************************************
File Name: server.js

File created by: Bhagyesh Chaudhari

Date: 11-04-2025

Description: This file sets up the Express server and defines the routes for handling teacher-related operations. It uses middleware for authentication and connects to the database.

last modified: 12-04-2025

last modified by: Bhagyesh Chaudhari

Description of changes: Added routes for teacher login, fetching subjects, submitting attendance, and creating a teacher account. Integrated JWT authentication middleware to protect routes.

***********************************************************************************************************************************/


const express = require('express');
const cors = require('cors');
require('dotenv').config();

// const controller = require('./controllers/controller');
const teacherController = require('./controllers/teacherController');
const auth = require('./middlewares/auth');

const app = express();
app.use(cors());
app.use(express.json());

//Common route to check if the user is authenticated
app.post('/login', teacherController.login);

// Define teacher routes directly here
app.get('/teacher/subjects', auth, teacherController.getSubjects);
app.post('/teacher/attendance', auth, teacherController.submitAttendance);
app.get('/teacher/students', auth, teacherController.getStudents);
app.post('/teacher/attendancePage', auth, teacherController.getAttendance);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});