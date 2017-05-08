const fs = require('fs');
const path = require('path');

const PictureModel = require('../models/picture');
const RoomModel = require('../models/room');

exports.pictureList = function (req, res) {
    let name = req.params.id;
    if(name==='all'){
        PictureModel
            .find({})
            .populate('uploader','name')
            .populate('room','title')
            .exec(function (err, pictures) {
                if(err){console.log(err)}
                res.render('pictureList', {
                    title: '图片列表'
                    ,pictures:pictures
                });
            });
    }else{
        RoomModel
            .find({name:name})
            .exec(function(err,room){
                PictureModel
                    .find({room: room._id})
                    .populate('uploader','name')
                    .populate('room','title')
                    .exec(function (err, pictures) {
                        if(err){console.log(err)}
                        res.render('pictureList', {
                            title: '图片列表-' + room
                            ,pictures:pictures
                        });
                    });
            });
    }
};

exports.pictureUpload = function (req, res) {
    let id = req.query.id;
    if(id){
        RoomModel
            .find({})
            .exec(function(err,rooms){
                PictureModel.findById(id,function(err,picture){
                    if(err){console.log(err)}
                    res.render('pictureUpload',{
                        title: '图片修改-' + id
                        ,picture,
                        rooms
                    })
                })
            });
    }else{
        RoomModel
            .find({})
            .exec(function(err,rooms){
                res.render('pictureUpload', {
                    title: '图片上传'
                    ,rooms
                });
            });
    }
};

exports.savePic = function (req, res, next) {
    let posterData = req.files.uploadPic;
    console.log(posterData);
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
    if (picture._id) {
        PictureModel.findByIdAndUpdate(picture._id, {$set: picture}, function (err) {
            if (err) {
                console.log(err)
            }
            res.redirect('/admin/pictureroom/' + picture.room)
        })
    } else {
        let _picture = new PictureModel(picture);
        _picture.save(function (err, picture) {
            if (err) {
                console.log(err)
            }
            res.redirect('/admin/pictureroom/' + picture.room)
        })
    }
};
