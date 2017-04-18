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
            res.render('roomDetail',{
                title:'房间管理',
                item:room
            })
        })
};

exports.roomNew = function (req, res) {
    res.render('roomNew',{
        title:'房间管理'
    })
};

exports.roomUpdate = function (req, res) {
    let _id=req.params.room;
    RoomModel
        .findOne({_id:_id})
        .populate('uploader','name')
        .exec(function(err,room){
            if(err){console.log(err)}
            res.render('roomUpdate',{
                title:'房间管理',
                item:room
            })
        })
};

exports.Add=function(req,res){
    let room=req.body.room;
    let _room=new RoomModel(room);
    _room.uploader=req.session.user._id;
    _room.save(function(err,room){
        if(err){console.log(err)}
        res.redirect('/admin/roomdetail/'+room._id)
    })
};

exports.Delete=function(req,res){
    let _id=req.query._id;
    RoomModel.findByIdAndRemove(_id,function(err){
        if(err){console.log(err)}
        res.json({
            state:'success'
        })
    })
};

exports.Update=function(req,res){
    let room=req.body.room;
    console.log(room);
    let _id=room._id;
    delete room._id;
    console.log(room);
    RoomModel.findByIdAndUpdate(_id,{'$set':{room:room}},function(err,room){
        if(err){console.log(err)}
        res.redirect('/admin/roomdetail/'+room._id)
    })
};

