const express = require('express');
const { auth } = require('../middlewares/auth');
const router = express.Router();
const Trip = require('../models/trip-model');

router.put('/', async (req, res) => {
  const body = req.body;
  console.log(body);

  if (!body || Object.keys(body).length === 0) {
    return res.status(400).send({
      success: false,
      error: 'No note information provided',
    });
  }

  Trip.findOneAndUpdate(
    { _id: req.body.id },
    { $set: req.body },
    { useFindAndModify: false },
    (err, trip) => {
      if (err) {
        return res.status(404).send({
          err,
          message: 'Trip not found!',
        });
      }

      if ('note' in req.body) trip.note = body.note;

      trip
        .save()
        .then(() => {
          return res.status(200).send({
            success: true,
            id: trip._id,
            message: 'Note updated!',
          });
        })
        .catch((error) => {
          return res.status(404).send({
            error,
            message: 'Note not updated!',
          });
        });
    }
  );
});

module.exports = router;
