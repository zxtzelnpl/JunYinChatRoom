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


    /*Message*/


    /*Admin*/
    app.get('/admin',Admin.admin);
    app.get('/admin/signin/',Admin.signin);
};
