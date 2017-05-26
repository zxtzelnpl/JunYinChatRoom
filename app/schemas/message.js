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
    , createAt: {
        type: Date
        , default: Date.now
    }
    , updateAt: {
        type: Date
        , default: Date.now
    }
    ,check: {
        type: Boolean
        , default: false
    }
    ,room:{
        type:ObjectId
        ,ref:'Room'
    }
    , verifier: {
        type: ObjectId
        , ref: 'User'
    }
});

MessageSchema.pre('save', function (next) {
    const message = this;
    const reg1=/(^\s*)|(\s*$)/g;
    const reg3=/</g;
    const reg4=/>/g;
    if (message.isNew) {
        message.createAt = message.updateAt = Date.now;
        message.content=message.content.replace(reg1, "").replace(reg3,"&lt;").replace(reg4,"&gt;")
    } else {
        message.updateAt = Date.now;
    }
    next();
});

module.exports = MessageSchema;
