import $ from 'jquery';

$('#signOut').click(function(e){
    e.preventDefault();
    $.ajax({
        url:'/user/signout'
        ,method:'GET'
        ,success:function(data){
            console.log(data);
            location.href='/admin';
        }
        ,error:function(data){
            console.log(data)
        }
    })
});


