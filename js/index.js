// http://127.0.0.1:1234/page/post.html


document.querySelector("#psot-article").onclick = function(){
    location.href = "http://127.0.0.1:1234/page/post.html"
}

function getDateByTimestamp(timestamp){
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

function createTableItem(data){
    var tr = document.createElement("tr");
    var checkbox = document.createElement("input");
    checkbox.setAttribute("type","checkbox");
    var tds = [];  
    for(var i = 0; i < 4; i++){
        tds[i] = document.createElement("td");
    }

    // 先構造第1個點選按鈕
    tds[0].appendChild(checkbox);
    tds[1].innerHTML = data['title'];
    tds[2].innerHTML = data['username'];
    tds[3].innerHTML = getDateByTimestamp(data['timestamp']);

    for(var i = 0; i < 4; i++){
        tr.appendChild(tds[i])
    }

    //將post的內容保存在自定義的屬性中
    tr.setAttribute("postContent",data['content']);

    return tr;
}

// 加載帖文數據
$.ajax({
    type: "get",
    url: "http://localhost:1234/getPosts",
    dataType: "jsonp",
    jsonp: "callback",
    jsonpCallback:"f",
    success: function (response) {
        var postsData = response.data;
        var tbody = document.querySelector("body > div.container > table > tbody");     
        // 渲染數據
        for(var data of postsData){
            var tr = createTableItem(data)
            tbody.appendChild(tr);
        }
  
    },
    error: function (thrownError) {
        alert("數據請求失敗，請F5刷新一下");
    }
});
