// 檢查登錄狀態，並改變成對應的樣式
!(function(){
    var username = getCookieByKey("username");
    var loginStatus = getCookieByKey("loginStatus");
    if(username != undefined || loginStatus != undefined){
        document.querySelector(".login").style.display = "none";
        document.querySelector(".after-login .username").innerHTML = loginStatus || username;
        window.username = loginStatus || username; // 保存用戶名
        document.querySelector(".after-login").style.display = "block"
    }
})()


function getCookieByKey(key){
    var arr = document.cookie.split(';');
    for(var i = 0; i < arr.length; i++){
        var key_value = arr[i].split("=");
        if(key_value[0].trim() == key){
            return key_value[1].trim()
        }
    }
}

function delCookie(key){
    var exp = new Date();
    exp.setTime(exp.getTime() - 1);
    var cval=getCookieByKey(key);
    if(cval!=null){
        document.cookie = key + "="+cval+";expires="+exp.toGMTString()+"; path=/";
    } 
}


// login_btn的回調函數
function login(e){
    let username = document.querySelector("input[name='username']").value;
    let password = document.querySelector("input[name='password']").value;
    if(username == "" || password == ""){
        alert("帳號/密碼不能為空!!!");
        return;
    }

    // 向本地server發送ajax請求，驗證帳號
    $.ajax({
        type: "get",
        url: "http://localhost:1234/login",
        data:{
            "username":username,
            "password":password
        },
        dataType: "jsonp",
        jsonp: "callback",
        jsonpCallback:"f",
        success: function (response) {
            alert(response.retMsg);
            if(response.success){
                document.querySelector(".login").style.display = "none";

                // 決定是否保存cookie,用來自動登錄
                var autoLogin = document.querySelector("#auto-login").checked;
                if(autoLogin){
                    //保存cookie
                    // 用expires=XXX 設置一個無可能過期的cookie
                    // 否則默認cookie會在瀏覽器關閉時清除
                    document.cookie = `username=${username}; expires=Tue, 08 Jun 2343 10:59:40 GMT; path=/`;
                }
                document.cookie = `loginStatus=${username};path=/`;

                document.querySelector(".after-login .username").innerHTML = username;
                document.querySelector(".after-login").style.display = "block"
            }
        },
        error: function (thrownError) {
            console.log(thrownError);
        }
    });

}


// register 的回調函數
function register(e){
    let username = document.querySelector("input[name='username']").value;
    let password = document.querySelector("input[name='password']").value;
    if(username == "" || password == ""){
        alert("帳號/密碼不能為空!!!");
        return;
    }

    $.ajax({
        type: "get",
        url: "http://localhost:1234/register",
        data:{
            "username":username,
            "password":password
        },
        dataType: "jsonp",
        jsonp: "callback",
        jsonpCallback:"f",
        success: function (response) {
            alert(response.retMsg);
            if(response.success){
                alert(">> 點擊登錄按鈕以進行登錄 <<")
            }
        },
        error: function (thrownError) {
            console.log(thrownError);
        }
    });
}

// logoutEle 的回調函數
function logout(e){
    delCookie("username")
    delCookie("loginStatus")
    document.querySelector(".after-login").style.display = "none"
    document.querySelector(".login").style.display = "flex";
}


// 獲取登錄、注冊、退出按鈕
const login_btn = document.querySelector("#login-btn");
const reg_btn = document.querySelector("#reg-btn");
const logoutEle = document.querySelector(".logout");


// 綁定login_btn點擊事件
login_btn.addEventListener('click',login)
// 綁定logout_btn點擊事件
logoutEle.addEventListener('click',logout)
reg_btn.addEventListener('click',register)
