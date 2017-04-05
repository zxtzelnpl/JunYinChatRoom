const MessageModel = require('../models/message.js');
const PageSize = 30;


/**get聊天信息start*/
exports.getMessage = function (req, res) {
    let page = req.query.page;
    MessageModel
        .find({check: true})
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
/**get聊天信息end*/


/**save聊天信息start*/
exports.saveMessage = function (req, res) {
    let _message, message;
    _message = req.query;
    _message.from = req.session.user._id;
    message = new MessageModel(_message);
    message.save(function (err, message) {
        if (err) {
            console.log(err)
        }
        res.json({
            state: 'success'
        })
    })
};
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
    message_id=req.query._id;
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
    message_id=req.query._id;
    MessageModel.findByIdAndRemove(message_id,function(err){
        if(err){
            console.log(err);
        }
        res.json({
            state:'success'
        })
    })
};
/**delete聊天信息end*/
