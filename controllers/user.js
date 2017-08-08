const UserModel = require('../models/user.js');
const RoomModel = require('../models/room.js');
const MessageModel = require('../models/message.js');
const pageSize = 10;

exports.userList = function (req, res, next) {
    let pageNum = req.params.page;
    let totalPageNum;
    let room_id = req.params.room_id;
    let optFind = {};
    if (room_id !== 'all') {
        optFind.room = room_id;
    }
    let countPromise = UserModel
        .count(optFind)
        .exec();
    let usersPromise = UserModel
        .find(optFind)
        .skip((pageNum - 1) * pageSize)
        .limit(pageSize)
        .populate('room', 'title')
        .exec();
    Promise.all([countPromise, usersPromise])
        .then(function ([count, users]) {
            totalPageNum = Math.ceil(count / pageSize);
            res.render('userList', {
                title: '管理用户列表'
                , users: users
                , totalPageNum: totalPageNum
            });
        })
        .catch(function (err) {
            next(err)
        });
};

exports.userSignUp = function (req, res, next) {
    let room_id = req.params.room_id;
    let optFind = {};
    if (room_id !== 'all') {
        optFind._id = room_id
    }

    RoomModel
        .find(optFind)
        .select('name title')
        .exec()
        .then(function (rooms) {
            res.render('userSignUp', {
                title: '用户注册',
                rooms: rooms
            });
        })
        .catch(function (err) {
            next(err)
        })
};

exports.userDetail = function (req, res, next) {
    let _id = req.params.id;
    UserModel.findById(_id)
        .populate('room', 'title')
        .exec()
        .then(function (user) {
            res.render('userDetail', {
                user: user,
                title: user.name + '的用户信息'
            });
        })
        .catch(function (err) {
            next(err)
        })
};

exports.userUpdate = function (req, res, next) {
    let _id = req.params.id;
    let level = parseInt(req.session.admin.level);
    let roomFind = {};
    if (level <= 1000) {
        roomFind._id = req.session.admin.room;
    }
    let userPromise = UserModel
        .findById(_id)
        .populate('room')
        .exec();
    let roomsPromise = RoomModel
        .find(roomFind)
        .select('name title')
        .exec();
    Promise
        .all([userPromise, roomsPromise])
        .then(function ([user, rooms]) {
            res.render('userUpdate', {
                title: user.name + '信息修改',
                user: user,
                rooms: rooms
            });
        })
        .catch(function (err) {
            next(err)
        });
};

exports.userSearch = function (req, res, next) {
    let room_id = req.params.room_id;
    let findOpt = {};
    if (room_id !== 'all') {
        findOpt._id = room_id;
    }
    RoomModel
        .find(findOpt)
        .select('name title')
        .exec()
        .then(function (rooms) {
            res.render('userSearch', {
                    title: '用户检索',
                    rooms: rooms
                }
            );
        })
        .catch(function (err) {
            next(err)
        })
};

exports.userQuery = function (req, res, next) {
    let search = {};
    let _search = req.body.search;
    let totalPageNum;
    let pageNum = req.params.page;
    for (let key in _search) {
        if (_search[key] !== '') {
            if (key === 'name' || key === 'nickName') {
                search[key] = new RegExp(_search[key], 'gi')
            } else {
                search[key] = _search[key]
            }
        }
    }

    let countPromise = UserModel
        .count(search)
        .exec();

    let usersPromise = UserModel
        .find(search)
        .skip((pageNum - 1) * pageSize)
        .limit(pageSize)
        .populate('room', 'title')
        .exec();

    Promise.all([countPromise, usersPromise])
        .then(function ([count, users]) {
            totalPageNum = Math.ceil(count / pageSize);
            res.render('userQuery', {
                title: '管理用户列表-查询结果'
                , users: users
                , search: _search
                , pageCount: totalPageNum
            });
        })
        .catch(function (err) {
            next(err)
        })
};

