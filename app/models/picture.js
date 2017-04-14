const mongoose = require('mongoose');
const PictureSchema = require('../schemas/picture.js');
const PictureModel = mongoose.model('Picture',PictureSchema);

module.exports = PictureModel;
