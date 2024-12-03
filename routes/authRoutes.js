const express = require('express');
const { registerUser, loginUser } = require('../controllers/authController'); // Ensure this import is correct

const router = express.Router();

// Register and Login routes
router.post('/register', registerUser);  // Ensure that registerUser is correctly imported
router.post('/login', loginUser);        // Ensure that loginUser is correctly imported

module.exports = router;
