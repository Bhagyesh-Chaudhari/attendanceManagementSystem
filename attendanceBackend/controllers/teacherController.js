const db = require("../db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

//Login
exports.login = (req, res) => {
  const { email, password } = req.body;

  db.query(
    "SELECT * FROM teachers WHERE email = ?",
    [email],
    async (err, results) => {
      if (err) return res.status(500).json({ error: err });

      if (results.length === 0)
        return res.status(401).json({ message: "Invalid credentials" });

      const teacher = results[0];
      const match = await bcrypt.compare(password, teacher.password);

      if (!match)
        return res.status(401).json({ message: "Invalid credentials" });

      // ✅ Check if using temporary password
      if (teacher.is_temp_password && teacher.role === "teacher") {
        return res.status(200).json({
          message: "Please change your temporary password.",
          firstLogin: true,
          teacherId: teacher.id,
          role: teacher.role,
        });
      }

      const token = jwt.sign({ id: teacher.id }, process.env.JWT_SECRET);

      res.status(200).json({
        message: "Login successful",
        token,
        teacher: {
          id: teacher.id,
          name: teacher.name,
          email: teacher.email,
          role: teacher.role,
        },
      });
    }
  );
};

//Update Password
exports.updatePassword = async (req, res) => {
  const { teacherId, newPassword } = req.body;

  try {
    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update the password and set is_temp_password to 0 (false)
    db.query(
      "UPDATE teachers SET password = ?, is_temp_password = 0 WHERE id = ?",
      [hashedPassword, teacherId],
      (err) => {
        if (err) return res.status(500).json({ error: err });

        res.json({ message: "Password updated successfully." });
      }
    );
  } catch (error) {
    res.status(500).json({ error: "Something went wrong" });
  }
};

//Get Subjects
exports.getSubjects = (req, res) => {
  const teacherId = req.user.id;

  const query = `
      SELECT 
        s.id AS subject_id,
        s.name AS subject_name,
        c.id AS class_id,
        c.name AS class_name
      FROM teacher_subject ts
      JOIN branch_year_subjects bys ON ts.branch_year_subject_id = bys.id
      JOIN subjects s ON bys.subject_id = s.id
      JOIN classes c ON ts.class_id = c.id
      WHERE ts.teacher_id = ?
    `;

  db.query(query, [teacherId], (err, results) => {
    if (err)
      return res.status(500).json({ error: "Database error", details: err });
    res.json(results);
  });
};

//submit attendance
exports.submitAttendance = (req, res) => {
  const teacherId = req.user.id;
  const { class_id, subjectId, attendanceList, date, time_slot } = req.body;

  if (!time_slot || !date) {
    return res
      .status(400)
      .json({ message: "Date and time slot are required." });
  }

  const values = attendanceList.map((entry) => [
    teacherId,
    class_id,
    subjectId,
    entry.student_name,
    entry.status,
    date,
    time_slot,
  ]);

  const query = `
      INSERT INTO attendance (
        teacher_id, class_id, subject_id, student_name, status, date, time_slot
      ) VALUES ?
    `;

  db.query(query, [values], (err) => {
    if (err) {
      if (err.code === "ER_DUP_ENTRY") {
        return res.status(409).json({
          message:
            "Attendance for this lecture time slot has already been submitted.",
        });
      }

      return res.status(500).json({ error: err });
    }

    res.json({ message: "Attendance submitted successfully." });
  });
};

//Get students
exports.getStudents = (req, res) => {
  const { class_id } = req.query;

  db.query(
    "SELECT * FROM students WHERE class_id = ?",
    [class_id],
    (err, results) => {
      if (err) return res.status(500).json({ error: err });
      res.json(results);
    }
  );
};

//Get attendance
exports.getAttendance = async (req, res) => {
  const { classId, subjectId } = req.body;

  // Validate the parameters
  if (!classId || !subjectId) {
    return res.status(400).json({
      message: "Class ID and Subject ID are required",
    });
  }

  // Query to get the attendance records
  const query = `
      SELECT student_name, status, date, time_slot
      FROM attendance
      WHERE class_id = ? AND subject_id = ?
      ORDER BY date DESC, time_slot;
    `;

  try {
    // Using a promise to handle async database query
    const [results] = await db.promise().query(query, [classId, subjectId]);

    if (results.length > 0) {
      res.json({ success: true, data: results });
    } else {
      res.status(404).json({ success: false, message: "No attendance found." });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error." });
  }
};
