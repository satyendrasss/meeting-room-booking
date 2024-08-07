const dotenv = require('dotenv');
dotenv.config();

const mongoose = require('mongoose');
mongoose.connect('mongodb://127.0.0.1:27017/meetingrooms');
// mongoose.connect('mongodb+srv://webconsultant:hEWj9y9LxwBmhbbd@cluster0.yjejq3l.mongodb.net/ems');