import axios from 'axios'
const inputEmail = document.querySelector(".login-email")
const inputPassword = document.querySelector(".login-password")
const loginButton = document.querySelector(".login-btn")

const fetchUserData = async (userdata) => {
    try {
        const response = await axios.post("https://todoo.5xcamp.us/users/sign_in", userdata);
        if (response.status === 200) {
            document.cookie = `TokenCode=${response.headers["authorization"]}`
        }
        console.log(response)
    } catch (error) {
        console.error(error.response);
    }
}

//測試授權
const checkToken = async () => {
    const token = document.cookie.replace(/(?:(?:^|.*;\s*)TokenCode\s*\=\s*([^;]*).*$)|^.*$/, "$1");
    try {
        const response = await axios.get("https://todoo.5xcamp.us/check", {
            headers: {
                'Authorization': token
            }
        });
        console.log(response)
    } catch (error) {
        console.log(error)
    }
}

loginButton.addEventListener("click", async (event) => {
    event.preventDefault();
    const userInput = {
        "user": {
            email: inputEmail.value,
            password: inputPassword.value
        }
    }
    await fetchUserData(userInput)
})


