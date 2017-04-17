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
    app.get('/admin/roomdetail/:room', Admin.adminRequired, Room.roomDetail);
    app.get('/admin/roomupdate/:room', Admin.adminRequired, Room.roomUpdate);

    /*Admin-User*/
    app.get('/admin/user/search', Admin.adminRequired, User.userSearch);
    app.get('/admin/user/list/:page', Admin.adminRequired, User.userList);
    app.get('/admin/user/detail/:id', Admin.adminRequired, User.userDetail);
    app.get('/admin/user/update/:id', Admin.adminRequired, User.userUpdate);
    app.get('/admin/user/signup', Admin.adminRequired, User.userSignUp);
    app.delete('/admin/user/delete', Admin.adminRequired, User.delete);
    app.post('/admin/user/update', Admin.adminRequired, User.update);
    app.post('/admin/user/query/:page', Admin.adminRequired, User.query);
    app.post('/user/signup', Admin.adminRequired, User.signUp);

    /*Admin-Message*/
    app.get('/admin/message/list/:page', Admin.adminRequired, Message.messageList);
    app.get('/admin/message/search', Admin.adminRequired,Message.messageSearch);
    app.post('/admin/message/query/:page', Admin.adminRequired, Message.query);

    /*Admin-Picture*/
    app.get('/admin/picture/room/:room', Admin.adminRequired, Picture.pictureList);
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
