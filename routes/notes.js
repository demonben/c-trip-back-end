const express = require('express');
const { auth } = require('../middlewares/auth');
const validateBody = require('../middlewares/validation');
const router = express.Router();
const Trip = require('../models/trip-model');

updateNote = async (req, res) => {
    const body = req.body
    console.log(body)


    if (!body || Object.keys(body).length === 0) {
        return res.status(400).json({
            success: false,
            error: "No note information provided",
        })
    }

    Trip.findOneAndUpdate({ _id: req.body.id }, { $set: req.body }, { useFindAndModify: false }, (err, trip) => { 
        if (err) {
            return res.status(404).json({
                err,
                message: "Trip not found!",
            })
        }

        if ('note' in req.body) trip.note = body.note;
        
        trip
            .save()
            .then(() => {
                return res.status(200).json({
                    success: true,
                    id: trip._id,
                    message: "Note updated!",
                })
            })
            .catch(error => {
                return res.status(404).json({
                    error,
                    message: "Note not updated!",
                })
            })
    })
}




module.exports = router;
