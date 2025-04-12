/**********************************************************************************************************************************
File Name: auth.js

File created by: Bhagyesh Chaudhari

Date: 11-04-2025

Description: This file contains the middleware for authenticating JWT tokens. It checks if the token is present in the request headers and verifies it using the secret key.

last modified: 12-04-2025

last modified by: Bhagyesh Chaudhari

Description of changes: Added JWT authentication middleware to protect routes and ensure that only authenticated users can access certain endpoints.

***********************************************************************************************************************************/


const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Token missing' });

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.status(401).json({ message: 'Invalid token' });
    req.user = decoded;
    next();
  });
};