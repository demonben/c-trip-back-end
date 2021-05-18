const express = require('express');
const jwt = require('jsonwebtoken');
const { auth } = require('../middlewares/auth');
const User = require('../models/user-model');
const bcrypt = require('bcrypt');

const router = express.Router();

// need to add auth middleware
router.get('/:userId', async (req, res) => {
  const { userId } = req.params;
  const result = await User.findById(userId);
  res.status(200).send({ user: result });
});

router.put('/update', async (req, res) => {
  const body = req.body;

  if (!body || Object.keys(body).length === 0) {
    return res.status(400).json({
      success: false,
      error: 'No user information provided',
    });
  }

  // Model.findOneAndUpdate(conditions, update, options, (error, doc) => {
  // error: any errors that occurred
  // doc: the document before updates are applied if `new: false`, or after updates if `new = true`
  // });

  User.findOneAndUpdate(
    { _id: req.body.id },
    { $set: req.body },
    { useFindAndModify: false },
    (err, user) => {
      if (err) {
        return res.status(404).json({
          err,
          message: 'User not found!',
        });
      }

      if ('firstName' in req.body) user.firstName = body.firstName;
      if ('lastName' in req.body) user.lastName = body.lastName;
      if ('email' in req.body) user.email = body.email;
      if ('password' in req.body) user.password = body.password;
      if ('phoneNumber' in req.body) user.phoneNumber = body.phoneNumber;
      // if ('bio' in req.body) user.bio = body.bio

      user
        .save()
        .then(() => {
          return res.status(200).send({
            success: true, //check with front what they want to be returned.
            id: user._id,
            message: 'User updated!',
          });
        })
        .catch((error) => {
          return res.status(404).send({
            error,
            message: 'User not updated!',
          });
        });
    }
  );
});

// need to add auth middleware
router.get('/', async (req, res) => {
  await User.find({}, (err, users) => {
    if (err) {
      return res.send({
        success: false,
        error: err,
      });
    }
    if (!users.length) {
      return res.status(404).json({
        success: false,
        error: 'No user found',
      });
    }
    return res.status(200).json({
      success: true,
      users: users,
    });
  }).catch((err) => console.log(err));
});

module.exports = router;

/****************************************************************************/
// function isSameUser(req, res, next) {
//   if (req.user.id !== req.params.userId) {
//     res
//       .status(403)
//       .send({ message: 'Only the logged in user can perform this action' });
//     return;
//   }
//   next();
// }

// function isAdmin(req, res, next) {
//   const userId = req.user.id;
//   const admin = checkIfAdmin(userId);
//   if (!admin) {
//     res.status(403).send({
//       message: 'Only administrators can perform this action',
//     });
//     return;
//   }
//   next();
// }
