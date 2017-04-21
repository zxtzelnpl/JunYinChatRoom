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
                .find({room: room}, ['-_id', 'urlB', 'position', 'urlBack', 'rank', 'alt'])
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

exports.test = function(req,res){
    RoomModel
        .findOne({name:'shanghai'})
        .exec(function(err,room){
            MessageModel.update({},{'$set':{room:room._id}},{multi:true},function(err,messages){
                console.log(messages)
            });
        })
};
