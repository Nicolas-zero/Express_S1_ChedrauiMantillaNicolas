const express = require('express');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const router = express.Router();

// Usuario hardcodeado
const user = { 
  id: "1a-2b-3c-4d-5e-6f", 
  email: "mukarram@gmail.com", 
  password: "123456789", 
  role: 'admin' 
};

// Login
router.post('/login', (req, res) => {
  const { email, password } = req.body;

  if (email !== user.email || password !== user.password) {
    return res.status(401).json({ message: "Credenciales inválidas" });
  }

  const payload = { email: user.email, role: user.role };
  const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES });

  res.json({ token });
});

module.exports = router;
