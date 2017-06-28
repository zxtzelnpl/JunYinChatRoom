const UserModel = require('../models/user.js');
const Report = require('../report/report');

exports.login = function (req, res) {
    res.render('login', {
        title: '登录页面'
    });
};

exports.welcome = function (req,res){
    res.render('welcome',{
        title:'欢迎页面'
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

exports.signIn = function (req, res) {
    let _user = req.body;
    let userPromise = new Promise(function (resolve, reject) {
        let name = _user.name;
        UserModel
            .findOne({name: name})
            .exec(function (err, user) {
                if (err) {
                    reject(err)
                }
                if (!user) {
                    reject('无法找到向对应的用户名')
                }
                resolve(user)
            })
    });

    let checkPromise = userPromise.then(function (user) {
        return new Promise(function (resolve, reject) {
            let password = _user.password;
            user.comparePassword(password, function (err, isMatch) {
                if (err) {
                    reject(err)
                }
                if (!isMatch) {
                    reject('密码错误')
                }
                resolve(user)
            })
        })
    });

    checkPromise
        .then(function (user) {
            req.session.admin = user;
            res.json({
                state: 'success',
                name: user.name
            })
        })
        .catch(function (err) {
            Report.errJSON(res, err)
        });
};
