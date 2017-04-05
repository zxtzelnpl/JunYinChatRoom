exports.admin = function (req, res) {
    res.render('admin', {});
};

exports.signIn = function (req, res) {
    res.render('signin', {});
};

exports.signUp = function (req, res) {
    res.render('signup', {});
};

exports.logout = function (req, res) {
    delete req.session.user;
    return res.redirect('/');
};

exports.room = function (req, res) {
    res.render('room', {});
};

exports.user = function (req, res) {
    res.render('user', {});
};

exports.message = function (req, res) {
    res.render('message', {});
};

exports.picture = function (req, res) {
    res.render('picture', {});
};

exports.adminRequired=function(req,res,next){
    // let user = req.session.user;
    //
    // if(!user.role || user.role <=100){
    //     return res.redirect('/signin')
    // }
    next()
};
