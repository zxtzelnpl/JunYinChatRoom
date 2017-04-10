import $ from 'jquery'

const socket=io();
let trs=$('[class^=item-id]');

$('.del').click(function(e){
    let target = $(e.target);
    let id = target.data('id');
    let tr = $('.item-id-'+ id);

    $.ajax({
        type:'DELETE',
        url:'/admin/user/delete?id=' + id
    })
        .done(function(results){
            if(results.state ==='success'){
                if(tr.length>0){
                    tr.remove()
                }
            }
        })
});

socket.on('usersAdd',function(ids){
    trs.each(function(index,tr){
        let id=tr.className.slice(8);
        console.log(id);
        if(ids.indexOf(id)>-1){
            $(tr).children().eq(9).html('在线')
        }
    })
});

socket.on('usersMinus',function(id){
    let queryClass=".item-id-"+id;
    $(queryClass).children().eq(9).html('离线');
});
