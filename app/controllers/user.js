const UserModel = require('../models/user.js');

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
                res.redirect('/admin/user/' + user._id)
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

        console.log(user);

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
    let _user=req.body.user;
    let id=_user._id;
    delete _user._id;
    console.log(_user);
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
                res.redirect('/admin/user/' + user._id)
            })
        } else {
            if (users[0].name === _user.name) {
                res.redirect('/admin/information/name')
            } else if (users[0].phone == _user.phone) {
                res.redirect('/admin/information/phone')
            }
        }
    });
    UserModel.findByIdAndUpdate(id,{$set:_user},function(err){
        if(err){
            console.log(err);
        }
        res.redirect('/admin/user/' + id)
    });
};
/**修改end*/

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

/**查询start*/
exports.query = function (req, res) {
    let search = {};
    let _search = req.body.search;
    for (let key in _search) {
        if (_search[key] !== '') {
            if (key === 'name'||key==='nickName') {
                search[key] = new RegExp(_search[key],'gi')
            } else {
                search[key] = _search[key]
            }
        }
    }

    UserModel.find(search,function(err,users){
        if(err){
            console.log(err);
        }
        res.render('user', {
            title:'管理用户列表-查询结果'
            ,users:users
        });
    });

};
/**查询end*/


/**删除start*/
exports.delete = function (req, res) {
    let id = req.query.id;
    console.log(id);
    UserModel.findByIdAndRemove(id, function (err, back) {
        if (err) {
            console.log(err)
        }
        console.log(back);
        res.json({
            state: 'success'
        })
    })
};
/**删除end*/
