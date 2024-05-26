import axios from 'axios'

const fragment = document.createDocumentFragment()
const todoList = document.querySelector('.todo-list')
const todoListVIew = [] //顯示層
const data = {
    "todos": [
        {
            "id": "0c9ab10bf00e898a59ffad56809efa4c",
            "content": "我在修改",
            "completed_at": null
        },
        {
            "id": "500b2274efa17e6914c95eedc440878b",
            "content": "我在新增2",
            "completed_at": "2024-05-26T12:43:36.544+08:00"
        }
    ]
};

//建立 i 標籤
function createElement_i(className) {
    const i = document.createElement('i')
    const name = className.split(' ')
    name.forEach((item) => i.classList.add(item))
    return i
}

