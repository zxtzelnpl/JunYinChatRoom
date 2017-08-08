const UserModel = require('../models/user.js');
const Report = require('../report/report');

exports.login = function (req, res) {
    res.render('login', {
        title: '登录页面'
    });
};

exports.welcome = function (req, res) {
    res.render('welcome', {
        title: '欢迎页面'
    })
};

exports.adminRequired = function (req, res, next) {
    next();
    // let level = req.session.user ? parseInt(req.session.user.level) : 0;
    // if (level >= 1000) {
    //     next();
    // } else {
    //     Report.errPage(res, '你没有相关权限');
    // }
};

exports.signIn = function (req, res, next) {
    let userObj = req.body;
    let user;
    UserModel
        .findOne({name: userObj.name})
        .exec()
        .then(function (_user) {
            if (!_user) {
                return Promise.reject({
                    state: 'fail',
                    err: '无法找到向对应的用户名'
                });
            }
            user = _user;
            return _user.comparePassword(userObj.password)
        })
        .then(function (flag) {

            if (flag === true) {
                req.session.admin = user;
                res.json({
                    state: 'success'
                })
            }
            else{
                return Promise.reject({
                    state: 'fail',
                    err: '密码错误'
                });
            }
        })
        .catch(function (err) {
            next(err)
        });
};

exports.test = function (req,res,next){
    throw new Error('my mak err')
};
