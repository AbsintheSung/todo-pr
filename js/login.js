import axios from 'axios'

const inputEmail = document.querySelector(".login-email")
const inputPassword = document.querySelector(".login-password")
const loginButton = document.querySelector(".login-button")

const userInput = {
    userEmail: "",
    userPassword: "",
}


inputEmail.addEventListener("input", (event) => {
    userInput.userEmail = event.target.value
})
inputPassword.addEventListener("input", (event) => {
    userInput.userPassword = event.target.value
})
loginButton.addEventListener("click", async (event) => {
    event.preventDefault();
    console.log(userInput.userEmail, userInput.userPassword)
})

