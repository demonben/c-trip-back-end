const express = require('express');
const bcrypt = require('bcrypt');
const { addUser, getUserByEmail } = require('../data/users');

const router = express.Router();

// 1
router.post('/', async (req, res, next) => {
  const { email, password, firstName, lastName, phoneNumber } = req.body;
  bcrypt.hash(password, 10, async (err, hash) => {
    if (err) next(err);
    else {
      const user = await getUserByEmail(email);
      if (user) {
        res.status(403).send({
          message: 'There is already a user account with this email address',
        });
        return;
      }
      await addUser(email, hash, firstName, lastName, phoneNumber);
      res.status(201).send({ user: { email } });
    }
  });
});

module.exports = router;
