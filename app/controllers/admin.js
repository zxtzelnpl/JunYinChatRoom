const UserModel = require('../models/user.js');
exports.admin = function (req, res) {
    res.render('admin', {});
};

exports.signUp = function (req, res) {
    res.render('signup', {});
};

exports.logout = function (req, res) {

};

exports.room = function (req, res) {
    res.render('room', {});
};

exports.user = function (req, res) {
    UserModel.fetch(function(err,users){
        if(err){
            console.log(err);
        }
        res.render('user', {
            title:'管理用户列表'
            ,users:users
        });
    });
};

exports.userUpdate = function (req, res) {
    let id = req.params.id;
    UserModel.findById(id, function (err, userDetail) {
        res.render('userUpdate', {
            userDetail
        });
    });
};

exports.message = function (req, res) {
    res.render('message', {});
};

exports.picture = function (req, res) {
    res.render('picture', {});
};

exports.adminRequired=function(req,res,next){
    // let user = req.session.user;
    //
    // if(!user.role || user.role <=100){
    //     return res.redirect('/signin')
    // }
    next()
};

exports.information=function(req,res){
    let information=req.params.information;
    res.render('information',{
        information
    })
};
