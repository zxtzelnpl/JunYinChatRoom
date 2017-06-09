const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

let PictureSchema = new Schema({
    room: {
        type:ObjectId
        ,ref:'Room'
    },
    position: {
        type: String
    },
    alt: String,
    content: String,
    url: String,
    urlBack: String,
    rank: Number,
    uploader: {
        type: ObjectId,
        ref: 'User'
    },
    createAt: {
        type: Date
        , default: Date.now
    },
    updateAt: {
        type: Date
        , default: Date.now
    }
});

PictureSchema.pre('save',function(next){
   const picture = this;
   if(picture.isNew){
       picture.createAt = picture.updateAt = Date.now;
   }else{
       picture.updateAt = Date.now;
   }
   next();
});

module.exports = PictureSchema;
