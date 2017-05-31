const UserModel = require('../models/user.js');
const RoomModel = require('../models/room');

exports.login = function (req, res) {
    res.render('admin', {
        title:'登录页面'
    });
};

exports.adminRequired=function(req,res,next){
    let level = req.session.user ? parseInt(req.session.user.level) : 0;
    if(level>=1000){
        next();
    }else{
        res.render('wrongWay',{
            title:'你是不是忘记了什么',
            err:'这些页面暂时不对外开放哦'
        })
    }
};

exports.signIn = function (req, res) {
    let _user = req.body;
    let name = _user.name;
    let password = _user.password;
    let roomId=_user.room;

    UserModel.findOne({name: name}, function (err, user) {
        if (err) {
            console.log(err)
        }

        if (!user) {
            return res.json({
                state: 'fail'
                , reason: 'no name'
            })
        }

        user.comparePassword(password, function (err, isMatch) {
            if (err) {
                console.log(err)
            }
            if (isMatch) {
                req.session.user = user;
                return res.json({
                    state: 'success'
                    , name: user.name
                });
            }
            else {
                return res.json({
                    state: 'fail'
                    , reason: 'password wrong'
                })
            }
        })
    })
};

exports.information=function(req,res){
    let information=req.params.information;
    res.render('information',{
        information
    })
};
