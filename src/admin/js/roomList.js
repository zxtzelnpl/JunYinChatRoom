$('.del').click(function(e){
    var target = $(e.target);
    var id = target.data('id');
    var tr = $('.item-id-'+ id);

    $.ajax({
        type:'DELETE',
        url:'/admin/room/delete?_id=' + id
    })
        .done(function(results){
            if(results.state ==='success'){
                if(tr.length>0){
                    tr.remove()
                }
            }
        })
});
