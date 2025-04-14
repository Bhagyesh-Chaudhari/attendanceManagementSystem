/**********************************************************************************************************************************
File Name: teacherController.js

File created by: Bhagyesh Chaudhari

Date: 11-04-2025

Description: This file contains the controller functions for handling teacher-related operations such as login, fetching subjects, submitting attendance, and creating a teacher account.

last modified: 12-04-2025

last modified by: Bhagyesh Chaudhari

Description of changes: Added functionality to handle teacher login, fetch subjects, submit attendance, and create a teacher account with a temporary password.

***********************************************************************************************************************************/

const db = require("../db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

//Common function to check if the user is authenticated
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

      // Check if teacher is logging in with temporary password (only for teachers)
      if (teacher.temp_password && teacher.role === "teacher") {
        return res.json({
          message: "Please change your temporary password.",
          firstLogin: true,
          teacherId: teacher.id,
          role: teacher.role,
        });
      }

      // Generate JWT token
      const token = jwt.sign({ id: teacher.id }, process.env.JWT_SECRET);

      res.json({
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

//Teacher Controller functions

/*
This function is used to fetch the subjects assigned to the teacher
It takes the teacher ID from the request object and queries the database to get the subjects and their corresponding classes
It returns the subjects and classes in JSON format
*/

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

/*
This function is used to submit attendance for a specific class and subject
It takes the teacher ID, class ID, subject ID, attendance list, and date from the request body
It maps through the attendance list and prepares the values to be inserted into the database
It uses a bulk insert query to insert the attendance records into the database
It returns a success message if the attendance is submitted successfully
*/

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
    "INSERT INTO attendance (teacher_id, class_id, subject_id, student_name, status, date) VALUES ?",
    [values],
    (err) => {
      if (err) return res.status(500).json({ error: err });
      res.json({ message: "Attendance submitted" });
    }
  );
};

/*
This function is used to fetch the students of a specific class
It takes the class ID from the request query and queries the database to get the students of that class
It returns the students in JSON format
*/

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

//Admin Controller functions

/*
This function is used to create a new teacher account with a temporary password
The temporary password is hashed and stored in the database
The teacher is informed to change their password upon first login
The function checks if the email already exists in the database before creating a new account
If the email already exists, it returns a 409 status code with a message indicating that the email is already registered
If the account is created successfully, it returns a 201 status code with a success message and the teacher ID 
*/

exports.createTeacher = async (req, res) => {
  const { name, email, tempPassword } = req.body;

  try {
    // Check if email already exists
    db.query(
      "SELECT * FROM teachers WHERE email = ?",
      [email],
      async (err, results) => {
        if (err) return res.status(500).json({ error: err });

        if (results.length > 0) {
          return res.status(409).json({ message: "Email already registered" });
        }

        // Hash temporary password
        const hashedTempPassword = await bcrypt.hash(tempPassword, 10);

        // Insert new teacher with temporary password
        db.query(
          "INSERT INTO teachers (name, email, password, role) VALUES (?, ?, ?, ?)",
          [name, email, hashedTempPassword, "teacher"], // Role is teacher by default
          (err, result) => {
            if (err) return res.status(500).json({ error: err });

            res.status(201).json({
              message:
                "Teacher account created successfully. Please inform the teacher to change their password upon first login.",
              teacherId: result.insertId,
            });
          }
        );
      }
    );
  } catch (error) {
    res.status(500).json({ error: "Something went wrong" });
  }
};

/*
This function is used to update the teacher's password
It takes the teacher ID and the new password from the request body
It hashes the new password and updates the teacher's password in the database
*/

exports.updatePassword = async (req, res) => {
  const { teacherId, newPassword } = req.body;

  try {
    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update the teacher's password and remove the temporary password
    db.query(
      "UPDATE teachers SET password = ? WHERE id = ?",
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

// Class Controller functions

/*
This function is used to add a new class to the database
It takes the class name from the request body and inserts it into the database
If the class name is not provided, it returns a 400 status code with a message indicating that the class name is required
If there is an error while adding the class, it returns a 500 status code with a message indicating that there was an error adding the class
If the class is added successfully, it returns a 201 status code with a success message and the class ID
*/

exports.addClass = (req, res) => {
  const { className } = req.body;

  if (!className) {
    return res.status(400).json({ message: "Class name is required" });
  }

  // Check if the class already exists
  db.query(
    "SELECT * FROM classes WHERE name = ?",
    [className],
    (err, results) => {
      if (err) {
        return res.status(500).json({ message: "Server error", error: err });
      }

      if (results.length > 0) {
        return res.status(409).json({ message: "Class already exists" });
      }

      // If not exists, insert the class
      db.query(
        "INSERT INTO classes (name) VALUES (?)",
        [className],
        (insertErr, insertResult) => {
          if (insertErr) {
            return res
              .status(500)
              .json({ message: "Error adding class", error: insertErr });
          }

          return res.status(201).json({
            message: "Class added successfully",
            classId: insertResult.insertId,
          });
        }
      );
    }
  );
};

/*
This function is used to fetch all classes from the database
It queries the database to get all classes and returns them in JSON format
If there is an error while fetching the classes, it returns a 500 status code with a message indicating that there was an error fetching the classes
If the classes are fetched successfully, it returns a 200 status code with the classes in JSON format  
*/

exports.getAllClasses = (req, res) => {
  db.query("SELECT * FROM classes", (err, results) => {
    if (err)
      return res
        .status(500)
        .json({ message: "Error fetching classes", error: err });

    res.json(results);
  });
};

/*
This function is to fetch the branches and years from the database
It queries the database to get all branches and years and returns them in JSON format
*/

exports.getBranchesAndYears = (req, res) => {
  const branchesQuery = `SELECT id AS branch_id, code AS branch_name FROM branches`;
  const yearsQuery = `SELECT id AS year_id, name AS year_name FROM years`;

  db.query(branchesQuery, (err, branchResults) => {
    if (err)
      return res
        .status(500)
        .json({ error: "Error fetching branches", details: err });

    db.query(yearsQuery, (err, yearResults) => {
      if (err)
        return res
          .status(500)
          .json({ error: "Error fetching years", details: err });

      res.json({
        branches: branchResults,
        years: yearResults,
      });
    });
  });
};

// This function is to add a subject in db it will take subject name and subject code
//it will check if the subject already exists in the database

exports.addSubject = (req, res) => {
  const { subjectName, subjectCode } = req.body;

  if (!subjectName || !subjectCode) {
    return res.status(400).json({ message: "All fields are required" });
  }

  //check if the subject already exists in the database
  db.query(
    "SELECT * FROM subjects WHERE name = ?",
    [subjectName],
    (err, results) => {
      if (err) return res.status(500).json({ error: err });

      if (results.length > 0) {
        return res.status(409).json({ message: "Subject already exists" });
      }

      // If not exists, insert the subject
      db.query(
        "INSERT INTO subjects (name, subject_code) VALUES (?, ?)",
        [subjectName, subjectCode],
        (insertErr, insertResult) => {
          if (insertErr) {
            return res
              .status(500)
              .json({ message: "Error adding subject", error: insertErr });
          }

          return res.status(201).json({
            message: "Subject added successfully",
            subjectId: insertResult.insertId,
          });
        }
      );
    }
  );
};

exports.getAllSubjects = (req, res) => {
  db.query("SELECT * FROM subjects", (err, results) => {
    if (err)
      return res
        .status(500)
        .json({ message: "Error fetching subjects", error: err });

    res.json(results);
  });
};

//This endpoint is to add subject to the specific year and branch
//check if subject already assigned to the branch and year

exports.addBranchYearSubject = (req, res) => {
  const { subjectName, branchId, yearId } = req.body;

  if (!subjectName || !branchId || !yearId) {
    return res.status(400).json({ message: "All fields are required" });
  }

  //check if the subject already exists in the branch_year_subjects database in that all id are stored of branch year and subject
  db.query(
    "SELECT * FROM branch_year_subjects WHERE branch_id = ? AND year_id = ? AND subject_id = (SELECT id FROM subjects WHERE name = ?)",
    [branchId, yearId, subjectName],
    (err, results) => {
      if (err) return res.status(500).json({ error: err });

      if (results.length > 0) {
        return res
          .status(409)
          .json({
            message: "Subject already assigned to this branch and year",
          });
      }

      // If not exists, insert the subject
      db.query(
        "INSERT INTO branch_year_subjects (subject_id, branch_id, year_id) VALUES (?, ?, (SELECT id FROM subjects WHERE name = ?))",
        [branchId, yearId, subjectName],
        (insertErr, insertResult) => {
          if (insertErr) {
            return res
              .status(500)
              .json({
                message: "Error adding subject to branch and year",
                error: insertErr,
              });
          }

          return res.status(201).json({
            message: "Subject assigned to branch and year successfully",
            subjectId: insertResult.insertId,
          });
        }
      );
    }
  );
};
