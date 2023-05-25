// http://127.0.0.1:1234/page/post.html


document.querySelector("#post-article").onclick = function(){
    location.href = `${location.origin}/page/post.html`
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

function createTableItem(data,index){
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

    //保存data的索引，以便快速提取
    tr.setAttribute("index",index);

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
    renderingTable(0,this.value);
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

function onPrevBtnClick(){
    var currentPage = document.querySelector("body > div.container > div > ul > li.active");
    var pageNo = Number(currentPage.innerHTML);
    if(pageNo == 1)return;

    
    var limitSize = Number(document.querySelector("#post-limit").value);
    var prevPage = document.querySelector(`.page-no li:nth-child(${pageNo})`);
    prevPage.setAttribute("class","active");
    currentPage.removeAttribute("class");
    pageNo = Number(prevPage.innerHTML);

    renderingTable((pageNo-1)*limitSize,limitSize);
}

function onNextBtnClick(){
    var currentPage = document.querySelector("body > div.container > div > ul > li.active");
    var pageNo = Number(currentPage.innerHTML);
    var pageNoSize = document.querySelectorAll("body > div.container > div > ul li").length - 2; // 除去兩個箭嘴
    if(pageNo == pageNoSize)return;

    var limitSize = Number(document.querySelector("#post-limit").value);
    var nextPage = document.querySelector(`.page-no li:nth-child(${pageNo+2})`);
    nextPage.setAttribute("class","active");
    currentPage.removeAttribute("class");
    pageNo = Number(nextPage.innerHTML);


    renderingTable((pageNo-1)*limitSize,limitSize);
}

function renderingPageNo(limitSize,size){
    var pages = Math.ceil(size/limitSize);
    var ul = document.querySelector(".page-no");
    // 清空ul
    ul.innerHTML = "";

    // 創建 "<" 
    var li = document.createElement("li");
    var span = document.createElement("span");
    span.setAttribute("class","iconfont icon-arrow-left-bold");
    li.appendChild(span);
    ul.appendChild(li);
    li.addEventListener('click',onPrevBtnClick);

    // 創建pageNo
    for(var i = 0; i < pages; i++){
        var pageNo = createPageNo(i+1);
        if(i+1 == 1)pageNo.setAttribute("class","active");
        pageNo.addEventListener('click',onPageNoClick);
        ul.appendChild(pageNo);
    }
    // 創建 ">" 
    li = document.createElement("li");
    li.addEventListener('click',onNextBtnClick)
    span = document.createElement("span");
    span.setAttribute("class","iconfont icon-arrow-right");
    li.appendChild(span);
    ul.appendChild(li);
}

function onPostClick(){
    location.href =  `${location.origin}/page/content.html?index=${this.getAttribute("index")}`
}

function onChoice(e){
    // 阻止冒泡
    e.stopPropagation();
}

function onDeletePost(){
    var choices = document.querySelectorAll("body > div.container > table > tbody input:checked");
    if(choices.length == 0){
        alert("請先選擇要刪除的帖文!!!");
        return;
    }
    var deleteArr = [];
    // 要由後向前刪除,否則會有問題
    for(var i = choices.length - 1; i >= 0; i--){
        var delete_index = Number(choices[i].parentElement.parentElement.getAttribute("index"));
        deleteArr.push(delete_index);
        window.postsData.splice(delete_index,1);
    }

    $.ajax({
        type: "get",
        url: `http://localhost:1234/deletePost`,
        data:{
            "deleteArr":deleteArr
        },
        dataType: "jsonp",
        jsonp: "callback",
        jsonpCallback:"f",
        success: function (response) {
            alert("刪除成功!!!!")
            location.reload();
        },
        error: function (thrownError) {
            console.log(thrownError);
        }
    });

}

function onGetPostsSuccess (response) {
    var postsData = response.data;
    if(postsData.length == 0)return;
    // 先將數據保存起來
    window.postsData = [];
    for(var i = 0; i < postsData.length; i++){
        var tr = createTableItem(postsData[i],i);
        tr.addEventListener('click',onPostClick)
        tr.querySelector("input").addEventListener('click',onChoice)
        window.postsData.push(tr);
    }

    // 渲染下拉框每頁頁數、和page-no
    var limit_select = document.querySelector("#post-limit");
    limit_select.addEventListener('change',changePageLimit);
    var dataSize = postsData.length;
    if(dataSize < 5){
        limit_select.appendChild(createSelectItem(dataSize));
        renderingTable(0,dataSize);
        renderingPageNo(dataSize,1);
    }else{
        renderingTable(0,5);
        for(var i = 5; i <= dataSize; i+=5){
            limit_select.appendChild(createSelectItem(i));
        }
        renderingPageNo(5,dataSize);
    }

}
// 加載帖文數據
$.ajax({
    type: "get",
    url: "http://localhost:1234/getPosts",
    dataType: "jsonp",
    jsonp: "callback",
    jsonpCallback:"f",
    success: onGetPostsSuccess,
    error: function (thrownError) {
        alert("數據請求失敗，請F5刷新一下");
    }
});

document.querySelector("#choice-all").addEventListener('click',function(){
    var choices = document.querySelectorAll("body > div.container > table > tbody input");
    for(var choice of choices){
        choice.checked = this.checked;
    }
})

document.querySelector("#delete-article").addEventListener('click',onDeletePost)

