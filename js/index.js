
// login_btn的回調函數
function login(e){
    
    
    let username = document.querySelector("input[name='username']").value;
    let password = document.querySelector("input[name='password']").value;
    if(username == "" || password == ""){
        alert("帳號/密碼不能為空!!!");
        return;
    }

    $.ajax({
        type: "get",
        url: `http://localhost:1234/login?username=${username}&password=${password}`,
        dataType: "jsonp",
        jsonp: "callback",
        jsonpCallback:"f",
        success: function (response) {
            console.log(response);
        },
        error: function (thrownError) {
            console.log(thrownError);
        }
    });

}

// 獲取登錄、注冊按鈕
const login_btn = document.querySelector("#login-btn");
const reg_btn = document.querySelector("#reg-btn");

// 綁定點擊事件
login_btn.addEventListener('click',login)


