import axios from 'axios'
import Swal from 'sweetalert2'
import createElementLi from "./li_module"
import { handleEdit, handleDelete, loading, statusAlert, toast } from "./swal"
const token = document.cookie.replace(/(?:(?:^|.*;\s*)TokenCode\s*\=\s*([^;]*).*$)|^.*$/, "$1"); //獲取存在cookie的token
const fragment = document.createDocumentFragment()
const userLoginOut = document.querySelector('.login-out')
const userInputList = document.querySelector('.home-userinput')
const addListBtn = document.querySelector('.add-listItem')
const todoList = document.querySelector('.todo-list')
const filterBtn = document.querySelectorAll('.filter-btn')
const listInfo = document.querySelector('.list-info')
const userName = document.querySelector(".nav-user")
const notDataView = document.querySelector('.notData')
const btnBox = document.querySelector('.filter-button')
const mainFooter = document.querySelector('.main-footer')
const filterBtnView = Array.from(filterBtn)
const todoListVIew = [] //顯示層
const todoData = []

//根據 dom 上面的 自定義屬性(time-completed)的值，來顯示 框框或是打勾
function setComplete(dom) {
    const isComplete = dom.getAttribute('time-completed') !== 'null'
    const completedSpan = dom.querySelector('.is-check');
    const notCompletedSpan = dom.querySelector('.not-check');

    completedSpan.style.display = isComplete ? 'inline-block' : 'none'
    notCompletedSpan.style.display = isComplete ? 'none' : 'inline-block'
}

//獲取的資料，會先透過其他方式轉成dom元素，並存入todoListView陣列裡，我們再透過此陣列對裡面的dom元素做操作
function mountLiDom(parentElement, listView) {
    listView.forEach((item) => {
        setComplete(item) //顯示或隱藏框框或是打勾
        fragment.appendChild(item); //透過虛擬dom，先掛載在虛擬dom上面
    })
    parentElement.appendChild(fragment)//一次掛載上去
}

//重製畫面，清空網頁畫面( 移除所有的li dom元素 ) 再透過 todoListVIew 重新渲染(掛載) ，
function resetDom(parentElement, listView) {
    while (parentElement.firstChild) {
        parentElement.removeChild(parentElement.firstChild)
    }
    mountLiDom(parentElement, listView)
}

//li-dom元素的所有監聽事件
function eventListenerConfig(dom) {
    const stateBtn = dom.querySelector('.list-completed');
    const text = dom.querySelector('.list-text');
    const delBtn = dom.querySelector('.delete-item');

    stateBtn.addEventListener('click', async () => {
        const id = dom.getAttribute('data-id');
        const completed_at = await handleComplete(id)
        dom.setAttribute('time-completed', completed_at);
        setComplete(dom)
        listInfoMessage()
    });

    text.addEventListener('click', async (event) => {
        const id = dom.getAttribute('data-id');
        const responseValue = await handleEdit(event.target.textContent, id, editApi)
        if (responseValue != undefined) {
            const idIndex = todoData.findIndex((item) => item.id === id)
            todoData[idIndex].content = responseValue.content
            event.target.textContent = responseValue.content
        }
    });

    delBtn.addEventListener('click', async () => {
        const id = dom.getAttribute('data-id');
        const responseValue = await handleDelete(id, deleteApi)
        if (responseValue === undefined) {
            return
        } else if (responseValue.message === '已刪除') {
            const idIndex = todoData.findIndex((item) => item.id === id)
            todoData.splice(idIndex, 1);
            todoListVIew.splice(idIndex, 1);
            resetDom(todoList, todoListVIew)
            listInfoMessage()
            isDataView()
        }
    });
}


//將資料，透過 createElementLi 轉成 li dom元素
function pushDataInView() {
    todoData.forEach((item) => {
        let li = createElementLi(item)
        eventListenerConfig(li) //對每一個li-dom元素綁定監聽事件
        todoListVIew.push(li)
    })
}

//篩選 time-completed !== null 的 li元素
function filterIsComplete() {
    const filterArr = todoListVIew.filter((dom) => {
        return dom.getAttribute('time-completed') !== 'null';
    })
    return filterArr
}

//篩選 time-completed === null 的 li元素
function filterNotComplete() {
    const filterArr = todoListVIew.filter((dom) => {
        return dom.getAttribute('time-completed') === 'null';
    })
    return filterArr
}

// 顯示 左下待完成樣式
function listInfoMessage() {
    let filterList = filterNotComplete()
    listInfo.textContent = `${filterList.length} 個待完成`
}

//重製 篩選按鈕 樣式顯示
function resetFilterBtnStyle() {
    filterBtnView.forEach(item => item.style.borderBottom = '2px solid #EFEFEF')
}
//初始化 篩選按鈕顯示
function ininFilterBtn() {
    const Index = filterBtnView.findIndex((dom) => dom.getAttribute('data-filter') === "全部")
    filterBtnView[Index].style.borderColor = 'black'
}

