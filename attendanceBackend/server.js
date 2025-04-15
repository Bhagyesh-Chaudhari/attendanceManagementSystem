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

const controller = require('./controllers/controller');
const auth = require('./middlewares/auth');

const app = express();
app.use(cors());
app.use(express.json());

//Common route to check if the user is authenticated
app.post('/login', controller.login);
app.post('/update-password', controller.updatePassword);


// Define teacher routes directly here
app.get('/teacher/subjects', auth, controller.getSubjects);
app.post('/teacher/attendance', auth, controller.submitAttendance);
app.get('/teacher/students', auth, controller.getStudents);
app.post('/teacher/updatePassword', auth, controller.updatePassword);


// Define admin routes directly here
app.post('/admin/createTeacher', auth, controller.createTeacher);
app.get('/admin/getAllTeachers', auth, controller.getAllTeachers);
app.post('/admin/addClass', auth, controller.addClass);
app.post('/admin/getFilteredClasses', auth, controller.getFilteredClasses);
app.get('/admin/getBranchesAndYears', auth, controller.getBranchesAndYears);
app.post('/admin/addSubject', auth, controller.addSubject);
app.get('/admin/getAllSubjects', auth, controller.getAllSubjects);
app.post('/admin/addBranchYearSubject', auth, controller.addBranchYearSubject);
app.post('/admin/getSubjectsByBranchYear', auth, controller.getSubjectsByBranchYear);
app.post('/admin/assignSubjectToTeacher', auth, controller.assignSubjectToTeacher);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});