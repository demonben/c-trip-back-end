const express = require('express');
const bcrypt = require('bcrypt');
const { getUserByEmail } = require('../data/users');
const jwt = require('jsonwebtoken');

const router = express.Router();

// 2
router.post('/', async (req, res, next) => {
  const { email, password } = req.body;
  const user = await getUserByEmail(email);
  if (!user) {
    res.status(404).send({ message: 'User not found with this email' });
    return;
  }
  bcrypt.compare(password, user.password_hash, (err, result) => {
    if (err) next(err);
    else {
      if (result) {
        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET);
        res.send({
          token,
          user: {
            email: user.email,
            created_date: user.created_date,
            id: user.id,
            role: user.role,
            fullName: `${user.first_name} ${user.last_name}`,
          },
        });
      } else {
        res.status(401).send({ message: 'Incorrect password' });
      }
    }
  });
});

module.exports = router;
