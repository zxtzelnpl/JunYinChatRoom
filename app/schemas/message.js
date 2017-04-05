const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

let MessageSchema = new Schema({
    from: {
        type: ObjectId
        , ref: 'User'
    }
    , content: String
    , meta: {
        createAt: {
            type: Date
            , default: Date.now
        }
        , createTime: {
            type: Number
            , default: Date.now
        }
    }
    , pass: {
        check: {
            type: Boolean
            , default: false
        }
        , verifier: {
            type: ObjectId
            , ref: 'User'
        }
    }
});

MessageSchema.statics={
    fetch:function(cb){
        return this
            .find({})
            .sort('meta.createTime')
            .exec(cb);
    },
    findById:function(id,cb){
        return this
            .findOne({_id:id})
            .exec(cb);
    }
};

module.exports = MessageSchema;
