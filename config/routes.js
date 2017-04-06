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
    app.post('/user/signin',User.signIn);
    app.get('/user/signout',User.signOut);


    app.post('/user/signup',Admin.adminRequired,User.signUp);
    app.delete('/admin/user/delete',User.delete);
    app.post('/admin/user/update',Admin.adminRequired,User.update);
    app.post('/admin/user/query',Admin.adminRequired,User.query);
    /*Message*/


    /*Admin*/
    app.get('/admin',Admin.adminRequired,Admin.admin);

    app.get('/admin/room',Admin.adminRequired,Admin.room);

    app.get('/admin/user',Admin.adminRequired,Admin.user);
    app.get('/admin/user/:id',Admin.adminRequired,User.userDetail);
    app.get('/admin/user/update/:id',Admin.adminRequired,Admin.userUpdate);
    app.get('/admin/signup',Admin.adminRequired,Admin.signUp);

    app.get('/admin/message',Admin.adminRequired,Admin.message);

    app.get('/admin/picture',Admin.adminRequired,Admin.picture);

    app.get('/admin/information/:information',Admin.adminRequired,Admin.information);
};
