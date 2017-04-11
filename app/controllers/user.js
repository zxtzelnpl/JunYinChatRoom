const UserModel = require('../models/user.js');
const pageSize = 10;

/**注册start*/
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
                res.redirect('/admin/user/detail/' + user._id)
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
/**注册end*/


/**登录start*/
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
/**登录end*/


/**登出start*/
exports.signOut = function (req, res) {
    delete req.session.user;
    return res.json({
        state: 'success'
    })
};
/**登出end*/


/**修改start*/
exports.update = function (req, res) {
    console.log(req.body.user);
    let _user = req.body.user;
    let id = _user._id;
    delete _user._id;
    console.log(_user);
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
                    res.redirect('/admin/user/detail/' + id)
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
/**修改end*/

/**列表start*/
exports.userList = function (req, res) {
    let pageNum = req.params.page || 1;
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
                res.render('userlist', {
                    title: '管理用户列表'
                    , users: users
                    , pageCount: totalPageNum
                });
            });
    });


};
/**列表end*/

/**详情start*/
exports.userDetail = function (req, res) {
    let id = req.params.id;
    UserModel.findById(id, function (err, userDetail) {
        res.render('userDetail', {
            userDetail
        });
    });
};
/**详情end*/

/**查询首页start*/
exports.search = function (req, res) {
    res.render('usersearch', {
            title: '查询'
        }
    )
};
/**查询首页end*/

/**查询结果start*/
exports.query = function (req, res) {
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
                res.render('userquery', {
                    title: '管理用户列表-查询结果'
                    , users: users
                    , search: _search
                    , pageCount: totalPageNum
                });
            });
    });


    // UserModel
    //     .where('name').ne('zxt')
    //     .where('phone').nin(['1111','111'])
    //     .exec(function(err,users){
    //         res.render('user', {
    //             title:'管理用户列表-查询结果'
    //             ,users:users
    //         });
    //     });

    // UserModel
    //     .where('_id').ne('58e75319ae03d7400c7d8403')
    //     .or([{'name':'z'},{'phone':'11'}])
    //     .exec(function(err,users){
    //         res.render('user', {
    //             title:'管理用户列表-查询结果'
    //             ,users:users
    //         });
    //     });
};
/**查询结果end*/


/**删除start*/
exports.delete = function (req, res) {
    let id = req.query.id;
    UserModel.findByIdAndRemove(id, function (err, back) {
        if (err) {
            console.log(err)
        }
        res.json({
            state: 'success'
        })
    })
};
/**删除end*/
