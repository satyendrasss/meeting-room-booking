const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const RoomSchema = new Schema({
    room_name: {
        type: String,
        required: true,
    },
    capacity:{
        type:Number,
        required:false
    },
    location:{
        type:String,
        required:true
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

module.exports = Room = mongoose.model("Room", RoomSchema);