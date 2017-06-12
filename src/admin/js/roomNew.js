function remove(e) {
    $(e.target).parents('.field-box').remove()
}


$('#addQQ').click(function () {
    console.log('add');
    var boxStr = '<div class="field-box">' +
        '<input class="span10" name="room[QQ]" type="text"/>' +
        '<a class="span2 pull-right btn-glow danger removeQQ" onclick="remove(event)">' +
        '<i class="icon-minus"></i>' +
        '</a>' +
        '</div>';
    var parent = $('#QQAddMark');
    parent.before(boxStr)
});

$('.removeQQ').on('click', remove);

$('#submit').click(function () {
    var QQs = $('[name="room[QQ]"]');
    QQs.each(function (index, ele) {
        $(ele).attr('name', 'room[QQ][' + index + ']')
    })
});
