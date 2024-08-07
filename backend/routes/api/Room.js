const express = require('express');
const router = express.Router();
const checkToken = require('./checkToken');
const Room = require('../../models/RoomModel');
const { now } = require('mongoose');


/// ADD ROOM
/*============================================================================================== */
router.post('/', async (req, res) => {
    let response = {};
    response['status'] = false;
    response['message'] = 'failed';
    try {
        let data = new Room(req.body);
        let result = await data.save();
        response['status'] = true;
        response['message'] = 'success';
        response['result'] = result;

    } catch (error) {
        response['error'] = error;
    }
    res.send(response);
});



/// ROOM LIST
/*============================================================================================== */

router.get('/', checkToken, async (req, res) => {
    console.log(req.user);
    let response = {};
    response['status'] = true;
    response['message'] = 'success';
    try {
        let qry = { deleted_at: null };
        const data = await Room.find(qry);
        response['result'] = data;
    } catch (error) {
        console.log('Login~~', error);
    }
    res.send(response);
});


/// ROOM DETAILS
/*============================================================================================== */
router.get('/info/:id', checkToken, async (req, res) => {
    let id = req.params.id;
    let response = {};
    response['status'] = false;
    response['message'] = 'failed';
    try{
        const data = await Room.findOne({ _id: id, deleted_at: null });
        response['status'] = true;
        response['message'] = 'success';
        response['result'] = data;
    } catch (error) {
        console.log('Room Info~~', error);
    }
    
    res.send(response);
});



/// ROOM UPDATE
/*============================================================================================== */
router.put('/:_id', async (req, res) => {
    let response = {};
    response['status'] = false;
    response['message'] = 'failed';
    try {
        let result = await Room.updateOne(
            { _id: req.params._id },
            { $set: req.body }
        );
        response['status'] = true;
        response['message'] = 'success';
        response['result'] = result;

    } catch (error) {
        console.log(error);
    }
    res.send(response);
});


/// ROOM DELETE
/*============================================================================================== */
router.delete('/:id', checkToken, async (req, res) => {
    let response = {};
    response['status'] = false;
    response['message'] = 'failed';
    try {
        let id = req.params.id;
        var setdata = {};
        setdata['deleted_at'] = now();
        let result = await Room.updateOne(
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

module.exports = router;