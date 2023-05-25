!(function(){
    // 請求對應index的帖文數據
    var url = new URL(location.href);
    var params = new URLSearchParams(url.search);
    $.ajax({
        type: "get",
        url: `http://localhost:1234/getPostsContent`,
        data:{
            "index":params.get("index"),
        },
        dataType: "jsonp",
        jsonp: "callback",
        jsonpCallback:"f",
        success: function (response) {
            document.querySelector(".container").innerHTML = response['data']['content'];

        },
        error: function (thrownError) {
            console.log(thrownError);
        }
    });
})()