var socket=io();

$('.del').click(function (e) {
    var target = $(e.target);
    var id = target.data('id');
    var tr = $('.item-id-' + id);

    if(tr.find('.change').html()==='禁用'){
        alert('先将用户禁用才能删除');
        return;
    }

    $.ajax({
        type: 'DELETE',
        url: '/admin/user/delete?id=' + id
    })
        .done(function (results) {
            if (results.state === 'success') {
                if (tr.length > 0) {
                    tr.remove()
                }
            }
        })
});

$('.change').click(function (e) {
    var target = $(e.target);
    var id = target.data('id');
    var word=target.html();
    if(word==='禁用'){
        if(confirm('确认是否'+word)){
            $.ajax({
                type: 'GET',
                url: '/admin/user/forbidden?id=' + id
            })
                .done(function (results) {
                    if (results.state === 'success') {
                        if (results.forbidden) {
                            target.removeClass('btn-warning').addClass('btn-success').html('解禁');
                        } else {
                            target.removeClass('btn-success').addClass('btn-warning').html('禁用');
                        }
                    }
                })
        }
    }else{
        $.ajax({
            type: 'GET',
            url: '/admin/user/forbidden?id=' + id
        })
            .done(function (results) {
                if (results.state === 'success') {
                    if (results.forbidden) {
                        target.removeClass('btn-warning').addClass('btn-success').html('解禁');
                    } else {
                        target.removeClass('btn-success').addClass('btn-warning').html('禁用');
                    }
                }
            })
    }
});

socket.on('usersAdd',function(id){
    var queryClass=".item-id-"+id;
    $(queryClass).children().eq(10).html('在线');
});

socket.on('usersMinus',function(id){
    var queryClass=".item-id-"+id;
    $(queryClass).children().eq(10).html('离线');
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



