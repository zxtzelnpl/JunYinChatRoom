const RoomModel = require('../models/room');

exports.roomList = function (req, res, next) {
    let admin = req.session.admin;
    let level = parseInt(admin.level);
    let findOpt = {};
    if (level < 10000) {
        findOpt._id = admin.room;
    }
    RoomModel
        .find(findOpt)
        .populate('uploader', 'name')
        .exec()
        .then(function (rooms) {
            res.render('roomList', {
                title: '房间列表',
                items: rooms
            })
        })
        .catch(function (err) {
            next(err)
        });
};

exports.roomDetail = function (req, res, next) {
    let _id = req.params.id;
    RoomModel
        .findById(_id)
        .populate('uploader', 'name')
        .exec()
        .then(function (room) {
            res.render('roomDetail', {
                title: '房间详情',
                item: room
            })
        })
        .catch(function (err) {
            next(err)
        });
};

exports.roomNew = function (req, res) {
    res.render('roomNew', {
        title: '房间新增'
    })
};

exports.roomUpdate = function (req, res, next) {
    let _id = req.params.id;
    RoomModel
        .findById(_id)
        .exec()
        .then(function (room) {
            res.render('roomUpdate', {
                title: '房间修改',
                item: room
            })
        })
        .catch(function (err) {
            next(err)
        })
};

exports.add = function (req, res, next) {
    let room = req.body.room;
    let _room = new RoomModel(room);
    _room.uploader = req.session.user._id;
    _room
        .save()
        .then(function (room) {
            res.redirect('/admin/roomdetail/' + room._id)
        })
        .catch(function (err) {
            next(err)
        })
};

exports.delete = function (req, res, next) {
    let _id = req.query._id;
    RoomModel.findByIdAndRemove(_id)
        .exec()
        .then(function () {
            res.json({
                state: 'success'
            })
        })
        .catch(function (err) {
            next(err)
        })
};

exports.update = function (req, res, next) {
    let room = req.body.room;
    room.uploader = req.session.user._id;
    let _id = room._id;
    RoomModel
        .findByIdAndUpdate(_id, {$set: room})
        .exec()
        .then(function (room) {
            res.redirect('/admin/roomdetail/' + room._id)
        })
        .catch(function (err) {
            next(err)
        });
};

