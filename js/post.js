!(function(){
    // 代表未登錄，直接重定向到主頁
    if(window.username == undefined){
        alert("請先進行登錄!!")
        location.href = `${location.origin}/index.html`
    }
})()

// CKEditor插件相關設置
var ckeditorConfig = {
    "highlight": {
        "options": [
            {
                "model": "yellowMarker", 
                "class": "marker-yellow", 
                "title": "Yellow Marker", 
                "color": "var(--ck-highlight-marker-yellow)", 
                "type": "marker"
            }, 
            {
                "model": "greenMarker", 
                "class": "marker-green", 
                "title": "Green marker", 
                "color": "var(--ck-highlight-marker-green)", 
                "type": "marker"
            }, 
            {
                "model": "pinkMarker", 
                "class": "marker-pink", 
                "title": "Pink marker", 
                "color": "var(--ck-highlight-marker-pink)", 
                "type": "marker"
            }, 
            {
                "model": "blueMarker", 
                "class": "marker-blue", 
                "title": "Blue marker", 
                "color": "var(--ck-highlight-marker-blue)", 
                "type": "marker"
            }, 
            {
                "model": "redPen", 
                "class": "pen-red", 
                "title": "Red pen", 
                "color": "var(--ck-highlight-pen-red)", 
                "type": "pen"
            }, 
            {
                "model": "greenPen", 
                "class": "pen-green", 
                "title": "Green pen", 
                "color": "var(--ck-highlight-pen-green)", 
                "type": "pen"
            }
        ]
    }, 
    "alignment": {
        "options": [
            "left", 
            "right"
        ]
    }, 
    "table": {
        "toolbar": [
            "tableColumn", 
            "tableRow", 
            "mergeTableCells"
        ]
    }, 
    "toolbar": [
        "heading", 
        "|", 
        "bold", 
        "italic", 
        "underline", 
        "strikethrough", 
        "|", 
        "bulletedList", 
        "numberedList", 
        "|", 
        "alignment", 
        "|", 
        "highlight", 
        "code", 
        "blockQuote", 
        "|", 
        "link", 
        "|", 
        "insertTable", 
        "|", 
        "undo", 
        "redo"
    ]
};


function onContentChange(){
    const my_html = document.createElement( 'html' );
    my_html.innerHTML = editor.getData();
    var len = my_html.textContent.length;

    document.querySelector(".content-word-count").innerHTML = `內容還可以輸入${100-len}個字符`
    // 限制內文長度為100
    if(len > 100){
        editor.setData(window.tmpContent);
    }else{
        window.tmpContent = my_html.innerHTML;
    }
}

var editor;

// 創建CKEditor
ClassicEditor.create( document.querySelector( '#editor' ), ckeditorConfig)
    .then( newEditor => {
        editor = newEditor
		console.log( 'Editor was initialized', newEditor );
        // 當textArea改變時,觸發onContentChange
        editor.model.document.on( 'change:data',onContentChange );

	 })
	 .catch( err => {
		console.error( err.stack );
	 });

function onInput(e){
    // 限制用戶輸入長度
    let content = this.value
    if(content.length > 10){
        this.value = this.value.substr(0,10)
        return;
    }
    
    document.querySelector(".title-word-count").innerHTML = `還可以輸入${10-content.length}個字符`

}

function submitPost(){
    var content = editor.getData();
    var title = document.querySelector("#title").value;
    if(title == ""){
        alert("請輸入標題!!");
        return;
    }
    if(content == ""){
        alert("請輸入內容!!!");
        return;
    }

    var timestamp = new Date().getTime();

    // 向本地server發送ajax請求，驗證帳號
    $.ajax({
        type: "get",
        url: "http://localhost:1234/postContent",
        data:{
            "content":content,
            "title":title,
            "username":window.username,
            "timestamp":timestamp
        },
        dataType: "jsonp",
        jsonp: "callback",
        jsonpCallback:"f",
        success: function (response) {
           alert("發帖成功!!!");
           location.href = `${location.origin}/index.html`

        },
        error: function (thrownError) {
            console.log(thrownError);
        }
    });

}


const title_input = document.querySelector("#title");
const submit_btn = document.querySelector("#submit-btn");


title_input.addEventListener('input',onInput)
submit_btn.addEventListener('click',submitPost)

