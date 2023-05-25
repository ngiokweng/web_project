!(function(){
    var getDateByTimestamp = function(timestamp){
        timestamp = Number(timestamp);
        var date = new Date(timestamp)
    
        var year = date.getFullYear();
        var month = (date.getMonth() + 1).toString().padStart(2,'0');
        var day = date.getDate().toString().padStart(2,'0');
        var hour = date.getHours().toString().padStart(2,'0');
        var mins = date.getMinutes().toString().padStart(2,'0');
        var sec = date.getSeconds().toString().padStart(2,'0');
        return `${year}-${month}-${day}  |  ${hour}:${mins}:${sec}`
    }

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
            
            var data = response['data'];
            var date = getDateByTimestamp(data['timestamp']);

            document.querySelector("body > div.container > div.title > span.title-content").innerHTML = data['title'];
            document.querySelector("body > div.container > div.info > span.user-info").innerHTML = data['username'];
            document.querySelector("body > div.container > div.info > span.time-info").innerHTML = date;

            document.querySelector("body > div.container > div.content").innerHTML = data['content'];



        },
        error: function (thrownError) {
            console.log(thrownError);
        }
    });
})()


