const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const BookingSchema = new Schema({
    user_id: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    room_id: {
        type: Schema.Types.ObjectId,
        ref: 'Room',
        required: true
    },
    start_time: {
        type: Date,
        required: false
    },
    end_time: {
        type: Date,
        required: false
    },
    purpose: {
        type: String,
        required: true
    },
    created_at: {
        type: Date,
        default: Date.now
    },
    deleted_at: {
        type: Date,
        default: null
    },

});

module.exports = Booking = mongoose.model("Booking", BookingSchema);