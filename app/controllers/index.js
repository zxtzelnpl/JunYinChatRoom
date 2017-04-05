const Message = require('../models/message');
const PageSize = 30;

exports.index = function (req, res) {
    let messagesStr;
    Message
        .find({check:true})
        .sort({_id: -1})
        .select('from content meta')
        .skip(0)
        .limit(PageSize)
        .populate('from', 'name')
        .exec(function (err, messages) {
            if (err) {
                console.log(err)
            }
            messagesStr = JSON.stringify(messages);
            res.render('index', {
                messagesStr
            });
        });
};
