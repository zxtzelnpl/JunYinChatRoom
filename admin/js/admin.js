import $ from 'jquery';

$('#submit').click(function(e){
    e.preventDefault();
    let name=$('#signInName').val();
    let password=$('#signInPassword').val();
    console.log(name,password);
    $.ajax({
        url:'/user/signin'
        ,method:'POST'
        ,data:{
            name
            ,password
        }
        ,success:function(data){
            console.log(data);
            location.reload();
        }
        ,error:function(data){
            console.log(data)
        }
    })
});

$('#signOut').click(function(e){
    e.preventDefault();
    $.ajax({
        url:'/user/signout'
        ,method:'GET'
        ,success:function(data){
            console.log(data);
            location.reload();
        }
        ,error:function(data){
            console.log(data)
        }
    })
});
