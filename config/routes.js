const Index = require('../app/controllers/index');
const User = require('../app/controllers/user');
const Message = require('../app/controllers/message');
const Admin = require('../app/controllers/admin');

module.exports = function(app,io){
    let users=[];

    /*pre handle user*/
    app.use(function(req,res,next){
        app.locals.user=req.session.user;
        next();
    });

    /*Index*/
    app.get('/',Index.index);


    /*User*/
    app.post('/user/signup',Admin.adminRequired,User.signUp);
    app.get('/user/signin',Admin.adminRequired,User.signIn);

    /*Message*/


    /*Admin*/
    app.get('/admin/signin',Admin.signIn);
    app.get('/admin',Admin.adminRequired,Admin.admin);
    app.get('/admin/signup',Admin.adminRequired,Admin.signUp);
    app.get('/admin/room',Admin.adminRequired,Admin.room);
    app.get('/admin/user',Admin.adminRequired,Admin.user);
    app.get('/admin/message',Admin.adminRequired,Admin.message);
    app.get('/admin/picture',Admin.adminRequired,Admin.picture);
};
