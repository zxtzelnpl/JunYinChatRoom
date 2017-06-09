var socket = io();
var trs = $('[class^=item-id]');

$('.del').click(function (e) {
    var target = $(e.target);
    var id = target.data('id');


    socket.emit('delMessage', id)
});

socket.on('delMessage', function (message) {
    var className = ".item-id-" + message._id;
    $(className).remove();
});


$('.success').click(function (e) {
    var target = $(e.target);
    var id = target.data('id');


    socket.emit('checkMessage', id)
});

socket.on('checkedMessage', function (message,checker) {
    var time=message.createAt;

    var className = ".item-id-" + message._id;
    var tds=$(className).children();
    tds.eq(4).html(checker);
    tds.eq(5).html(time);
    tds.eq(6).html('已经审核通过');
});
