const MessageModel = require('../models/message.js');
const PageSize = 30;


/**get聊天信息start*/
exports.getMessage = function (req, res) {
    let page = req.query.page;
    if(req.session.user&&parseInt(req.session.user.level>999)){
        MessageModel
            .find({},['from','content','createAt','check'])
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
    }else{
        MessageModel
            .find({'check':true},['from','content','createAt'])
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
    }
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
exports.checkMessage = function (msg, user,next) {
    let message_id =msg;
    let verifier=user._id;
    MessageModel.findByIdAndUpdate(message_id,{'#set':{'check':true,'verifier':verifier}},function(err,message){
        next(message)
    })
};
/**check聊天信息end*/

/**delete聊天信息start*/
exports.deleteMessage = function (req, res) {
    let message_id= req.query.id;
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


/**test聊天信息start*/
exports.test = function (msg) {
    console.log(msg);
    console.log(this)
};
/**test聊天信息end*/
