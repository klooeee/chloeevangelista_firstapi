const express = require('express');
const cors = require('cors');
const db = require('./db'); 
require('dotenv').config(); 

const app = express();
app.use(cors());
app.use(express.json()); 

const PORT = 3000;

// a. Get all student records
app.get('/students', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM tbl_student');
    res.json(rows);
  } catch (e) {
    res.status(500).json(e);
  }
});

// b. Get a single student record
app.get('/students/:id', async (req, res) => {
  const id = req.params.id;
  try {
    const [rows] = await db.query('SELECT * FROM tbl_student WHERE id=?', [id]);
    if (rows.length === 0) {
      return res.status(404).json({message: "Student not found"});
    }
    res.json(rows[0]);
  } catch (e) {
    res.status(500).json(e);
  }
});

// c. Add a new student
app.post('/students', async (req, res) => {
  const { firstname, lastname, gender, age, course_id, department_id, status } = req.body;
  try {
    const [result] = await db.query(
      `INSERT INTO tbl_student 
        (firstname, lastname, gender, age, course_id, department_id, status)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [firstname, lastname, gender, age, course_id, department_id, status]
    );
    res.json({message: "Student added", id: result.insertId});
  } catch (e) {
    res.status(500).json(e);
  }
});

// d. Update student information
app.put('/students/:id', async (req, res) => {
  const id = req.params.id;
  const { firstname, lastname, gender, age, course_id, department_id, status } = req.body;

  try {
    const [result] = await db.query(
      `UPDATE tbl_student
       SET firstname=?, lastname=?, gender=?, age=?, course_id=?, department_id=?, status=?
       WHERE id=?`,
      [firstname, lastname, gender, age, course_id, department_id, status, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({message: "Student not found"});
    }

    res.json({message: "Student updated"});
  } catch (e) {
    res.status(500).json(e);
  }
});

// e. Update student status only
app.patch('/students/:id/status', async (req, res) => {
  const id = req.params.id;
  const { status } = req.body;

  try {
    const [result] = await db.query(
      'UPDATE tbl_student SET status=? WHERE id=?',
      [status, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({message: "Student not found"});
    }

    res.json({message: "Status updated"});
  } catch (e) {
    res.status(500).json(e);
  }
});

// f. Delete a student record
app.delete('/students/:id', async (req, res) => {
  const id = req.params.id;

  try {
    const [result] = await db.query('DELETE FROM tbl_student WHERE id=?', [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({message: "Student not found"});
    }
    res.json({message: "Student deleted"});
  } catch (e) {
    res.status(500).json(e);
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
