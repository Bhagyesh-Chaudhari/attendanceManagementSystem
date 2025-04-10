const express = require('express');
const cors = require('cors');
require('dotenv').config();

const teacherController = require('./controllers/teacherController');
const auth = require('./middlewares/auth');

const app = express();
app.use(cors());
app.use(express.json());

// Define teacher routes directly here
app.post('/teacher/login', teacherController.login);
app.get('/teacher/subjects', auth, teacherController.getSubjects);
app.post('/teacher/attendance', auth, teacherController.submitAttendance);
app.get('/teacher/students', auth, teacherController.getStudents);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});