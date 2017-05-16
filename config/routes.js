const multiparty=require('connect-multiparty');

const Index = require('../app/controllers/index');
const User = require('../app/controllers/user');
const Message = require('../app/controllers/message');
const Picture = require('../app/controllers/picture');
const Room=require('../app/controllers/room');
const Admin = require('../app/controllers/admin');

const UserModule = require('../app/models/user.js');

module.exports = function (app, io) {
    let ids = [];
    let socketIds=[];
    let tourists=0;
    let users=[];
    let admins=[];
    let userNum = 0;
    let rooms=[];

    /*pre handle user*/
    app.use(function (req, res, next) {
        app.locals.user = req.session.user;
        next();
    });

    /*Index*/
    app.get('/', Index.index);
    app.get('/room/:room', Index.room);
    app.get('/test', Index.test);

    /*User*/
    app.post('/user/signin', User.signIn);
    app.get('/user/signout', User.signOut);

    /*Message*/
    app.get('/message/getmessage',Message.getMessage);

    /*Admin*/
    app.get('/admin/login', Admin.admin);

    /*Admin-Room*/
    app.get('/admin/roomlist', Admin.adminRequired, Room.roomList);
    app.get('/admin/roomnew', Admin.adminRequired, Room.roomNew);
    app.get('/admin/roomdetail/:id', Admin.adminRequired, Room.roomDetail);
    app.get('/admin/roomupdate/:id', Admin.adminRequired, Room.roomUpdate);
    app.post('/admin/room/add', Admin.adminRequired, Room.add);
    app.post('/admin/room/update', Admin.adminRequired, Room.update);
    app.delete('/admin/room/delete', Admin.adminRequired, Room.delete);

    /*Admin-User*/
    app.get('/admin/userlist/:page', Admin.adminRequired, User.userList);
    app.get('/admin/usersignup', Admin.adminRequired, User.userSignUp);
    app.get('/admin/userdetail/:id', Admin.adminRequired, User.userDetail);
    app.get('/admin/userupdate/:id', Admin.adminRequired, User.userUpdate);
    app.get('/admin/usersearch', Admin.adminRequired, User.userSearch);
    app.post('/admin/userquery/:page', Admin.adminRequired, User.userQuery);
    app.post('/admin/user/signup', Admin.adminRequired, User.signUp);
    app.post('/admin/user/update', Admin.adminRequired, User.update);
    app.delete('/admin/user/delete', Admin.adminRequired, User.delete);
    app.get('/admin/user/forbidden', Admin.adminRequired, User.forbidden);

    /*Admin-Message*/
    app.get('/admin/messagelist/:page', Admin.adminRequired, Message.messageList);
    app.get('/admin/messagesearch', Admin.adminRequired,Message.messageSearch);
    app.post('/admin/messagequery/:page', Admin.adminRequired, Message.query);

    /*Admin-Picture*/
    app.get('/admin/pictureroom/:id', Admin.adminRequired, Picture.pictureList);
    app.get('/admin/pictureupload', Admin.adminRequired, Picture.pictureUpload);
    app.post('/admin/picture/update', Admin.adminRequired, multiparty(),Picture.savePic,Picture.update);

    /*Information*/
    app.get('/admin/information/:information', Admin.adminRequired, Admin.information);

    /*socket.io*/
    io.on('connection', function (socket) {
        let user;
        let room;

        if (socket.request.session.user) {
            user = socket.request.session.user;

            console.log(user);

            UserModule.findByIdAndUpdate(user._id, {$set: {online: true}}, function () {
                users.push(user._id);
                io.emit('usersAdd', user._id);
            });
        }else{
            tourists++;
        }
        io.emit('online', (tourists+users.length));

        if(user&&user.room){
            room=user.room;
            if(rooms[room]){
                rooms[room]++;
            }else{
                rooms[room]=1;
            }
            socket.join(room);
        }

        if(user&&parseInt(user.level)>=10000){
            socket.join('admin');
        }

        socket.on('message', function (msg) {
            Message.save(msg,user, function (message) {
                io.to(room).emit('message', message);
                io.to('admin').emit('message', message);
                socket.emit('selfBack',message);
            });
        });

        socket.on('checkMessage',function(msg){
            Message.checkMessage(msg,user,function(message,checker){
                io.to(room).emit('checkedMessage',message,checker);
                io.to('admin').emit('checkedMessage',message,checker);
            })
        });

        socket.on('delMessage',function(msg){
            Message.delMessage(msg,user,function(message){
                io.to(room).emit('delMessage',message);
                io.to('admin').emit('delMessage',message);
            })
        });

        socket.on('disconnect', function () {
            let delNum;
            if (user) {
                delNum=users.indexOf(user._id);
                users.splice(delNum, 1);
                UserModule.findByIdAndUpdate(user._id, {$set: {online: false}}, function () {
                    io.emit('usersMinus', user._id)
                });

                if(room){
                    socket.leave(room);
                    rooms[room]--;
                    if(rooms[room]===0){
                        rooms[room]=undefined;
                    }
                }
            }else{
                tourists--;
            }
            io.emit('online', (tourists+users.length));
        });

    })
};
