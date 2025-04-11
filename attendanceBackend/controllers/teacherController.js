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
  const { class_id, subjectId, attendanceList, date } = req.body;

  const values = attendanceList.map((entry) => [
    teacherId,
    class_id,
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
    const { class_id } = req.query;
  
    db.query('SELECT * FROM students WHERE class_id = ?', [class_id], (err, results) => {
      if (err) return res.status(500).json({ error: err });
      res.json(results);
    });
  };

  exports.signup = async (req, res) => {
    const { name, email, password } = req.body;
  
    try {
      // Check if email already exists
      db.query('SELECT * FROM teachers WHERE email = ?', [email], async (err, results) => {
        if (err) return res.status(500).json({ error: err });
  
        if (results.length > 0) {
          return res.status(409).json({ message: 'Email already registered' });
        }
  
        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);
  
        // Insert new teacher
        db.query(
          'INSERT INTO teachers (name, email, password) VALUES (?, ?, ?)',
          [name, email, hashedPassword],
          (err, result) => {
            if (err) return res.status(500).json({ error: err });
  
            res.status(201).json({ message: 'Teacher registered successfully', id: result.insertId });
          }
        );
      });
    } catch (error) {
      res.status(500).json({ error: 'Something went wrong' });
    }
  };
  