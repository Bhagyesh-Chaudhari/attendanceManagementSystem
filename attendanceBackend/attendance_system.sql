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
  role ENUM('admin', 'teacher') DEFAULT 'teacher',
  is_temp_password BOOLEAN DEFAULT TRUE
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
  roll_no VARCHAR(20) UNIQUE,
  name VARCHAR(100),
  class_id INT,
  FOREIGN KEY (class_id) REFERENCES classes(id)
);

CREATE TABLE subjects (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100),
  subject_code VARCHAR(10)
);

CREATE TABLE teacher_subject (
  id INT AUTO_INCREMENT PRIMARY KEY,
  teacher_id INT,
  branch_year_subject_id INT,
  class_id INT,
  UNIQUE (teacher_id, branch_year_subject_id, class_id),
  FOREIGN KEY (teacher_id) REFERENCES teachers(id),
  FOREIGN KEY (branch_year_subject_id) REFERENCES branch_year_subjects(id),
  FOREIGN KEY (class_id) REFERENCES classes(id)
);

-- DROP TABLE IF EXISTS attendance;
-- DROP TABLE IF EXISTS teacher_subject;
-- ALTER TABLE teacher_subject
-- DROP FOREIGN KEY teacher_subject_ibfk_2;
-- ALTER TABLE teacher_subject
-- CHANGE subject_id branch_year_subject_id INT;
-- ALTER TABLE teacher_subject
-- ADD CONSTRAINT fk_teacher_subject_branch_year_subject
-- FOREIGN KEY (branch_year_subject_id) REFERENCES branch_year_subjects(id);

CREATE TABLE attendance (
  id INT AUTO_INCREMENT PRIMARY KEY,
  teacher_id INT,
  class_id INT,
  subject_id INT,
  student_name VARCHAR(100),
  status ENUM('present', 'absent'),
  date DATE,
  time_slot VARCHAR(50) NOT NULL,
  FOREIGN KEY (teacher_id) REFERENCES teachers(id),
  FOREIGN KEY (class_id) REFERENCES classes(id),
  FOREIGN KEY (subject_id) REFERENCES subjects(id),
  UNIQUE (teacher_id, class_id, subject_id, date, time_slot, student_name)
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


TRUNCATE TABLE attendance;
DROP DATABASE attendance_system;
SHOW CREATE TABLE subjects;
ALTER TABLE subjects DROP FOREIGN KEY subjects_ibfk_1; -- only if foreign key exists
ALTER TABLE subjects DROP COLUMN class_id;
ALTER TABLE subjects ADD COLUMN subject_code VARCHAR(20) UNIQUE;

SELECT * FROM students WHERE class_id = 1;
SELECT * FROM classes WHERE name LIKE "CMPN S.E. A";


SELECT b.id AS branch_year_subjects_id, s.id AS subject_id, s.name AS subject_name 
     FROM branch_year_subjects b
     JOIN subjects s ON b.subject_id = s.id
     WHERE b.branch_id = 3 AND b.year_id = 2;
     
     
INSERT INTO students (roll_no, name, class_id) VALUES
('23108A0032', 'BHOI HEMANT SANJAY SUREKHABEN', 4),
('23108A0043', 'UBARHANDE  ANURAG  NAJUKRAO  SEEMA', 4),
('23108A0044', 'CHOUDHARI MOHD ANAS  SARVAR JAHAN', 4),
('23108A0047', 'TATE ARYAN  JITENDRA SUVARNA', 4),
('23108A0048', 'BIND SUBHANSU SUBHASHCHAND PRAMILA', 4),
('23108B0008', 'THAKRE YASH RAJENDRA SHALINI', 5),
('23108B0013', 'PENKAR SHUBHAM SAMEER SANJANA', 5),
('23108B0015', 'ATTARDE TUSHAR SANDIP PUNAM', 5),
('23108B0031', 'SWANI KABIR MOHIT RITU', 5),
('23108B0049', 'ANDHALE SEJAL SAMPAT SARALA', 5),
('23108B0055', 'PANDEY  NIKUNJ  SHOBHNATH SUSHMA', 5),
('23108B0073', 'PATIL KSHITIJ MILIND VAISHALI', 5),
('23108B0083', 'PATIL SIDDHESH SANJAY SARITA', 5),
('24108A2014', 'RASHIDEE MOHAMMAD BILAL HARSHAD ISHRA', 4);