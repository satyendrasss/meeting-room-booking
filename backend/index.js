var express = require('express');
var app = express();
const cors = require("cors");
const port = 4000;

app.use(cors());
require('./config/config');

var UserApiRouter = require('./routes/api/User');
var RoomApiRouter = require('./routes/api/Room');
var BookingApiRouter = require('./routes/api/Booking');
var DashboardApiRouter = require('./routes/api/Dashboard');


app.get('/', (req, res) => {
    res.send('Employee Management System');
})


// API ROUTES
/** ============================================================================================ */
app.use(express.json());
app.use('/api/user',UserApiRouter);
app.use('/api/room',RoomApiRouter);
app.use('/api/booking',BookingApiRouter);
app.use('/api/dashboard',DashboardApiRouter);

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

// app.listen(process.env.PORT, () => {
//     console.log("Mongoose Server listening on ", process.env.PORT);
// })