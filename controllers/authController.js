const bcrypt = require('bcrypt')
const User = require('../models/User');

const jwt = require('jsonwebtoken');

// Register user
const registerUser = async (req, res) => {
  const { username, password, email, name } = req.body;

  if (!username || !password || !email || !name) {
    return res.status(400).json({ message: 'All fields (username, password, email, name) are required' });
  }

  try {
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: 'Username already exists' });
    }

    // Hash the password before saving it
   

    // Save the user with hashed password
    const newUser = new User({ username, password, email, name });
    await newUser.save();

    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    console.error('Error registering user:', err);
    res.status(500).json({ message: 'Error registering user. Please try again.' });
  }
};


require('dotenv').config()
const SECRET_KEY=process.env.SECRET_KEY

// Login user
const loginUser = async (req, res) => {
  const { username, password } = req.body;

  console.log('Login attempt:', { username, password });  // Log the incoming request

  try {
    const user = await User.findOne({ username });

    // If the user is not found, return an error
    if (!user) {
        return res.status(400).json({ message: 'Invalid credentials' });
      }
  
      // Log the stored password hash
      console.log('Stored password hash:', user.password);
  
      // Compare entered password with stored hashed password
      const isMatch = await bcrypt.compare(password,user.password);
  
      // Log the result of the comparison
      console.log('Password comparison result:', isMatch);  // Should be true if password matches
  
      if (!isMatch) {
        return res.status(400).json({ message: 'Invalid credentials' });
      }
  
      // If passwords match, generate JWT token
      const token = jwt.sign({ username: user.username },SECRET_KEY, { expiresIn: '1h' });
  
      res.status(200).json({ token });
    } catch (err) {
      console.error('Error logging in:', err);
      res.status(500).json({ message: 'Error logging in. Please try again.' });
    }
};
module.exports={registerUser,loginUser}