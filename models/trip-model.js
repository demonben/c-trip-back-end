const mongoose = require('mongoose')
const Schema = mongoose.Schema

const tripSchema = new Schema(
    {
        name: { type: String, required: true },
        status: { type: String, required: true }, // upcoming or passed
        reason: { type: String, required: true }, // business or vacation
        startDate: { type: Date, required: true },
        endDate: { type: Date, required: true },
        note: { type: String, required: true },
        image: { type: String, required: false },
        createdBy: { type: String, required: true },
    },
    { timestamps: true },
)


const Trip = mongoose.model('Trip', tripSchema);
module.exports = Trip;