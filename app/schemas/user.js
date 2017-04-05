const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const bcrypt = require('bcryptjs');
const SALT_WORK_FACTOR = 10;
let UserSchema = new mongoose.Schema({
    name: {
        unique:true
        ,type:String
    }
    , password: String
    , phone: Number
    , email: String
    , sex: String
    , level: {
        type:Number
        ,default:0
    }
    , meta: {
        createAt: {
            type: Date
            , default: Date.now
        }
        , updateAt: {
            type: Date
            , default: Date.now
        }
    }
    , forbidden: {
        type:Boolean
        ,default:false
    }
    , belong: String
});

UserSchema.pre('save', function (next) {
    const user = this;
    if (user.isNew) {
        user.meta.createAt = this.meta.updateAt = Date.now()
    } else {
        user.meta.updateAt = Date.now();
    }
    bcrypt.genSalt(SALT_WORK_FACTOR, function (err, salt) {
        if (err) {
            return next(err)
        }
        bcrypt.hash(user.password, salt, function (err, hash) {
            if (err) {
                return next(err)
            }
            user.password = hash;
            next()
        })
    })
});

UserSchema.method = {
    comparePassword: function (_password, cb) {
        bcrypt.compare(_password, this.password, function (err, isMatch) {
            if (err) {
                return cb(err)
            }
            cb(null,isMatch)
        })
    }
};

UserSchema.statics={
    fetch:function(cb){
        return this
            .find({})
            .sort('meta.updateAt')
            .exec(cb);
    }
};

module.exports=UserSchema;
