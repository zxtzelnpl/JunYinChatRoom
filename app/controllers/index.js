const MessageModel = require('../models/message');
const PictureModel = require('../models/picture');
const PageSize = 30;

exports.index = function (req, res) {
    let messagesStr;
    let title = '君银直播室';
    let rank = 0;
    if (req.session.user) {
        rank = parseInt(req.session.user.level);
    }
    if (rank > 999) {
        MessageModel
            .find({/*check: false*/}, ['_id', 'from', 'content', 'createAt', 'check'])
            .populate({
                path:'from',
                select:'name -_id'
            })
            .sort({_id: -1})
            .skip(0)
            .limit(PageSize)
            .exec(function (err, messages) {
                console.log(messages);
                let messagesStr=JSON.stringify(messages);
                PictureModel
                    .find({room: 'shanghai'},['-_id','urlB','position','urlBack','rank','alt'])
                    .exec(function (err, pictures) {
                        if (err) {
                            console.log(err)
                        }
                        res.render('index', {
                            messages: messagesStr,
                            title,
                            pictures:pictures,
                        });
                    });

            });
    } else {
        MessageModel
            .find({check: true}, ['_id', 'from', 'content', 'createAt'])
            .sort({_id: -1})
            .skip(0)
            .limit(PageSize)
            .populate('from', 'name')
            .exec(function (err, messages) {
                let messagesStr=JSON.stringify(messages);
                PictureModel
                    .find({room: 'shanghai'},['-_id','urlB','position','urlBack','rank','alt'])
                    .exec(function (err, pictures) {
                        if (err) {
                            console.log(err)
                        }
                        res.render('index', {
                            messages: messagesStr,
                            title,
                            pictures:pictures,
                        });
                    });

            });
    }

};



