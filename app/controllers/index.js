const MessageModel = require('../models/message');
const PictureModel = require('../models/picture');
const RoomModel = require('../models/room');
const PageSize = 30;

exports.index = function (req, res) {
    res.redirect('/room/shanghai');
};

exports.room = function (req, res) {

    let promiseRoom = new Promise(function (resolve, reject) {
        let roomName = req.params.room;
        RoomModel
            .findOne({name: roomName})
            .exec(function (err, room) {
                console.log(room);
                if (err) {
                    reject(err)
                }
                if (room) {
                    resolve(room)
                } else {
                    reject('We can not find the room:'+roomName)
                }
            })
    });

    let promiseMessages = promiseRoom
        .then(function (room) {
            return new Promise(function (resolve, reject) {
                let level = req.session.user ? parseInt(req.session.user.level) : 0;
                let optFind = {check: true,room:room._id};
                let optField = ['_id', 'from', 'content', 'room', 'createAt'];
                let optPopulate = {path: 'from', select: 'name -_id'};
                if (level >= 1000) {
                    optFind = {room:room._id};
                    optField = ['_id', 'from', 'content', 'room', 'createAt', 'check'];
                }
                MessageModel
                    .find(optFind, optField)
                    .sort({_id:-1})
                    .limit(PageSize)
                    .populate(optPopulate)
                    .exec(function (err, messages) {
                        if (err) {
                            reject(err)
                        }
                        resolve(JSON.stringify(messages));
                    });
            });

        });

    let promisePictures = promiseRoom
        .then(function (room) {
            return new Promise(function (resolve, reject) {
                let optFind = {};
                let optField = ['-_id', 'urlB', 'position', 'urlBack', 'rank', 'alt'];
                PictureModel
                    .find(optFind, optField)
                    .exec(function (err, pictures) {
                        if (err) {
                            reject(err)
                        }
                        resolve(pictures);
                    });
            });

        });

    Promise
        .all([promiseRoom, promiseMessages, promisePictures])
        .then(function (arr) {
            res.render('index', {
                title: arr[0].title,
                messages: arr[1],
                pictures: arr[2],
            });
        })
        .catch(function (err) {
            res.render('wrongWay',{
                title:'发生错误',
                err:err
            })
        });
};

exports.test = function (req, res) {
    console.log(Promise);
};
