exports.admin = function (req, res) {
    res.render('admin', {});
};

exports.adminRequired=function(req,res,next){
    next()
};

exports.information=function(req,res){
    let information=req.params.information;
    res.render('information',{
        information
    })
};
