const fs = require('fs');
const path = require('path');

const PictureModel = require('../models/picture');

exports.pictureList = function (req, res) {
    let room = req.params.room;
    PictureModel
        .find({room: room})
        .populate('uploader','name')
        .exec(function (err, pictures) {
            if(err){console.log(err)}
            res.render('picturelist', {
                title: '图片列表-' + room
                ,pictures:pictures
            });
        });
};

exports.pictureUpload = function (req, res) {
    let id = req.query.id;
    let room = req.params.room;
    if(id){
        PictureModel.findById(id,function(err,picture){
            if(err){console.log(err)}
            res.render('pictureupload',{
                title: '图片修改-' + id
                ,picture
            })
        })
    }else{
        res.render('pictureupload', {
            title: '图片上传-' + room
        });
    }

};

exports.savePic = function (req, res, next) {
    let posterData = req.files.uploadPic;
    let filePath = posterData.path;
    let originalFilename = posterData.originalFilename;
    if (originalFilename) {
        fs.readFile(filePath, function (err, data) {
            if (err) {
                console.log(err)
            }
            let timestamp = Date.now();
            let type = posterData.type.split('/')[1];
            let picName = timestamp + '.' + type;
            let newPath = path.join(__dirname, '../../', '/public/upload/' + picName);

            fs.writeFile(newPath, data, function (err) {
                if (err) {
                    console.log(err)
                }
                req.body.picture.urlBack = picName;
                next()
            })
        })
    } else {
        next()
    }
};

exports.update = function (req, res) {
    let picture = req.body.picture;
    picture.uploader = req.session.user._id;
    console.log(picture);
    if (picture._id) {
        PictureModel.findByIdAndUpdate(picture._id, {$set: picture}, function (err) {
            if (err) {
                console.log(err)
            }
            res.redirect('/admin/picture/room/' + picture.room)
        })
    } else {
        console.log(picture);
        let _picture = new PictureModel(picture);
        console.log(_picture);
        _picture.save(function (err, picture) {
            if (err) {
                console.log(err)
            }
            res.redirect('/admin/picture/room/' + picture.room)
        })
    }
};
