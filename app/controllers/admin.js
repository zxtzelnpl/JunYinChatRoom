exports.admin = function (req, res) {
    res.render('admin', {});
};

exports.room = function (req, res) {
    res.render('room', {});
};

exports.messageList = function (req, res) {
    res.render('message', {});
};

exports.pictureList = function (req, res) {
    res.render('picture', {});
};

exports.adminRequired=function(req,res,next){
    next()
};

exports.information=function(req,res){
    let information=req.params.information;
    res.render('information',{
        information
    })
};
