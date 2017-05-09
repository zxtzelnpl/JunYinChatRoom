const MessageModel = require('../models/message');
const PictureModel = require('../models/picture');
const RoomModel = require('../models/room');
const PageSize = 30;

exports.index = function (req, res) {
    let title = '君银直播室';
    let rank = 0;
    let room = 'shanghai';
    let optFind = {check: true};
    let optField = ['_id', 'from', 'content', 'createAt'];
    let optPopulate = {path: 'from', select: 'name -_id'};
    if (req.session.user) {
        rank = parseInt(req.session.user.level);
        if (rank > 999) {
            optFind = {};
            optField = ['_id', 'from', 'content', 'createAt', 'check'];
        }
    }
    MessageModel
        .find(optFind, optField)
        .limit(PageSize)
        .populate(optPopulate)
        .exec(function (err, messages) {
            let messagesStr = JSON.stringify(messages);
            PictureModel
                .find({}, ['-_id', 'urlB', 'position', 'urlBack', 'rank', 'alt'])
                .exec(function (err, pictures) {
                    if (err) {
                        console.log(err)
                    }
                    res.render('index', {
                        messages: messagesStr,
                        title,
                        pictures: pictures,
                    });
                });
        });
};

exports.room = function (req, res) {
    let rank = 0;
    let roomName = req.params.room;
    let optFind = {check: true};
    let optField = ['_id', 'from', 'content', 'room','createAt'];
    let optPopulate = {path: 'from', select: 'name -_id'};
    if (req.session.user) {
        rank = parseInt(req.session.user.level);
        if (rank > 999) {
            optFind = {};
            optField = ['_id', 'from', 'content', 'room', 'createAt', 'check'];
        }
    }

    let promiseRoom=new Promise(function(resolve,reject){
        RoomModel
            .findOne({name:roomName})
            .exec(function(err,room){
                if(err){reject(err)}
                if(room){
                    resolve(room)
                }else{
                    reject('We can not find the room')
                }
            })
    });
    let promiseMessages=promiseRoom
        .then(function(room){
            optFind.room=room._id;
            return new Promise(function(resolve,reject){
                MessageModel
                    .find(optFind, optField)
                    .limit(PageSize)
                    .populate(optPopulate)
                    .exec(function (err, messages) {
                        if(err){reject(err)}
                        resolve(JSON.stringify(messages)) ;
                    });
            });

        });
    let promisePictures=promiseRoom
        .then(function(room){
            return new Promise(function(resolve,reject){
                PictureModel
                    .find({}, ['-_id', 'urlB', 'position', 'urlBack', 'rank', 'alt'])
                    .exec(function (err, pictures) {
                        if(err){reject(err)}
                        resolve(pictures);
                    });
            });

        });

    Promise
        .all([promiseRoom,promiseMessages,promisePictures])
        .then(function(arr){
            res.render('index', {
                title:arr[0].title,
                messages: arr[1],
                pictures: arr[2],
            });
        })
        .catch(function(err){
           console.log(err)
        });

    // RoomModel
    //     .findOne({name:roomName})
    //     .exec(function(err,room){
    //         if(err){console.log(err)}
    //         if(room){
    //             optFind.room=room._id;
    //         }else{
    //             res.render('wrongWay',{
    //                 title:'没有找到您需要的页面',
    //                 information:'You are enter the wrong page'
    //             });
    //             return;
    //         }
    //         MessageModel
    //             .find(optFind, optField)
    //             .limit(PageSize)
    //             .populate(optPopulate)
    //             .exec(function (err, messages) {
    //                 let messagesStr = JSON.stringify(messages);
    //                 PictureModel
    //                     .find({}, ['-_id', 'urlB', 'position', 'urlBack', 'rank', 'alt'])
    //                     .exec(function (err, pictures) {
    //                         if (err) {
    //                             console.log(err)
    //                         }
    //                         res.render('index', {
    //                             messages: messagesStr,
    //                             title,
    //                             pictures: pictures,
    //                         });
    //                     });
    //             });
    //     });
};

exports.test = function(req,res){
    console.log(Promise);
};
