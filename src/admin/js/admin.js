$('#submit').click(function(e){
    e.preventDefault();
    var name=$('#signInName').val();
    var password=$('#signInPassword').val();
    console.log(name,password);
    $.ajax({
        url:'/admin/signin'
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

$('#signOut_ls_999').click(function(e){
    e.preventDefault();
    $.ajax({
        url:'/user/signout'
        ,method:'GET'
        ,success:function(data){
            console.log(data);
            location.href='/src/admin/login';
        }
        ,error:function(data){
            console.log(data)
        }
    })
});
