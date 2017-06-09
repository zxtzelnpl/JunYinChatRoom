const mongoose = require('mongoose');
const PictureSchema = require('./picture.js');
const PictureModel = mongoose.model('Picture',PictureSchema);

module.exports = PictureModel;
