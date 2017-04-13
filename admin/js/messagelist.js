import $ from 'jquery'
import moment from 'moment';

const socket = io();
let trs = $('[class^=item-id]');

$('.del').click(function (e) {
    let target = $(e.target);
    let id = target.data('id');


    socket.emit('delMessage', id)
});

socket.on('delMessage', function (message) {
    let className = ".item-id-" + message._id;
    $(className).remove();
});


$('.success').click(function (e) {
    let target = $(e.target);
    let id = target.data('id');


    socket.emit('checkMessage', id)
});

socket.on('checkedMessage', function (message,checker) {
    let time=moment(message.createAt).format('HH:MM-MM/DD/YYYY');

    let className = ".item-id-" + message._id;
    let tds=$(className).children();
    console.log(tds);
    tds.eq(3).html(checker);
    tds.eq(4).html(time);
});

socket.emit('test','aaaaaa');
socket.on('test',function(msg){
    console.log(msg);
});
