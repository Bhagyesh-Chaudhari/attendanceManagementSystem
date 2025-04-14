CREATE DATABASE attendance_system;
USE attendance_system;

select * from branches;
select * from years;
select * from teachers;
select * from subjects;
select * from classes;
select * from attendance;
select * from teacher_subject;
select * from students;
select * from branch_year_subjects;


CREATE TABLE teachers (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100),
  email VARCHAR(100) UNIQUE,
  password VARCHAR(255),
  role ENUM('admin', 'teacher') DEFAULT 'teacher'
);

CREATE TABLE branches (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  code VARCHAR(10) UNIQUE NOT NULL
);

CREATE TABLE years (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(50) NOT NULL
);

CREATE TABLE branch_year_subjects (
  id INT AUTO_INCREMENT PRIMARY KEY,
  branch_id INT NOT NULL,
  year_id INT NOT NULL,
  subject_id INT NOT NULL,
  FOREIGN KEY (branch_id) REFERENCES branches(id),
  FOREIGN KEY (year_id) REFERENCES years(id),
  FOREIGN KEY (subject_id) REFERENCES subjects(id),
  UNIQUE(branch_id, year_id, subject_id)
);

CREATE TABLE classes (	
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(50)
);

CREATE TABLE students (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100),
  class_id INT,
  FOREIGN KEY (class_id) REFERENCES classes(id)
);

CREATE TABLE subjects (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100),
  class_id INT,
  FOREIGN KEY (class_id) REFERENCES classes(id)
);

CREATE TABLE teacher_subject (
  teacher_id INT,
  subject_id INT,
  PRIMARY KEY (teacher_id, subject_id),
  FOREIGN KEY (teacher_id) REFERENCES teachers(id),
  FOREIGN KEY (subject_id) REFERENCES subjects(id)
);

CREATE TABLE attendance (
  id INT AUTO_INCREMENT PRIMARY KEY,
  teacher_id INT,
  class_id INT,
  subject_id INT,
  student_name VARCHAR(100),
  status ENUM('present', 'absent'),
  date DATE,
  FOREIGN KEY (teacher_id) REFERENCES teachers(id),
  FOREIGN KEY (class_id) REFERENCES classes(id),
  FOREIGN KEY (subject_id) REFERENCES subjects(id)
);

INSERT INTO teachers (name, email, password, role) 
VALUES ('Admin', 'admin@school.com', '$2b$10$Go6zVsn2zzL.feu91XUY3uCo.q.EnkcBTxRDIDgwUwfpi733YMl9.', 'admin');

INSERT INTO students (name, class_id) VALUES 
('Rohan Sharma', 1),
('Sneha Patil', 1),
('Amit Desai', 2),
('Priya Kulkarni', 2);

ALTER TABLE teachers DROP COLUMN password;
ALTER TABLE teachers ADD COLUMN password VARCHAR(255);


TRUNCATE TABLE classes;
DROP DATABASE attendance_system;
SHOW CREATE TABLE subjects;
ALTER TABLE subjects DROP FOREIGN KEY subjects_ibfk_1; -- only if foreign key exists
ALTER TABLE subjects DROP COLUMN class_id;
ALTER TABLE subjects ADD COLUMN subject_code VARCHAR(20) UNIQUE;

SELECT * FROM students WHERE class_id = 1;