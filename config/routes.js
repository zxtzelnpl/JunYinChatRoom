const Index = require('../app/controllers/index');
const User = require('../app/controllers/user');
const Message = require('../app/controllers/message');
const Admin = require('../app/controllers/admin');

module.exports = function(app,io){
    let users=[];
    let userNum=0;

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
    app.post('/admin/user/query/:page',Admin.adminRequired,User.query);
    /*Message*/


    /*Admin*/
    app.get('/admin',Admin.adminRequired,Admin.admin);

    app.get('/admin/room',Admin.adminRequired,Admin.room);

    app.get('/admin/user/list/:page',Admin.adminRequired,User.userList);
    app.get('/admin/user/search',Admin.adminRequired,User.search);
    app.get('/admin/user/detail/:id',Admin.adminRequired,User.userDetail);
    app.get('/admin/user/update/:id',Admin.adminRequired,Admin.userUpdate);
    app.get('/admin/user/signup',Admin.adminRequired,Admin.signUp);

    app.get('/admin/message/list',Admin.adminRequired,Admin.messageList);

    app.get('/admin/picture/list',Admin.adminRequired,Admin.pictureList);

    app.get('/admin/information/:information',Admin.adminRequired,Admin.information);


    io.on('connection',function(socket){
        let user;
        let delNum;
        userNum++;
        io.emit('online',userNum);
        console.log('##socket-connection##',userNum);
        if(socket.request.session.user){
            user=socket.request.session.user;
            users.push(user);
            console.log('##socket-signin##');
            console.log(users);
            console.log('##socket-signin##');
        }
        socket.on('disconnect',function(){
            console.log('##socket-disconnect1##');
            console.log(users);
            console.log('##socket-disconnect1##');
            if(user){
                users.forEach(function(_user,index){
                    if(_user._id==user._id){
                        delNum=index;
                    }
                });
                users.splice(delNum,1);
            }
            userNum--;
            io.emit('online',userNum);
            console.log('##socket-disconnect2##');
            console.log(users);
            console.log('##socket-disconnect2##');
        });
    })
};
