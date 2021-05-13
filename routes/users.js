const express = require('express');
const { user } = require('../data/users');
const jwt = require('jsonwebtoken');
const { auth } = require('../middlewares/auth');

const router = express.Router();

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

// router.get('/:userId', auth, async (req, res) => {
//   const { userId } = req.params;
//   const results = await getUser(userId);
//   res.status(200).send({ user: results });
// });

module.exports = router;
