const UserModel = require('../models/user.js');
const pageSize = 20;

exports.userList = function (req, res) {
    let pageNum = req.params.page;
    let totalPageNum;
    let query = UserModel.find({});
    query.count(function (err, count) {
        totalPageNum = Math.ceil(count / pageSize);
        UserModel.find({})
            .skip((pageNum - 1) * pageSize)
            .limit(pageSize)
            .exec(function (err, users) {
                if (err) {
                    console.log(err);
                }
                res.render('userList', {
                    title: '管理用户列表'
                    , users: users
                    , pageCount: totalPageNum
                });
            });
    });


};

exports.userSignUp = function (req, res) {
    res.render('userSignUp', {});
};

exports.userDetail = function (req, res) {
    let id = req.params.id;
    UserModel.findById(id, function (err, userDetail) {
        res.render('userDetail', {
            userDetail,
            title:userDetail.name+'的用户信息'
        });
    });
};

exports.userUpdate = function (req, res) {
    let id = req.params.id;
    UserModel.findById(id, function (err, userDetail) {
        res.render('userUpdate', {
            userDetail
        });
    });
};

exports.userSearch = function (req, res) {
    res.render('userSearch', {
            title: '用户查询'
        }
    )
};

exports.userQuery = function (req, res) {
    let search = {};
    let _search = req.body.search;
    let totalPageNum;
    let pageNum=req.params.page;
    console.log(_search);
    for (let key in _search) {
        if (_search[key] !== '') {
            if(key === 'online'){
                if(_search[key]==='true'){
                    search[key]=true
                }else{
                    search[key]=false
                }
            }else if(key === 'name' || key === 'nickName') {
                search[key] = new RegExp(_search[key], 'gi')
            } else {
                search[key] = _search[key]
            }
        }
    }
    console.log(search);

    UserModel.count(search, function (err, count) {
        totalPageNum = Math.ceil(count / pageSize);
        UserModel.find(search)
            .skip((pageNum - 1) * pageSize)
            .limit(pageSize)
            .exec(function (err, users) {
                if (err) {
                    console.log(err);
                }
                res.render('userQuery', {
                    title: '管理用户列表-查询结果'
                    , users: users
                    , search: _search
                    , pageCount: totalPageNum
                });
            });
    });
};

exports.signUp = function (req, res) {
    let user;
    let _user = req.body.user;
    UserModel.find({"$or": [{'name': _user.name}, {'phone': _user.phone}]}, function (err, users) {
        if (err) {
            console.log(err);
        }
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
    });
};

exports.update = function (req, res) {
    let _user = req.body.user;
    let id = _user._id;
    delete _user._id;
    UserModel
        .where('_id').ne(id)
        .or([{'name': _user.name}, {'phone': _user.phone}])
        .exec(function (err, users) {
            if (err) {
                console.log(err);
            }
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
        });
};

exports.delete = function (req, res) {
    let id = req.query.id;
    UserModel.findByIdAndRemove(id, function (err) {
        if (err) {
            console.log(err)
        }
        res.json({
            state: 'success'
        })
    })
};

exports.signIn = function (req, res) {
    let _user = req.body;
    let name = _user.name;
    let password = _user.password;

    UserModel.findOne({name: name}, function (err, user) {
        if (err) {
            console.log(err)
        }

        if (!user) {
            return res.json({
                state: 'fail'
                , reason: 'no name'
            })
        }

        user.comparePassword(password, function (err, isMatch) {
            if (err) {
                console.log(err)
            }
            if (isMatch) {
                req.session.user = user;
                return res.json({
                    state: 'success'
                    , name: user.name
                });
            }
            else {
                return res.json({
                    state: 'fail'
                    , reason: 'password wrong'
                })
            }
        })
    })
};

exports.signOut = function (req, res) {
    delete req.session.user;
    return res.json({
        state: 'success'
    })
};
