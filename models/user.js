const mongoose = require('mongoose');
const UserSchema = require('./user.js');
const UserModel = mongoose.model('User',UserSchema);

module.exports = UserModel;
