const MessageModel = require('./message');
const PictureModel = require('./picture');
const RoomModel = require('./room');
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
                        resolve(messages);
                    });
            });

        });

    let promisePictures = promiseRoom
        .then(function (room) {
            return new Promise(function (resolve, reject) {
                let optFind = {room:room._id};
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
        .then(function ([room,messages,picture]) {
            res.render('index', {
                title: room.title,
                messages: messages,
                pictures: picture,
                roomId:room._id
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
    // RoomModel
    //     .findOne({name: 'shanghai'})
    //     .exec(function (err, room) {
    //         MessageModel.update({},{room:room._id},{multi:true})
    //             .exec(function(err,results){
    //                 console.log(results);
    //             })
    //     })
};
