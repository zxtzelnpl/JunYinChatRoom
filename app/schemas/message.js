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
    , verifier: {
        type: ObjectId
        , ref: 'User'
    }
});

MessageSchema.pre('save', function (next) {
    const message = this;
    if (message.isNew) {
        message.createAt = message.updateAt = Date.now
    } else {
        message.updateAt = Date.now;
    }
    next();
});

MessageSchema.statics = {
    fetch: function (cb) {
        return this
            .find({})
            .sort('meta.createAt')
            .exec(cb);
    },
    findById: function (id, cb) {
        return this
            .findOne({_id: id})
            .exec(cb);
    }
};

module.exports = MessageSchema;
