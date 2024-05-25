import axios from "axios"
const registerForm = document.querySelector('.register-form')
const registerEmail = document.querySelector(".register-email")
const registerName = document.querySelector(".register-name")
const registerPassword = document.querySelector(".register-password")
const confirmationPassword = document.querySelector(".confirmation-password")
const registerBtn = document.querySelector(".register-btn")
const registeWarn = document.querySelectorAll(".register-warn")

const warnView = Array.from(registeWarn)
const constraints = {
    "email": {
        presence: {
            message: '必填'
        },
        email: {
            message: "須符合Email格式"
        }
    },
    "nickname": {
        presence: {
            message: '必填'
        },
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
    "repassword": {
        presence: {
            message: '必填'
        },
        equality: {
            attribute: "password",
            message: "必須與密碼相同"
        }
    }
};

//重置警告標語為空字串
function reSetWarnView() {
    warnView.forEach((warnItem) => {
        warnItem.textContent = ''
    })
}
//驗證後顯示錯誤資訊
function verify(errorMessage) {
    for (let errorkey in errorMessage) {
        warnView.forEach((domItem) => {
            if (domItem.id === errorkey) {
                domItem.textContent = errorMessage[errorkey].pop().split(' ').slice(1).join(' ')
            }
        })
    }
}

//發送API
async function sendData(data) {
    const url = 'https://todoo.5xcamp.us/users'
    try {
        let response = await axios.post(url, data)
        if (response.status === 201) {
            console.log(response.data, '順便跳轉')
        }

    } catch (error) {
        console.log(error.response.status, error.response.data)
    }
}


//監聽事件
registerBtn.addEventListener('click', async (event) => {
    event.preventDefault();
    const errorMessage = validate(registerForm, constraints);
    const userData = {
        "user": {
            "email": registerEmail.value,
            "nickname": registerName.value,
            "password": registerPassword.value
        }
    }
    reSetWarnView()

    // errorMessage 若是有錯誤，會回傳物件包含錯誤資訊，若使用者輸入都正確，則 errorMessag 會是 undefined
    errorMessage ? verify(errorMessage) : await sendData(userData)
})

//初始化設定
reSetWarnView()


