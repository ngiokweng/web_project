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

function createSelectItem(value){
    //  <option value ="volvo">404 Error</option>
    var option = document.createElement("option");
    option.setAttribute("value",value);
    option.innerHTML = `${value}個`;
    return option;
}

function renderingTable(start,size){
    var tbody = document.querySelector("body > div.container > table > tbody");
    // 先清空tbody
    tbody.innerHTML = "";
    for(var i = start; i < start+size; i++){
        tbody.appendChild(window.postsData[i]);
    }

}

function changePageLimit(){
    var table = document.querySelector("body > div.container > table");
    var current_page = table.getAttribute("current-page");
    renderingTable(current_page*this.value,this.value);
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
        // 先將數據保存起來
        window.postsData = [];
        for(var data of postsData){
            var tr = createTableItem(data)
            window.postsData.push(tr);
            // tbody.appendChild(tr);
        }

        // 渲染下拉框每頁頁數
        var limit_select = document.querySelector("#post-limit");
        limit_select.addEventListener('change',changePageLimit);
        var dataSize = postsData.length;
        if(dataSize < 5){
            limit_select.appendChild(createSelectItem(dataSize));
            renderingTable(0,dataSize);
        }else{
            renderingTable(0,5);
            for(var i = 5; i <= dataSize; i+=5){
                limit_select.appendChild(createSelectItem(i));
            }
        }
  
    },
    error: function (thrownError) {
        alert("數據請求失敗，請F5刷新一下");
    }
});
