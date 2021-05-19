const mongoose = require('mongoose')
const Schema = mongoose.Schema

const tripSchema = new Schema(
    {
        name: { type: String, required: true },
        description: { type: String, required: true },
        image: { type: String, required: true }, 
        price: { type: String, required: true },
        startDate: { type: String, required: true },
        endDate: { type: String, required: true },
        note: { type: String, required: false },
        createdBy: { type: String, required: true },
    },
    { timestamps: true },
)

const Trip = mongoose.model('Trip', tripSchema);
module.exports = Trip;