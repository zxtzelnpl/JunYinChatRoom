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
    let userNum = 0;

    /*pre handle user*/
    app.use(function (req, res, next) {
        app.locals.user = req.session.user;
        next();
    });

    /*Index*/
    app.get('/', Index.index);

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

    /*Admin-Message*/
    app.get('/admin/messagelist/:page', Admin.adminRequired, Message.messageList);
    app.get('/admin/messagesearch', Admin.adminRequired,Message.messageSearch);
    app.post('/admin/messagequery/:page', Admin.adminRequired, Message.query);

    /*Admin-Picture*/
    app.get('/admin/picture/room/:id', Admin.adminRequired, Picture.pictureList);
    app.get('/admin/picture/upload', Admin.adminRequired, Picture.pictureUpload);
    app.post('/picture/update', Admin.adminRequired, multiparty(),Picture.savePic,Picture.update);

    /*Information*/
    app.get('/admin/information/:information', Admin.adminRequired, Admin.information);

    /*socket.io*/
    io.on('connection', function (socket) {
        let user;
        let delNum;
        userNum++;
        io.emit('online', userNum);
        if (socket.request.session.user) {
            user = socket.request.session.user;

            UserModule.findByIdAndUpdate(user._id, {$set: {online: true}}, function () {
                ids.push(user._id);
                io.emit('usersAdd', user._id);
            });
        }

        socket.on('message', function (msg) {
            Message.save(msg,user, function (message) {
                io.emit('message', message);
                socket.emit('selfBack',message);
            });
        });

        socket.on('checkMessage',function(msg){
            Message.checkMessage(msg,user,function(message,checker){
                io.emit('checkedMessage',message,checker);
            })
        });

        socket.on('delMessage',function(msg){
            Message.delMessage(msg,user,function(message){
                io.emit('delMessage',message)
            })
        });

        socket.on('disconnect', function () {
            if (user) {
                ids.forEach(function (id, index) {
                    if (id === user._id) {
                        delNum = index;
                    }
                });
                ids.splice(delNum, 1);
                if (ids.indexOf(user._id) === -1) {
                    UserModule.findByIdAndUpdate(user._id, {$set: {online: false}}, function () {
                        io.emit('usersMinus', user._id)
                    });
                }
            }
            userNum--;
            io.emit('online', userNum);
        });

        // socket.on('test',Message.test)
    })
};
