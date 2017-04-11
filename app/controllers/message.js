const MessageModel = require('../models/message.js');
const PageSize = 30;


/**get聊天信息start*/
exports.getMessage = function (req, res) {
    let page = req.query.page;
    MessageModel
        .find({},['from','content','createAt'])
        .sort({_id: -1})
        .skip(page * PageSize)
        .limit(PageSize)
        .populate('from', 'name')
        .exec(function (err, messages) {
            if (err) {
                console.log(err)
            }
            res.json(messages);
        })
};
/**get聊天信息end*/

/**get聊天信息start*/
exports.messageList = function (req, res) {
    let page = req.query.page;
    MessageModel
        .find({})
        .sort({_id: -1})
        // .skip(page * PageSize)
        // .limit(PageSize)
        .populate('from', 'name')
        .populate('verifier', 'name')
        .exec(function (err, messages) {
            if (err) {
                console.log(err)
            }
            console.log(messages);
            res.render('messagelist',{
                title:'聊天列表'
                ,messages
            });
        })
};
/**get聊天信息end*/


/**save聊天信息start*/
exports.save = function (msg, user, next) {
    let _message = {
        from:{}
    };
    _message.from = user._id;
    _message.content = msg;

    let message = new MessageModel(_message);
    message.save(function (err, message) {
        if (err) {
            console.log(err);
        }
        next({
            from:{
                name:user.name
            }
            ,content:msg
            ,createAt:message.createAt
        })
    })
}
/**save聊天信息end*/


/**check聊天信息start*/
exports.checkMessage = function (req, res) {
    let page = req.query.page;
    MessageModel
        .sort({_id: -1})
        .skip(page * PageSize)
        .limit(PageSize)
        .populate('from', 'name')
        .populate('verifier', 'name')
        .exec(function (err, messages) {
            if (err) {
                console.log(err)
            }
            res.json(messages);
        })
};
/**check聊天信息end*/


/**update聊天信息start*/
exports.upateMessage = function (req, res) {
    let message_id, user_id;
    message_id = req.query._id;
    user_id = req.session.user._id;
    MessageModel.findById(message_id, function (err, message) {
        if (err) {
            console.log(err)
        }
        message.verifier = user_id;
        message.check = true;
        message.save(function (err) {
            if (err) {
                console.log(err)
            }
            res.json({
                state: 'success'
            })
        })
    })
};
/**update聊天信息end*/

/**delete聊天信息start*/
exports.deleteMessage = function (req, res) {
    let message_id;
    message_id = req.query._id;
    MessageModel.findByIdAndRemove(message_id, function (err) {
        if (err) {
            console.log(err);
        }
        res.json({
            state: 'success'
        })
    })
};
/**delete聊天信息end*/
