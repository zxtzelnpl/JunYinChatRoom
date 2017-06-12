const RoomModel = require('../models/room');
const Report = require('../report/report');

exports.roomList = function (req, res) {
    new Promise(function (resolve, reject) {
        let user = req.session.user;
        let level = parseInt(user.level);
        let findOpt = {};
        if (level < 10000) {
            findOpt._id = user.room;
        }
        RoomModel
            .find(findOpt)
            .populate('uploader', 'name')
            .exec(function (err, rooms) {
                if (err) {
                    reject(err)
                }
                resolve(rooms)
            })
    })
        .then(function (rooms) {
            res.render('roomList', {
                title: '房间列表',
                items: rooms
            })
        })
        .catch(function (err) {
            Report.errPage(res, err)
        });

};

exports.roomDetail = function (req, res) {
    new Promise(function (resolve, reject) {
        let _id = req.params.id;
        RoomModel
            .findOne({_id: _id})
            .populate('uploader', 'name')
            .exec(function (err, room) {
                if (err) {
                    reject(err)
                }
                resolve(room)
            })
    })
        .then(function (room) {
            res.render('roomDetail', {
                title: '房间详情',
                item: room
            })
        })
        .catch(function (err) {
            Report.errPage(res, err)
        });
};

exports.roomNew = function (req, res) {
    res.render('roomNew', {
        title: '房间新增'
    })
};

exports.roomUpdate = function (req, res) {
    new Promise(function (resolve, reject) {
        let _id = req.params.id;
        RoomModel
            .findOne({_id: _id})
            .exec(function (err, room) {
                if (err) {
                    reject(err)
                }
                resolve(room)
            })
    })
        .then(function (room) {
            res.render('roomUpdate', {
                title: '房间修改',
                item: room
            })
        })
        .catch(function (err) {
            Report.errPage(res, err)
        })

};

exports.add = function (req, res) {
    new Promise(function (resolve, reject) {
        let room = req.body.room;
        let _room = new RoomModel(room);
        _room.uploader = req.session.user._id;
        _room.save(function (err, room) {
            if (err) {
                reject(err)
            }
            resolve(room)
        });

    })
        .then(function (room) {
            res.redirect('/admin/roomdetail/' + room._id)
        })
        .catch(function (err) {
            Report.errPage(res, err)
        });

};

exports.delete = function (req, res) {
    new Promise(function (resolve, reject) {
        let _id = req.query._id;
        RoomModel.findByIdAndRemove(_id, function (err) {
            if (err) {
                reject(err)
            }
            resolve(true)
        })
    })
        .then(function () {
            res.json({
                state: 'success'
            })
        })
        .catch(function (err) {
            Report.errJSON(res, err)
        })
};

exports.update = function (req, res) {
    new Promise(function (resolve, reject) {
        let room = req.body.room;
        room.uploader = req.session.user._id;
        let _id = room._id;
        delete room._id;
        RoomModel.findByIdAndUpdate(_id, {$set: room}, function (err, room) {
            if (err) {
                reject(err)
            }
            resolve(room)
        })
    })
        .then(function (room) {
            res.redirect('/admin/roomdetail/' + room._id)
        })
        .catch(function (err) {
            Report.errPage(res, err)
        })
};

