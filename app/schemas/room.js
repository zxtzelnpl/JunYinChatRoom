const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

let RoomSchema = new Schema({
    name: {
        type: String
    },
    title:{
        type:String,
        default:'直播室'
    },
    QQ:{
        type:Array
    },
    phone:{
        type:String
    },
    video:{
        site:String,
        ctx:String,
        ownerId:String
    },
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

RoomSchema.pre('save',function(next){
   const room = this;
   if(room.isNew){
       room.createAt = room.updateAt = Date.now;
   }else{
       room.updateAt = Date.now;
   }
   next();
});

module.exports = RoomSchema;
