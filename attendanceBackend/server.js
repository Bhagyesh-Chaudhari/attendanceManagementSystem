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