exports.signUp = function (req, res, next) {
    let user;
    let _user = req.body.user;
    if (_user.room === '') {
        delete _user.room;
    }
    UserModel
        .find({"$or": [{'name': _user.name}, {'phone': _user.phone}]})
        .exec()
        .then(function (users) {
            if (users.length === 0) {
                user = new UserModel(_user);
                user.save(function (err, user) {
                    if (err) {
                        console.log(err)
                    }
                    res.redirect('/admin/userdetail/' + user._id)
                })
            } else {
                if (users[0].name === _user.name) {
                    res.redirect('/admin/information/name')
                } else if (users[0].phone == _user.phone) {
                    res.redirect('/admin/information/phone')
                }
            }
        })
        .catch(function (err) {
            next(err)
        })
};

exports.update = function (req, res,next) {
    let _user = req.body.user;
    let id = _user._id;
    delete _user._id;
    UserModel
        .where('_id').ne(id)
        .or([{'name': _user.name}, {'phone': _user.phone}])
        .exec()
        .then(function (users) {
            if (users.length === 0) {
                UserModel.findByIdAndUpdate(id, {$set: _user}, function (err) {
                    if (err) {
                        console.log(err);
                    }
                    res.redirect('/admin/userdetail/' + id)
                });
            } else {
                if (users[0].name === _user.name) {
                    res.redirect('/admin/information/name')
                } else if (users[0].phone == _user.phone) {
                    res.redirect('/admin/information/phone')
                }
            }
        })
        .catch(function(err){
            next(err)
        })
};

exports.forbidden = function (req, res) {
    let _id = req.query.id;
    let forbidden;
    UserModel
        .findById(_id)
        .exec()
        .then(function (user) {
            forbidden = !user.forbidden;
            return UserModel.findByIdAndUpdate(_id, {$set: {forbidden}})
                .exec()
        })
        .then(function () {
            res.json({
                state: 'success',
                forbidden
            })
        })
};

exports.onLine = function (id, next) {
    UserModel.findByIdAndUpdate(id, {$set: {online: true}})
        .exec()
        .then(function () {
            next(null)
        })
        .catch(function (err) {
            next(err)
        })
};
exports.offLine = function (id, next) {
    UserModel.findByIdAndUpdate(id, {$set: {online: false}})
        .exec()
        .then(function () {
            next(null)
        })
        .catch(function (err) {
            next(err)
        })
};

exports.delete = function (req, res, next) {
    let id = req.query.id;
    let messagePromise = MessageModel
        .deleteMany({from: id})
        .exec();
    let userPromise = UserModel.findByIdAndRemove(id)
        .exec();
    Promise
        .all([messagePromise, userPromise])
        .then(function ([]) {
            res.json({
                state: 'success'
            })
        })
        .catch(function (err) {
            next(err)
        });
};

exports.signIn = function (req, res,next) {
    console.log('signIn');

    let _user = req.body;
    let name = _user.name;
    let password = _user.password;
    let roomId = _user.room;

    console.log(_user);

    UserModel
        .findOne({name: name})
        .exec()
        .then(function (user) {
            _user=user;
            if (!user) {
                return Promise.reject({
                    state:'fail',
                    reason:'no name'
                })
            }
            if (user.room != roomId) {
                return Promise.resolve({
                    state: 'fail'
                    , reason: 'wrong room'
                })
            }

            return user.comparePassword(password)
        })
        .then(function (flag) {
            console.log(flag);
            if (flag===false) {
                res.json({
                    state: 'fail',
                    reason: 'password wrong'
                })
            }
            else if(flag===true){
                req.session.admin = _user;
                return res.json({
                    state: 'success',
                    name: _user.name
                });
            }
        })
        .catch(function(err){
            next(err)
        })
};

exports.signOut = function (req, res) {
    delete req.session.admin;
    return res.json({
        state: 'success'
    })
};
