const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const app = express();
const port = 3001;

// Middleware to parse JSON bodies
app.use(express.json());
app.use(cors());

// Create a MySQL connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'bindu252004',
  database: 'dhoni'
});

// Connect to the database
db.connect((err) => {
  if (err) {
    console.error('Error connecting to the database:', err);
    return;
  }
  console.log('Connected to the database');
});

// Welcome message
app.get('/', (req, res) => {
  res.send('Welcome to ConnectCure API');
});

// Registration endpoint
app.post('/register', async (req, res) => {
  const { firstName, lastName, email, password } = req.body;

  if (!firstName || !lastName || !email || !password) {
    return res.status(400).json({ message: 'All fields are required.' });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const query = 'INSERT INTO users (firstName, lastName, email, password) VALUES (?, ?, ?, ?)';
    
    db.query(query, [firstName, lastName, email, hashedPassword], (err, result) => {
      if (err) {
        console.error('Error inserting user:', err);
        return res.status(500).json({ message: 'Server error, please try again later.' });
      }
      res.status(201).json({ message: 'Registration successful!' });
    });
  } catch (error) {
    console.error('Error during registration:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Login endpoint
app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required.' });
  }

  try {
    const query = 'SELECT * FROM users WHERE email = ?';
    db.query(query, [email], async (err, results) => {
      if (err) {
        console.error('Error retrieving user:', err);
        return res.status(500).json({ message: 'Server error, please try again later.' });
      }

      if (results.length === 0) {
        console.log('Invalid credentials: User not found.');
        return res.status(401).json({ message: 'Invalid credentials.' });
      }

      const user = results[0];
      const passwordMatch = await bcrypt.compare(password, user.password);

      if (!passwordMatch) {
        console.log('Invalid credentials: Password does not match.');
        return res.status(401).json({ message: 'Invalid credentials.' });
      }

      const token = jwt.sign({ id: user.id, email: user.email }, 'your_jwt_secret', {
        expiresIn: '1h'
      });

      console.log('Login successful:', { token });
      res.status(200).json({ message: 'Login successful.', token });
    });
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Start server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});


// const express = require('express');
// const mysql = require('mysql2');
// const cors = require('cors'); // Import CORS

// const app = express();
// const port = 3001;

// // Middleware to parse JSON bodies
// app.use(express.json());
// app.use(cors()); // Enable CORS

// // Create a MySQL connection
// const db = mysql.createConnection({
//   host: 'localhost',
//   user: 'root', // Your SQL Workbench username
//   password: 'bindu252004', // Your SQL Workbench password
//   database: 'dhoni' // Your database name
// });

// // Connect to the database
// db.connect((err) => {
//   if (err) {
//     console.error('Error connecting to the database:', err);
//     return;
//   }
//   console.log('Connected to the database');
// });

// app.get('/', (req, res) => {
//   res.send('Welcome to ConnectCure API');
// });
// // Registration endpoint
// app.post('/register', (req, res) => {
//   const { firstName, lastName, email, password } = req.body;

//   // Check if all required fields are provided
//   if (!firstName || !lastName || !email || !password) {
//     return res.status(400).json({ message: 'All fields are required.' });
//   }

//   // Insert user into the database
//   const query = 'INSERT INTO users (firstName, lastName, email, password) VALUES (?, ?, ?, ?)';
//   db.query(query, [firstName, lastName, email, password], (err, result) => {
//     if (err) {
//       console.error('Error inserting user:', err);
//       return res.status(500).json({ message: 'Server error, please try again later.', error: err.message });
//     }
//     res.status(201).json({ message: 'Registration successful!' });
//   });
// });
// // Login endpoint
// app.post('/login', async (req, res) => {
//   const { email, password } = req.body;

//   // Check if email and password are provided
//   if (!email || !password) {
//     return res.status(400).json({ message: 'Email and password are required.' });
//   }

//   // Fetch user from database based on email
//   const query = 'SELECT * FROM users WHERE email = ?';
//   db.query(query, [email], async (err, results) => {
//     if (err) {
//       console.error('Error retrieving user:', err);
//       return res.status(500).json({ message: 'Server error, please try again later.' });
//     }

//     if (results.length === 0) {
//       return res.status(401).json({ message: 'Invalid credentials.' });
//     }

//     const user = results[0];

//     // Compare password with hashed password stored in database
//     const passwordMatch = await bcrypt.compare(password, user.password);

//     if (!passwordMatch) {
//       return res.status(401).json({ message: 'Invalid credentials.' });
//     }

//     // Generate JWT token
//     const token = jwt.sign({ id: user.id, email: user.email }, 'your_jwt_secret', {
//       expiresIn: '1h' // Token expires in 1 hour
//     });

//     res.status(200).json({ message: 'Login successful.', token });
//   });
// });
// app.listen(port, () => {
//   console.log(`Server is running on http://localhost:${port}`);
// });



// const express = require('express');
// const mysql = require('mysql2'); // Using mysql2 for promise support
// const app = express();
// const port = 3001;

// // Middleware to parse JSON bodies
// app.use(express.json());

// // Create a MySQL connection
// const db = mysql.createConnection({
//   host: 'localhost',
//   user: 'root', // replace with your SQL Workbench username
//   password: 'bindu252004', // replace with your SQL Workbench password
//   database: 'dhoni' // replace with your database name
// });

// // Connect to the database
// db.connect((err) => {
//   if (err) {
//     console.error('Error connecting to the database:', err);
//     return;
//   }
//   console.log('Connected to the database');
// });

// // Example route
// app.get('/', (req, res) => {
//   res.send('Hello from the backend!');
// });
// // Registration endpoint
// app.post('/register', (req, res) => {
//   const { firstName, lastName, email, password } = req.body;

//   // Check if all required fields are provided
//   if (!firstName || !lastName || !email || !password) {
//     return res.status(400).json({ message: 'All fields are required.' });
//   }

//   // Insert user into the database
//   const query = 'INSERT INTO users (firstName, lastName, email, password) VALUES (?, ?, ?, ?)';
//   db.query(query, [firstName, lastName, email, password], (err, result) => {
//     if (err) {
//       console.error('Error inserting user:', err);
//       return res.status(500).json({ message: 'Server error, please try again later.' });
//     }
//     res.status(201).json({ message: 'Registration successful!' });
//   });
// });

// app.listen(port, () => {
//   console.log(`Server is running on http://localhost:${port}`);
// });
