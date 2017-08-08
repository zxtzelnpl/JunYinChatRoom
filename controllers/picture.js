const fs = require('fs');
const path = require('path');
const PictureModel = require('../models/picture');
const RoomModel = require('../models/room');
const Report = require('../report/report');

exports.pictureList = function (req, res) {
    new Promise(function (resolve, reject) {
        let room_id = req.params.id;
        let optFind, optSort;
        if (room_id === 'all') {
            optFind = {};
            optSort = {'room': -1, 'position': 1};
        }
        else {
            optFind = {room: room_id};
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
                resolve({pictures,room_id})
            });
    })
        .then(function ({pictures,room_id}) {
            res.render('pictureList', {
                title: '图片列表'
                , pictures
                ,room_id
            });
        })
        .catch(function (err) {
            Report.errPage(res, err)
        });

};

exports.pictureUpload = function (req, res) {
    new Promise(function (resolve, reject) {
        let room = req.params.room;
        let findObj = {};
        if (room !== 'all') {
            findObj._id = room
        }
        RoomModel
            .find(findObj)
            .exec(function (err, rooms) {
                if (err) {
                    reject(err)
                }
                resolve(rooms);
            })
    })
        .then(function (rooms) {
            res.render('pictureUpload', {
                title: '图片上传'
                , rooms
            })
        })
        .catch(function (err) {
            Report.errPage(res, err)
        })
};

exports.pictureUpdate = function (req, res) {
    let picPromise=new Promise(function (resolve, reject) {
        let img = req.params.img;
        PictureModel
            .findById(img)
            .exec(function (err, picture) {
                if (err) {
                    reject(err)
                }
                resolve(picture);
            })
    });

    let roomPromise = picPromise.then(function(picture){
        return new Promise(function(resolve,reject){
            let room_id=picture.room;
            RoomModel
                .find({_id:room_id})
                .exec(function(err,rooms){
                    if(err){
                        reject(err)
                    }
                    resolve({picture,rooms})
                })
        })
    });

    roomPromise
        .then(function ({picture,rooms}) {
            console.log(rooms);
            res.render('pictureUpdate', {
                title: '图片修改'
                , picture
                ,rooms
            })
        })
        .catch(function (err) {
            Report.errPage(res, err)
        })
};

exports.savePic = function (req, res, next) {
    let posterData = req.files.uploadPic;
    let filePath = posterData.path;
    let originalFilename = posterData.originalFilename;
    console.log("########originalFilename########");
    console.log(originalFilename);
    console.log(filePath);
    console.log("########originalFilename########");
    if (originalFilename) {
        fs.readFile(filePath, function (err, data) {
            if (err) {
                console.log(err)
            }
            let timestamp = Date.now();
            let type = posterData.type.split('/')[1];
            let picName = timestamp + '.' + type;
            let newPath = path.join(__dirname, '../', '/public/upload/' + picName);

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
    picture.uploader = req.session.admin._id;
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
