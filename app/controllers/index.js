const MessageModel = require('../models/message');
const PageSize = 30;

exports.index = function (req, res) {
    let messagesStr;
    let title='君银直播室';
    let rank=0;
    if(req.session.user){
        rank = parseInt(req.session.user.level);
    }
    if(rank>999){
        MessageModel
            .find({/*check: false*/},['_id','from','content','createAt','check'])
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
                    messages:messagesStr,
                    title
                });
            });
    }else{
        MessageModel
            .find({check: true},['_id','from','content','createAt'])
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
    }

};



