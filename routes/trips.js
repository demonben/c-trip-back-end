const express = require('express');
const jwt = require('jsonwebtoken');
const { auth } = require('../middlewares/auth');
const Trip = require('../models/trip-model');
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

router.post('/', auth, (req, res) => {
  const body = req.body;

  if (!body) {
    return res.status(400).send({
      success: false,
      error: 'No trip information provided',
    });
  }

  const trip = new Trip({
    name: req.body.name,
    status: req.body.status, // upcoming or passed
    reason: req.body.reason, // business or vacation
    startDate: req.body.startDate,
    endDate: req.body.endDate,
    note: req.body.note,
    createdBy: req.body.createdBy,
  });

  if (!trip) {
    return res.status(400).send({
      success: false,
      error: err,
    });
  }

  trip
    .save()
    .then(() => {
      return res.status(201).send({
        success: true,
        id: trip._id,
        message: 'Trip created!',
      });
    })
    .catch((error) => {
      return res.status(400).send({
        error,
        message: 'Trip not created!',
      });
    });
});

router.get('/', async (req, res) => {
  await Trip.find({}, (err, trips) => {
    if (err) {
      return res.status(400).send({
        success: false,
        error: err,
      });
    }
    if (!trips.length) {
      return res.status(404).send({ message: 'No trip found' });
    }
    return res.status(200).send({
      success: true,
      trips: trips,
    });
  }).catch((err) => console.log(err));
});

router.get('/trip/:tripId', auth, async (req, res) => {
  await Trip.findOne({ _id: req.params.tripId }, (err, trip) => {
    if (err) {
      return res.status(400).send({
        success: false,
        error: err,
      });
    }

    if (!trip) {
      return res.status(404).send({
        success: false,
        error: 'Trip not found',
      });
    }
    return res.status(200).send({
      success: true,
      trip: trip,
    });
  }).catch((err) => console.log(err));
});

router.post('/userTrips', auth, async (req, res) => {
  await Trip.find({ createdBy: { $eq: req.body.createdBy } }, (err, trip) => {
    console.log('REQ BODY USER Trips: ', req.body);
    if (err) {
      return res.status(400).send({
        success: false,
        error: err,
      });
    }

    if (!trip) {
      return res.status(404).send({
        success: false,
        error: 'No trip found',
      });
    }
    return res.status(200).send({
      success: true,
      data: trip,
    });
  }).catch((err) => console.log(err));
});

module.exports = router;
