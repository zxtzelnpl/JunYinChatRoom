const fs = require('fs');
const path = require('path');
const PictureModel = require('../models/picture');
const RoomModel = require('../models/room');
const Report = require('../report/report');

exports.pictureList = function (req, res) {
    new Promise(function (resolve, reject) {
        let _id = req.params.id;
        let optFind, optSort;
        if (_id === 'all') {
            optFind = {};
            optSort = {'room': -1, 'position': 1};
        }
        else {
            optFind = {room: _id};
            optSort = {'position': 1};
        }
        PictureModel
            .find(optFind)
            .sort(optSort)
            .populate('uploader', 'name')
            .populate('room', 'title')
            .exec(function (err, pictures) {
                if (err) {
                    reject(err)
                }
                resolve(pictures)
            });
    })
        .then(function (pictures) {
            res.render('pictureList', {
                title: '图片列表'
                , pictures: pictures
            });
        })
        .catch(function (err) {
            Report.errPage(res, err)
        });

};

exports.pictureUpload = function (req, res) {


    let roomPromise = new Promise(function (resolve, reject) {
        let room = req.params.room;
        let findOpt;
        if (room === 'all') {
            findOpt = {}
        } else {
            findOpt = {_id: room}
        }
        RoomModel
            .findOne(findOpt)
            .exec(function (err, room) {
                if (err) {
                    reject(err)
                }
                resolve(room);
            })
    });
    let picPromise = roomPromise.then(function (room) {
        return new Promise(function(resolve,reject){

        });
        let id = req.query.id;
        if (id) {
            PictureModel.findById(id, function (err, picture) {
                if (err) {
                    console.log(err)
                }
                res.render('pictureUpload', {
                    title: '图片修改-' + id
                    , picture,
                    room
                })
            })
        }
        else {
            res.render('pictureUpload', {
                title: '图片上传'
                , rooms
            });
        }
    });
    Promise
        .all([])
        .then(function([]){

        })
        .catch(function(err){
            Report.errPage(res,err)
        })
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
