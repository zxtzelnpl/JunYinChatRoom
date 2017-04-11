const MessageModel = require('../models/message');
const PageSize = 30;

exports.index = function (req, res) {
    let messagesStr;
    let title='君银直播室';
    MessageModel
        .find({/*check: false*/},['from','content','createAt'])
        .sort({_id: -1})
        .skip(0)
        .limit(PageSize)
        .populate('from', 'name')
        .exec(function (err, messages) {
            if (err) {
                console.log(err)
            }
            messagesStr = JSON.stringify(messages);
            res.render('index', {
                messagesStr,
                title
            });
        });
};



