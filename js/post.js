
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
// 創建CKEditor
ClassicEditor.create( document.querySelector( '#editor' ), ckeditorConfig).then( editor => {
		console.log( 'Editor was initialized', editor );
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
    
    document.querySelector(".info").innerHTML = `還可以輸入${10-content.length}個字符`

}

const title_input = document.querySelector("#title")

title_input.addEventListener('input',onInput)
