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
    let title = '君银直播室';
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
    RoomModel
        .findOne({name:roomName})
        .exec(function(err,room){
            if(err){console.log(err)}
            if(room){
                console.log(room);
                optFind.room=room._id;
            }else{
                res.render('wrongWay',{
                    title:'没有找到您需要的页面',
                    information:'You are enter the wrong page'
                });
                return;
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
        });
};

exports.test = function(req,res){
    RoomModel
        .findOne({name:'shanghai'})
        .exec(function(err,room){
            console.log(room);
            MessageModel.update({},{'$set':{room:room._id}},{multi:true},function(err,messages){
                console.log(messages)
            });
        })
};
