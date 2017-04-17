const RoomModel = require('../models/room');

exports.roomList = function (req, res) {
    RoomModel
        .find({})
        .populate('uploader','name')
        .exec(function(err,rooms){
            if(err){console.log(err)}
            res.render('roomList',{
                title:'房间管理',
                items:rooms
            })
        })
};

exports.roomDetail = function (req, res) {
    let _id=req.params.room;
    RoomModel
        .findOne({_id:_id})
        .populate('uploader','name')
        .exec(function(err,room){
            if(err){console.log(err)}
            res.render('roomList',{
                title:'房间管理',
                item:room
            })
        })
};

exports.roomNew = function (req, res) {
    RoomModel
        .find({})
        .populate('uploader','name')
        .exec(function(err,rooms){
            if(err){console.log(err)}
            res.render('roomList',{
                title:'房间管理',
                room:rooms
            })
        })
};

exports.roomUpdate = function (req, res) {
    RoomModel
        .find({})
        .populate('uploader','name')
        .exec(function(err,rooms){
            if(err){console.log(err)}
            res.render('roomList',{
                title:'房间管理',
                room:rooms
            })
        })
};

