var QQstr=
    '<div class="form-group">' +
        '<div class="col-sm-4 col-sm-offset-5">' +
            '<input class="form-control" name="room[QQ]" type="text"/>' +
        '</div>' +
        '<div class="col-sm-1">' +
            '<a class="btn glyphicon glyphicon-minus"></a>' +
        '</div>' +
    '</div>';

function remove(){
    var QQ=$(this).parents('.form-group').eq(0);
    QQ.find('.glyphicon-minus').off('click',remove);
    QQ.remove();
}

function add(){
    var QQfirst=$('[name="room[QQ]"]:last').parents('.form-group').eq(0);
    QQfirst.after(QQstr);
    QQfirst.next().find('.glyphicon-minus').on('click',remove)
}



$('.glyphicon-plus').click(add);
$('.glyphicon-minus').on('click',remove);

$('#submit').click(function(){
    var QQs=$('[name="room[QQ]"]');
    QQs.each(function(index,ele){
        $(ele).attr('name','room[QQ]['+index+']')
    })
});
