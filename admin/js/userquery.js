import $ from 'jquery'

$('.del').click(function (e) {
    let target = $(e.target);
    let id = target.data('id');
    let tr = $('.item-id-' + id);

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


$('#page').find('a').click(function (e) {
    let page = e.target.innerHTML;
    let form = $('#search');
    form.attr('action', function (index, before) {
        console.log(before);
        return before + page;
    });
    form.submit()
});
