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

//建立 span 標籤
function createElementSpan(className, i_className) {
    const span = document.createElement('span')
    const i = createElement_i(i_className)
    span.classList.add(className)
    span.appendChild(i)
    return span
}

//建立button
function createElementBtn() {
    const btn = document.createElement('button')
    const nocheck_span = createElementSpan("not-check", "fa-regular fa-square")
    const ischeck_span2 = createElementSpan("is-check", "fa-sharp fa-solid fa-check")
    btn.classList.add('list-completed')
    // btn.setAttribute('time-completed', completed_at);  // 將completed_at 設為自定義屬性 
    btn.appendChild(nocheck_span)
    btn.appendChild(ischeck_span2)
    return btn
}

//建立p標籤 ( list 文字內容)
function createElementContent(content = "") {
    const text = document.createElement('p')
    text.classList.add('list-text')
    text.textContent = content
    return text
}

//建立一個div(list-content) 將上述組合起來
function createElementListContent(content) {
    const div = document.createElement('div')
    const btn = createElementBtn()
    const text = createElementContent(content)
    div.classList.add('list-content')
    div.appendChild(btn)
    div.appendChild(text)
    return div
}

//建立刪除btn
function createElementDelBtn() {
    const btn = document.createElement('button')
    const del_i = createElement_i("fa-solid fa-x")
    btn.classList.add('delete-item')
    btn.appendChild(del_i)
    return btn
}

//建立li
function createElementLi(obj) {
    const li = document.createElement('li');
    const li_content = createElementListContent(obj.content);
    const del_btn = createElementDelBtn();
    li.classList.add('todo-list__item')
    li.setAttribute('data-id', obj.id);  // 將id 設為自定義屬性 
    li.setAttribute('time-completed', obj.completed_at);  // 將time 設為自定義屬性 
    fragment.appendChild(li_content)
    fragment.appendChild(del_btn)
    li.appendChild(fragment)
    return li
}