const express = require('express');
const router = express.Router();
const checkToken = require('./checkToken');
const Booking = require('../../models/BookingModel');
const { now, mongoose } = require('mongoose');

/// ADD BOOKING
/*============================================================================================== */
router.post('/', checkToken, async (req, res) => {
    let response = {};
    response['status'] = false;
    response['message'] = 'failed';
    let meetingSlotAvailable = [];
    try {

        const fromTime = req.body.start_time;
        const toTime = req.body.end_time;
        const room_id = req.body.room_id;
        try {
            meetingSlotAvailable = await Booking.find({
                deleted_at: null,
                room_id: room_id,
                $or: [
                    { start_time: { $gte: fromTime, $lte: toTime } },  // Starts within the range
                    { end_time: { $gte: fromTime, $lte: toTime } }     // Ends within the range
                ]
            });
            //console.log('slot~~',meetingSlotAvailable.length);
        } catch (err) {
            console.log(err);
        }

        if (meetingSlotAvailable.length > 0) {
            response['status'] = 11000;
            response['message'] = 'Room not available';
            response['result'] = meetingSlotAvailable;
        } else {
            let data = new Booking(req.body);
            let result = await data.save();
            response['status'] = true;
            response['message'] = 'success';
            response['result'] = result;
        }
    } catch (error) {
        response['error'] = error;
    }
    res.send(response);
});


/// BOOKING LIST
/*============================================================================================== */
router.get('/', checkToken, async (req, res) => {
    console.log(req.user);
    let response = {};
    response['status'] = true;
    response['message'] = 'success';
    try {
        let qry = { deleted_at: null };
        const data = await Booking.find(qry).populate('room_id', ['room_name']).populate('user_id', ['name']);
        response['result'] = data;
    } catch (error) {
        console.log('Booking~~', error);
    }
    res.send(response);
});


/// BOOKING DELETE
/*============================================================================================== */
router.delete('/:id', checkToken, async (req, res) => {
    let response = {};
    response['status'] = false;
    response['message'] = 'failed';
    try {
        let id = req.params.id;
        var setdata = {};
        setdata['deleted_at'] = now();
        let result = await Booking.updateOne(
            { _id: id },
            { $set: setdata }
        );
        response['status'] = true;
        response['message'] = 'success';
        response['result'] = result;
    } catch (error) {
        console.log(error);
    }
    res.send(response);
});

/// BOOKING DETAILS
/*============================================================================================== */
router.get('/info/:id', checkToken, async (req, res) => {
    let id = req.params.id;
    let response = {};
    response['status'] = false;
    response['message'] = 'failed';
    try {
        const data = await Booking.findOne({ _id: id, deleted_at: null });
        response['status'] = true;
        response['message'] = 'success';
        response['result'] = data;
    } catch (error) {
        console.log('bOOKING Info~~', error);
    }

    res.send(response);
});

/// BOOKING UPDATE
/*============================================================================================== */
router.put('/:_id', checkToken, async (req, res) => {
    let response = {};
    response['status'] = false;
    response['message'] = 'failed';
    let meetingSlotAvailable = [];
    try {
        const fromTime = req.body.start_time;
        const toTime = req.body.end_time;
        const room_id = req.body.room_id;
        try {
            meetingSlotAvailable = await Booking.find({
                deleted_at: null,
                room_id: room_id,
                _id: { $ne: req.params._id }, // Not equal to booking_id
                $or: [
                    { start_time: { $gte: fromTime, $lte: toTime } },  // Starts within the range
                    { end_time: { $gte: fromTime, $lte: toTime } }     // Ends within the range
                ]
            });
            //console.log('slot~~',meetingSlotAvailable.length);
        } catch (err) {
            console.log(err);
        }

        if (meetingSlotAvailable.length > 0) {
            response['status'] = 11000;
            response['message'] = 'Room not available';
            response['result'] = meetingSlotAvailable;
        } else {
            let result = await Booking.updateOne(
                { _id: req.params._id },
                { $set: req.body }
            );
            response['status'] = true;
            response['message'] = 'success';
            response['result'] = result;
        }
    } catch (error) {
        console.log(error);
    }
    res.send(response);
});


module.exports = router;