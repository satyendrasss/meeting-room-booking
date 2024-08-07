const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const Joi = require('joi'); // for validation
const User = require('../../models/UserModel');
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

const checkToken = require('./checkToken');
const { now } = require('mongoose');

/// ADD USER
/*============================================================================================== */
router.post('/', async (req, res) => {
    let response = {};
    response['status'] = false;
    response['message'] = 'failed';
    try {
        let data = new User(req.body);
        let result = await data.save();
        response['status'] = true;
        response['message'] = 'success';
        response['result'] = result;

    } catch (error) {
        response['error'] = error;
    }
    res.send(response);
});



/// USER LIST
/*============================================================================================== */

router.get('/', checkToken, async (req, res) => {
    console.log(req.user);
    let response = {};
    response['status'] = true;
    response['message'] = 'success';
    try {
        let qry = { deleted_at: null, role:'User' };
        const data = await User.find(qry);
        response['result'] = data;
    } catch (error) {
        console.log('Users~~', error);
    }
    res.send(response);
});




/// USER LOGIN
/*============================================================================================== */
const userValidateSchema = Joi.object({
    // name: Joi.string().required(),
    email: Joi.string().email().required(),
    // age: Joi.number().integer().min(18).required(),
    // password: Joi.string().min(6).required(),
    user_password: Joi.string().min(6).required(),
});

router.post('/login', async (req, res) => {

    // Validate request body
    const { error } = userValidateSchema.validate(req.body);
    if (error) {
        return res.status(400).json({ error: error.details[0].message });
    }

    let response = {};
    response['status'] = false;
    response['message'] = 'failed';
    try {
        let result = [];
        response['status'] = false;
        response['message'] = '';
        response['result'] = [];
        const user = await User.findOne({ email: req.body.email }).select(["_id", "name", "email", "role", "user_password"]);
        if (!user) {
            response['message'] = 'Invalid username or password';
        }
        const isMatch = await user.comparePassword(req.body.user_password);
        if (!isMatch) {
            response['message'] = 'Invalid username or password';
        }
        if (user && isMatch) {
            const payload = { _id: user._id, name: user.name, email: user.email, role: user.role };
            //const jwtToken = jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' });
            const jwtToken = jwt.sign(payload, JWT_SECRET, { expiresIn: '1m' }); // '1h' for 1 hour, '30m' for 30 minutes, '7d' for 7 days
            response['status'] = true;
            response['message'] = 'Login successfull';
            response['result'] = user;
            response['token'] = jwtToken;
        }

    } catch (error) {
        console.log('Login~~', error);
    }
    res.send(response);
});



/// USER DETAILS
/*============================================================================================== */

router.get('/info/:id', checkToken, async (req, res) => {
    let id = req.params.id;
    let response = {};
    response['status'] = false;
    response['message'] = 'failed';
    try{
        const data = await User.findOne({ _id: id, deleted_at: null });
        response['status'] = true;
        response['message'] = 'success';
        response['result'] = data;
    } catch (error) {
        console.log('User Info~~', error);
    }
    res.send(response);
});



/// USER DETAILS
/*============================================================================================== */
router.get('/check-login', async (req, res) => {
    let response = {};
    const token = req.headers['authorization'] && req.headers['authorization'].split(' ')[1];
    try{
        const decoded = jwt.verify(token, JWT_SECRET);
        response['status'] = true;
        response['message'] = 'Login successfull';
        response['result'] = decoded;
        response['token'] = token;
    }catch(err){
        response['status'] = 401;
        response['message'] = 'Unauthorized';
    }    
    res.send(response);
});



/// USER UPDATE
/*============================================================================================== */
router.put('/:_id', async (req, res) => {
    let response = {};
    response['status'] = false;
    response['message'] = 'failed';
    try {
        let result = await User.updateOne(
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


/// USER DELETE
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