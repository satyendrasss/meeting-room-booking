const express = require('express');
const router = express.Router();
const checkToken = require('./checkToken');
const Booking = require('../../models/BookingModel');
const User = require('../../models/UserModel');
const Room = require('../../models/RoomModel');
const { now, mongoose } = require('mongoose');
const { startOfDay, endOfDay } = require('date-fns');


router.get('/', checkToken, async (req, res) => {
    console.log(req.user);
    let response = {};
    response['status'] = true;
    response['message'] = 'success';
    let qry = {
        deleted_at: null
    };
    let totalUser = 0; let totalRoom = 0; let totalBooking = 0; let todayTotalBooking = 0; let allBookings = [];
    try {
        qry['role'] = 'User';
        let countUser = await User.aggregate([{ $match: qry }, { $count: 'totalUser' }]);
        totalUser = countUser[0].totalUser;
        delete qry.role;
    } catch (error) {
        console.log('Dashboard User Count~~', error);
    }

    try {
        let countRoom = await Room.aggregate([{ $match: qry }, { $count: 'totalRoom' }]);
        totalRoom = countRoom[0].totalRoom;
    } catch (error) {
        console.log('Dashboard User Count~~', error);
    }

    try {
        const today = new Date();
        const start = startOfDay(today);
        const end = endOfDay(today);
        qry['start_time'] = { $gte: start, $lte: end };
        let todayCountBooking = await Booking.aggregate([{ $match: qry }, { $count: 'todayTotalBooking' }]);
        if(todayCountBooking[0]){
            todayTotalBooking = todayCountBooking[0].todayTotalBooking;
        }
        delete qry.start_time;
    } catch (error) {
        console.log('Dashboard Booking Count~~', error);
    }

    try {
        let countBooking = await Booking.aggregate([{ $match: qry }, { $count: 'totalBooking' }]);
        if(countBooking[0]){ totalBooking = countBooking[0].totalBooking; }
    } catch (error) {
        console.log('Dashboard Booking Count~~', error);
    }

    try {
        allBookings = await Booking.find(qry).populate('room_id', ['room_name', 'location']).populate('user_id', ['name', 'email', 'mobile_no']);
    } catch (error) {
        console.log('Dashboard Booking all~~', error);
    }

    // BOOKINGS GROUP BY ROOMS
    let roomWiseBookings = await Booking.aggregate([
        { $match: qry },
        { "$group": { _id: "$room_id", total_bookings: { $sum: 1 } } },
        {
            $lookup: {
                from: "rooms",
                localField: "_id",
                foreignField: "_id",
                as: "room_details"
            }
        },
        {
            $addFields: {
                room_details: { $arrayElemAt: ["$room_details", 0] }  // Extract the first element from the array
            }
        }
        // {
        //     $project: {
        //         _id: 1,
        //         total_bookings: 1,
        //         room_name: "$room_details.room_name",  // Example: Include room name from room collection
        //         room_capacity: "$room_details.capacity"  // Example: Include room capacity from room collection
        //         // Add more fields from room collection as needed
        //     }
        // }
    ]);

    // BOOKINGS GROUP BY USERS
    let userWiseBookings = await Booking.aggregate([
        { $match: qry },
        { "$group": { _id: "$user_id", total_bookings: { $sum: 1 } } },
        {
            $lookup: {
                from: "users",
                localField: "_id",
                foreignField: "_id",
                as: "user_details"
            }
        },
        {
            $addFields: {
                user_details: { $arrayElemAt: ["$user_details", 0] }  // Extract the first element from the array
            }
        }
    ]);


    response['totalUser'] = totalUser;
    response['totalRoom'] = totalRoom;
    response['totalBooking'] = totalBooking;
    response['roomWiseBookings'] = roomWiseBookings;
    response['userWiseBookings'] = userWiseBookings;
    response['allBookings'] = allBookings;
    response['todayTotalBooking'] = todayTotalBooking;
    res.send(response);
});


module.exports = router;