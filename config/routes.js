const Index = require('../app/controllers/index');
const User = require('../app/controllers/user');
const Message = require('../app/controllers/message');
const Admin = require('../app/controllers/admin');

const UserModule = require('../app/models/user.js');
const MessageModule = require('../app/models/message.js');

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
    app.get('/getmessage',Message.getMessage);


    /*Admin*/
    app.get('/admin', Admin.adminRequired, Admin.admin);
    app.get('/admin/room', Admin.adminRequired, Admin.room);

    /*Admin-User*/
    app.get('/admin/user/list/:page', Admin.adminRequired, User.userList);
    app.get('/admin/user/search', Admin.adminRequired, User.search);
    app.get('/admin/user/detail/:id', Admin.adminRequired, User.userDetail);
    app.get('/admin/user/update/:id', Admin.adminRequired, Admin.userUpdate);
    app.get('/admin/user/signup', Admin.adminRequired, Admin.signUp);
    app.delete('/admin/user/delete', User.delete);
    app.post('/admin/user/update', Admin.adminRequired, User.update);
    app.post('/admin/user/query/:page', Admin.adminRequired, User.query);
    app.post('/user/signup', Admin.adminRequired, User.signUp);

    /*Admin-Message*/
    app.get('/admin/message/list/:page', Admin.adminRequired, Message.messageList);
    app.get('/admin/message/search', Admin.adminRequired,Message.search);
    app.post('/admin/message/query/:page', Admin.adminRequired, Message.query);

    /*Admin-Picture*/
    app.get('/admin/picture/list', Admin.adminRequired, Admin.pictureList);

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
