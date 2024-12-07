const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bcrypt = require('bcrypt');
const dotenv = require('dotenv');

// Load environment variables from .env file
dotenv.config();

const app = express();
const port = 3000;

// MySQL database connection setup
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',  // Update with your database username
  password: '',  // Update with your database password
  database: 'safespacedb',  // Your database name
});

app.use(cors());
app.use(express.json());

// Registration route to handle new users
app.post('/register', (req, res) => {
  const { email, password } = req.body;

  // Validate email format
  if (!/^[0-9]{7}@ub\.edu\.ph$/.test(email)) {
    return res.json({ success: false, message: 'Invalid email format. Please use a valid UB email address.' });
  }

  // Hash the password before storing in the database
  bcrypt.hash(password, 10, (err, hashedPassword) => {
    if (err) {
      console.log('Error hashing password:', err);
      return res.json({ success: false, message: 'An error occurred during registration. Please try again.' });
    }

    // Insert user data into the database (email, hashed password)
    connection.query('INSERT INTO users (email, password) VALUES (?, ?)', [email, hashedPassword], (error, results) => {
      if (error) {
        console.log('Database Error:', error);
        return res.json({ success: false, message: 'Registration failed due to database error.' });
      }

      console.log("User registered successfully:", results);
      res.json({ success: true, message: 'Registration successful.' });
    });
  });
});

// POST a new item (post)
app.post('/items', (req, res) => {
  const { user_id, description } = req.body;

  if (!user_id || !description) {
    return res.status(400).json({ success: false, message: 'User ID and description are required.' });
  }

  const query = 'INSERT INTO posts (user_id, description, created_at) VALUES (?, ?, NOW())';
  connection.query(query, [user_id, description], (err, results) => {
    if (err) {
      console.log('Error inserting post:', err);
      return res.status(500).json({ success: false, message: 'Error posting data.' });
    }

    const newPost = { id: results.insertId, user_id, description, created_at: new Date() };
    res.json(newPost);  // Return the newly created post data
  });
});

// GET all posts
app.get('/items', (req, res) => {
  connection.query('SELECT * FROM posts ORDER BY created_at DESC', (err, results) => {
    if (err) {
      console.log('Error fetching posts:', err);
      return res.status(500).json({ success: false, message: 'Error fetching posts.' });
    }
    res.json(results);
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://192.168.0.181:${port}`);
});
