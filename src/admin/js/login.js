$(function () {
    // bg switcher
    var $btns = $(".bg-switch .bg");
    $btns.click(function (e) {
        e.preventDefault();
        $btns.removeClass("active");
        $(this).addClass("active");
        var bg = $(this).data("img");

        $("html").css("background-image", "url('/model/img/bgs/" + bg + "')");
    });

    $('#login').click(function (e) {
        e.preventDefault();
        var name = $('#name').val();
        var password = $('#password').val();
        $.ajax({
            url: '/user/signin'
            , method: 'POST'
            , data: {
                name:name,
                password:password
            }
            , success: function (data) {
                if (data.state == 'success') {
                    location.href = '/admin/way/waylist/1';
                }
                else {
                    alert(data.err)
                }
            }
            , error: function (err) {
                alert(err)
            }
        })
    });

});
