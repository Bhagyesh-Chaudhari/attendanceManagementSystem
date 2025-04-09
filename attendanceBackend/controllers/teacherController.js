const db = require('../db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.login = (req, res) => {
  const { email, password } = req.body;

  db.query('SELECT * FROM teachers WHERE email = ?', [email], async (err, results) => {
    if (err) return res.status(500).json({ error: err });

    if (results.length === 0) return res.status(401).json({ message: 'Invalid credentials' });

    const teacher = results[0];
    const match = await bcrypt.compare(password, teacher.password);

    if (!match) return res.status(401).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ id: teacher.id }, process.env.JWT_SECRET);
    res.json({ token, teacher });
  });
};

exports.getSubjects = (req, res) => {
  const teacherId = req.user.id;

  db.query(
    `SELECT s.id as subject_id, s.name as subject_name, c.id as class_id, c.name as class_name 
     FROM subjects s
     JOIN classes c ON s.class_id = c.id
     WHERE s.id IN (SELECT subject_id FROM teacher_subject WHERE teacher_id = ?)`,
    [teacherId],
    (err, results) => {
      if (err) return res.status(500).json({ error: err });
      res.json(results);
    }
  );
};

exports.submitAttendance = (req, res) => {
  const teacherId = req.user.id;
  const { classId, subjectId, attendanceList, date } = req.body;

  const values = attendanceList.map((entry) => [
    teacherId,
    classId,
    subjectId,
    entry.student_name,
    entry.status,
    date,
  ]);

  db.query(
    'INSERT INTO attendance (teacher_id, class_id, subject_id, student_name, status, date) VALUES ?',
    [values],
    (err) => {
      if (err) return res.status(500).json({ error: err });
      res.json({ message: 'Attendance submitted' });
    }
  );
};

exports.getStudents = (req, res) => {
    const { classId } = req.query;
  
    db.query('SELECT name FROM students WHERE class_id = ?', [classId], (err, results) => {
      if (err) return res.status(500).json({ error: err });
      res.json(results);
    });
  };