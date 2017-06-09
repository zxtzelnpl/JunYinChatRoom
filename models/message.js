const mongoose = require('mongoose');
const MessageSchema = require('./message.js');
const MessageModel = mongoose.model('Message',MessageSchema);

module.exports = MessageModel;
