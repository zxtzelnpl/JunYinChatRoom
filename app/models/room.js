const mongoose = require('mongoose');
const RoomSchema = require('../schemas/room.js');
const RoomModel = mongoose.model('Room',RoomSchema);

module.exports = RoomModel;
