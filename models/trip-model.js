const mongoose = require('mongoose')
const Schema = mongoose.Schema

const tripSchema = new Schema(
    {
        name: { type: String, required: false },
        description: { type: String, required: false },
        image: { type: String, required: false }, 
        price: { type: String, required: false },
        startDate: { type: String, required: false },
        endDate: { type: String, required: false },
        note: { type: String, required: false },
        createdBy: { type: String, required: true },
    },
    { timestamps: true },
)

const Trip = mongoose.model('Trip', tripSchema);
module.exports = Trip;