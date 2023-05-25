const { time } = require('console');
const express = require('express')  
const app = express()

const fs = require("fs");
// const { title } = require('process');

app.use(express.json({limit: '100mb'}));
app.use(express.urlencoded({limit: '100mb'}));

app.get("/login",function(req,res){
    // 客戶端發來的帳號數據
    var username = req.query['username'];
    var password = req.query['password'];

    // 本地用戶數據
    var userData = JSON.parse(fs.readFileSync("./data/userData.json"));

    var retMsg,success;
    if(userData[username] == undefined){
        retMsg = "用戶名不存在，請先注冊後再進行登錄!";
        success = false;
    }else if(userData[username] != password){
        retMsg = "密碼錯誤，請重新輸入!!";
        success = false;
    }else{
        retMsg = "登錄成功!!!"
        success = true;
    }

    var ret = {
        success:success,
        retMsg:retMsg
    }
    // jsonp的寫法
    var funcName = req.query.callback;
    res.send(`${funcName}(${JSON.stringify(ret)})`);
})

app.get("/register",function(req,res){
    // 客戶端發來的帳號數據
    var username = req.query['username'];
    var password = req.query['password'];

    // 本地用戶數據
    var userData = JSON.parse(fs.readFileSync("./data/userData.json"));
    

    var retMsg,success;
    if(userData[username] != undefined){
        retMsg = "用戶名已存在，請重新輸入!";
        success = false;
    }else{
        userData[username] = password;
        fs.writeFileSync("./data/userData.json",JSON.stringify(userData));
        retMsg = "注冊成功!!!"
        success = true;
    }

    var ret = {
        success:success,
        retMsg:retMsg
    }
    // jsonp的寫法
    var funcName = req.query.callback;
    res.send(`${funcName}(${JSON.stringify(ret)})`);
})

app.get("/postContent",function(req,res){ 
    var postInfo = JSON.parse(fs.readFileSync("./data/postContent.json"));

    if(postInfo['data'] == undefined){
        postInfo['data'] = []
    }

    postInfo['data'].unshift({
        "content":req.query['content'],
        "title":req.query['title'],
        "username":req.query['username'],
        "timestamp":req.query['timestamp']
    })

    fs.writeFileSync("./data/postContent.json",JSON.stringify(postInfo));

    var ret = {
        success:true
    }
    // jsonp的寫法
    var funcName = req.query.callback;
    res.send(`${funcName}(${JSON.stringify(ret)})`);

})

app.get("/getPosts",function(req,res){ 
    var postInfo = JSON.parse(fs.readFileSync("./data/postContent.json"));

    var ret = {
        success:true,
        data:postInfo['data']
    }
    // jsonp的寫法
    var funcName = req.query.callback;
    res.send(`${funcName}(${JSON.stringify(ret)})`);

})

app.get("/getPostsContent",function(req,res){ 
    var index = Number(req.query['index']);
    var postInfo = JSON.parse(fs.readFileSync("./data/postContent.json"));

    var ret = {
        success:true,
        data:postInfo['data'][index]
    }
    // jsonp的寫法
    var funcName = req.query.callback;
    res.send(`${funcName}(${JSON.stringify(ret)})`);

})


// 導入靜態資源
app.use('/css', express.static('css'));
app.use('/js', express.static('js'));
app.use('/build', express.static('build'));
app.use('/iconfont', express.static('iconfont'));
app.use('/img', express.static('img'));
app.use('/page', express.static('page'));


app.get('/index.html', function (req, res) {
    res.sendFile( __dirname + "/" + "index.html" );
 })


app.listen(1234,()=>{
    console.log("成功開啟本地Server，URL-> http://127.0.0.1:1234/index.html")
})