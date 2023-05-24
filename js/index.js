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
    var dataSize = window.postsData.length;
    // 先清空tbody
    tbody.innerHTML = "";
    for(var i = start; i < start+size && i < dataSize; i++){
        tbody.appendChild(window.postsData[i]);
    }

}

function changePageLimit(){
    var table = document.querySelector("body > div.container > table");
    var current_page = table.getAttribute("current-page");
    renderingTable(current_page*this.value,this.value);
    renderingPageNo(this.value,window.postsData.length);
}

function createPageNo(no){
    var li = document.createElement("li");
    li.innerHTML = no;
    return li;
}

function onPageNoClick(){
    var pageNo = Number(this.innerHTML);
    var limitSize = Number(document.querySelector("#post-limit").value);
    document.querySelector("body > div.container > div > ul > li.active").removeAttribute("class");
    this.setAttribute("class","active");
    renderingTable((pageNo-1)*limitSize,limitSize);

}

function renderingPageNo(limitSize,size){
    var pages = Math.floor(size/limitSize)+1;
    var ul = document.querySelector(".page-no");
    // 清空ul
    ul.innerHTML = "";

    // 創建 "<" 
    var li = document.createElement("li");
    var span = document.createElement("span");
    span.setAttribute("class","iconfont icon-arrow-left-bold");
    li.appendChild(span);
    ul.appendChild(li);
    // 創建pageNo
    for(var i = 0; i < pages; i++){
        var pageNo = createPageNo(i+1);
        if(i+1 == 1)pageNo.setAttribute("class","active");
        pageNo.addEventListener('click',onPageNoClick);
        ul.appendChild(pageNo);
    }
    // 創建 ">" 
    li = document.createElement("li");
    span = document.createElement("span");
    span.setAttribute("class","iconfont icon-arrow-right");
    li.appendChild(span);
    ul.appendChild(li);
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
        
        // 先將數據保存起來
        window.postsData = [];
        for(var data of postsData){
            var tr = createTableItem(data)
            window.postsData.push(tr);
        }

        // 渲染下拉框每頁頁數、和page-no
        var limit_select = document.querySelector("#post-limit");
        limit_select.addEventListener('change',changePageLimit);
        var dataSize = postsData.length;
        if(dataSize < 5){
            limit_select.appendChild(createSelectItem(dataSize));
            renderingTable(0,dataSize);
            renderingPageNo(dataSize,0);
        }else{
            renderingTable(0,5);
            for(var i = 5; i <= dataSize; i+=5){
                limit_select.appendChild(createSelectItem(i));
            }
            renderingPageNo(5,dataSize);
        }
  
    },
    error: function (thrownError) {
        alert("數據請求失敗，請F5刷新一下");
    }
});

// document.querySelector("#next").onclick = function(){
//     var table = document.querySelector("body > div.container > table");
//     var current_page = table.getAttribute("current-page");
//     var page_limit = document.querySelector("#post-limit").value;
//     if(current_page)
//     current_page++;
//     renderingTable(current_page*this.value,this.value);
// }

// document.querySelector("#prev").onclick = function(){
    
// }
