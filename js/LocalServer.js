const express = require('express')  
const app = express()

const fs = require("fs")

app.use(express.json({limit: '100mb'}));
app.use(express.urlencoded({limit: '100mb'}));

app.get("/login",function(req,res){
    // 客戶端發來的帳號數據
    username = req.query['username'];
    password = req.query['password'];

    // 本地用戶數據
    userData = JSON.parse(fs.readFileSync("../data/data.json"));

    var retMsg,success;
    if(userData[username] == undefined){
        retMsg = "用戶名不存在，重注冊!";
        success = false;
    }else if(userData[username] != password){
        retMsg = "密碼錯誤，請重新輸入!!";
        success = false;
    }else{
        retMsg = "登錄成功!!!"
        success = true;
    }

    ret = {
        success:success,
        retMsg:retMsg
    }
    // jsonp的寫法
    var funcName = req.query.callback;
    res.send(`${funcName}(${JSON.stringify(ret)})`);
})

app.listen(1234,()=>{
    console.log("開始服務，端口1234")
})