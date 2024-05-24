import axios from 'axios'

const inputEmail = document.querySelector(".login-email")
const inputPassword = document.querySelector(".login-password")
const loginButton = document.querySelector(".login-button")

const userInput = {
    email: "",
    password: "",
}


inputEmail.addEventListener("input", (event) => {
    userInput.email = event.target.value
})
inputPassword.addEventListener("input", (event) => {
    userInput.password = event.target.value
})
loginButton.addEventListener("click", async (event) => {
    event.preventDefault();
    fetchUserData(userInput)
})

const fetchUserData = async (userdata) => {
    const fetchData = { "user": { ...userdata } }
    try {
        const response = await axios.post("https://todoo.5xcamp.us/users/sign_in", fetchData);
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

