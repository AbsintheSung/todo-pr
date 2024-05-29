import axios from 'axios'
import { loading, errorAlert, toast } from "./swal"
const loginForm = document.querySelector('.login-form');
const inputEmail = document.querySelector(".login-email");
const inputPassword = document.querySelector(".login-password");
const loginButton = document.querySelector(".login-btn");
const loginWarn = document.querySelectorAll('.login-warn')
const loginWarnView = Array.from(loginWarn)


const fetchUserData = async (userdata) => {
    try {
        loading('登入中')
        const response = await axios.post("https://todoo.5xcamp.us/users/sign_in", userdata);
        if (response.status === 200) {
            document.cookie = `TokenCode=${response.headers["authorization"]}`
            sessionStorage.setItem(`nickname${response.headers["authorization"]}`, response.data.nickname);
            toast('success', '登入成功')
            window.location.href = './home.html'
        }
    } catch (error) {
        console.error(error.response);
        errorAlert(error.response.data.message, 'error')
    }
}


const constraints = {
    "email": {
        presence: {
            message: '必填'
        },
        email: {
            message: "須符合Email格式"
        }
    },
    "password": {
        presence: {
            message: '必填'
        },
        length: {
            minimum: 6,
            message: "密碼長度必須大於6"
        }
    },
};
//重置警告標語為空字串
function reSetWarnView() {
    loginWarnView.forEach((warnItem) => {
        warnItem.textContent = ''
    })
}

//錯誤資訊顯示
function loginVerify(errorMessage) {
    for (let errorkey in errorMessage) {
        loginWarnView.forEach((domItem) => {
            if (domItem.id === (errorkey + "warn")) {
                domItem.textContent = errorMessage[errorkey].pop().split(' ').slice(1).join(' ')
            }
        })
    }
}


loginButton.addEventListener("click", async (event) => {
    event.preventDefault();
    let islogin = false
    const errorMessage = validate(loginForm, constraints);
    const userInput = {
        "user": {
            email: inputEmail.value,
            password: inputPassword.value
        }
    }
    reSetWarnView()
    errorMessage ? loginVerify(errorMessage) : await fetchUserData(userInput)
})


//初始化設定
reSetWarnView()







