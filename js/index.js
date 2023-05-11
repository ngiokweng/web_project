// var db = openDatabase('mydb', '1.0', 'Test DB', 2 * 1024 * 1024);

// console.log(db)

function login(e){
    let username = document.querySelector("input[name='username']").value
    let password = document.querySelector("input[name='password']").value
    if(username == "" || password == "")alert("帳號/密碼不能為空!!!")

}


const login_btn = document.querySelector("#login-btn");
const reg_btn = document.querySelector("#reg-btn");


login_btn.addEventListener('click',login)


