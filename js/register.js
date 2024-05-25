const registerForm = document.querySelector('.register-form')
const registerEmail = document.querySelector(".register-email")
const registerName = document.querySelector(".register-name")
const registerPassword = document.querySelector(".register-password")
const confirmationPassword = document.querySelector(".confirmation-password")
const registerBtn = document.querySelector(".register-btn")
const registeWarn = document.querySelectorAll(".register-warn")

const warnView = Array.from(registeWarn)
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
let constraints = {
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
            message: "二次密碼必須與密碼相同"
        }
    }
};

function sendData() {
    console.log('測試')
}


registerBtn.addEventListener('click', (event) => {
    event.preventDefault();
    const errorMessage = validate(registerForm, constraints);
    reSetWarnView()
    errorMessage != undefined ? verify(errorMessage) : sendData()
})

