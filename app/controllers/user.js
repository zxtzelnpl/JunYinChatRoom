const UserModel = require('../models/user.js');

/**注册start*/
exports.signUp=function(req,res){
    let user;
    let _user=req.body.user;
    UserModel.find({"$or" :  [ {'name':_user.name} , {'phone':_user.phone} ] },function(err,user){
        if(err){
            console.log(err);
        }
        if(user.name===_user.name){
            res.json({
                state:'fail'
                ,reason:'name repeat'
            })
        }
        if(user.phone===_user.name){
            res.text({
                state:'fail'
                ,reason:'phone repeat'
            })
        }
    });
    user = new UserModel(_user);
    user.save(function(err){
        if(err){
            console.log(err)
        }
        res.json({
            state:'success'
        })
    })
};
/**注册end*/



/**登录start*/
exports.signIn=function(req,res){

};
/**登录end*/



/**登出start*/
exports.signOut=function(req,res){

};
/**登出end*/



/**修改start*/
exports.signUpdate=function(req,res){

};
/**修改end*/
