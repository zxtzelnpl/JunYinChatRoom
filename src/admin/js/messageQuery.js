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
    console.log(tds);
    tds.eq(3).html(checker);
    tds.eq(4).html(time);
});




$('#page').find('a').click(function (e) {
    var page = e.target.innerHTML;
    var form = $('#search');
    form.attr('action', function (index, before) {
        console.log(before);
        return before + page;
    });
    form.submit()
});