//判斷是否顯示 無代辦事項畫面
function isDataView() {
    if (todoListVIew.length === 0) {
        notDataView.style.display = 'block'
        btnBox.style.display = "none";
        todoList.style.display = 'none';
        listInfo.style.display = "none"
        mainFooter.style.display = "none"
    } else {
        btnBox.style.display = "flex";
        todoList.style.display = 'block';
        listInfo.style.display = 'block'
        notDataView.style.display = 'none'
        mainFooter.style.display = "block"
    }
}



//遠端取得資料，並存放自本地端 ( todoData )
async function getData(dataArray) {
    try {
        const url = `https://todoo.5xcamp.us/todos`
        const headers = {
            headers: {
                'Authorization': `${token}`,
            }
        }
        const response = await axios.get(url, headers)
        response.data.todos.forEach(item => dataArray.push(item))
    } catch (error) {
        console.log(error)
    }
}

//更改資料狀態( 完成 或是 未完成 )
async function handleComplete(id) {
    try {
        loading("更改中")
        const url = `https://todoo.5xcamp.us/todos/${id}/toggle`
        const headers = {
            headers: {
                'Authorization': `${token}`
            }
        }
        const response = await axios.patch(url, {}, headers)
        if (response.status === 200) {
            toast('success', '更改成功')
            return response.data.completed_at
        }
    } catch (error) {
        // console.log(error)
        toast('error', '更改失敗')
    }
}

//發送 編輯請求
async function editApi(id, userInput) {
    try {
        const url = `https://todoo.5xcamp.us/todos/${id}`
        const data = {
            "todo": {
                "content": `${userInput}`
            }
        }
        const headers = {
            headers: {
                'Authorization': `${token}`
            }
        }
        const response = await axios.patch(url, data, headers)
        return response

    } catch (error) {
        return error.response
    }
}

//發送刪除請求
async function deleteApi(id) {
    const url = `https://todoo.5xcamp.us/todos/${id}`
    const headers = { headers: { 'Authorization': `${token}` } }
    try {
        const response = await axios.delete(url, headers)
        return response
    } catch (error) {
        return error.response
    }
}

//發送登出API
async function loginOut() {
    loading('登出中')
    const url = `https://todoo.5xcamp.us/users/sign_out`
    const headers = { headers: { 'Authorization': `${token}` } }
    try {
        const response = await axios.delete(url, headers)
        console.log(response)
        if (response.status === 200) {
            toast('success', '登出成功')
            sessionStorage.removeItem(`nickname${token}`);
            document.cookie = `TokenCode=${token}; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
            window.location.href = './index'
        }
    } catch (error) {
        // console.log(error)
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
        if (response.status === 200) {
            const storedNickname = sessionStorage.getItem(`nickname${token}`);
            userName.textContent = `${storedNickname}的代辦`
            return
        }
    } catch (error) {
        if (error) {
            window.location.href = './index'
        }
    }
}


//新增list 請求
async function addList(userInput) {
    const url = `https://todoo.5xcamp.us/todos`
    const data = {
        "todo": {
            "content": `${userInput}`
        }
    }
    const headers = { headers: { 'Authorization': `${token}` } }
    loading('新增中')
    try {
        const response = await axios.post(url, data, headers)
        if (response.status === 201) {
            toast('success', '更改成功')
            return response.data
        }
    } catch (error) {
        toast('error', '新增失敗')
        console.log(error)
    }
}


addListBtn.addEventListener('click', async () => {
    const liData = await addList(userInputList.value)
    const data = { ...liData, "completed_at": null }
    const li = createElementLi(data)
    eventListenerConfig(li) //對每一個li-dom元素綁定監聽事件
    todoData.unshift(data)
    todoListVIew.unshift(li)
    userInputList.value = ''
    resetDom(todoList, todoListVIew)
    isDataView()
})
userLoginOut.addEventListener('click', async () => {
    await loginOut()
})

filterBtnView.forEach((item) => {
    item.addEventListener('click', () => {
        const filterId = item.getAttribute('data-filter');
        if (filterId === "全部") {
            resetDom(todoList, todoListVIew)
            resetFilterBtnStyle()
            item.style.borderColor = 'black'
        }
        if (filterId === "待完成") {
            const notCompleteArray = filterNotComplete()
            resetDom(todoList, notCompleteArray)
            resetFilterBtnStyle()
            item.style.borderColor = 'black'
        }
        if (filterId === "已完成") {
            const isCompleteArray = filterIsComplete()
            resetDom(todoList, isCompleteArray)
            resetFilterBtnStyle()
            item.style.borderColor = 'black'
        }
    })
})



//初始化設定
async function init() {
    await checkToken()
    await getData(todoData)
    pushDataInView()
    mountLiDom(todoList, todoListVIew)
    listInfoMessage()
    isDataView()
    ininFilterBtn()
}

init()