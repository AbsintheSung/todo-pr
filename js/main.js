import axios from 'axios'
import Swal from 'sweetalert2'
import createElementLi from "./li_module"
import { handleEdit,handleDelete } from "./swal"
const token = document.cookie.replace(/(?:(?:^|.*;\s*)TokenCode\s*\=\s*([^;]*).*$)|^.*$/, "$1"); //獲取存在cookie的token
const fragment = document.createDocumentFragment()
const todoList = document.querySelector('.todo-list')
const todoListVIew = [] //顯示層
const todoData = []

//根據 dom 上面的 自定義屬性(time-completed)的值，來顯示 框框或是打勾
function setComplete(dom) {
    const completedSpan = dom.querySelector('.is-check');
    const notCompletedSpan = dom.querySelector('.not-check');

    if (dom.getAttribute('time-completed') !== 'null') {
        completedSpan.style.display = 'inline-block';
        notCompletedSpan.style.display = 'none';
    } else {
        completedSpan.style.display = 'none';
        notCompletedSpan.style.display = 'inline-block';
    }
}

//獲取的資料，會先透過其他方式轉成dom元素，並存入todoListView陣列裡，我們再透過此陣列對裡面的dom元素做操作
function mountLiDom() {
    todoListVIew.forEach((item) => {
        setComplete(item) //顯示或隱藏框框或是打勾
        fragment.appendChild(item); //透過虛擬dom，先掛載在虛擬dom上面
    })
    todoList.appendChild(fragment)//一次掛載上去
}

//重製畫面，清空網頁畫面( 移除所有的li dom元素 ) 再透過 todoListVIew 重新渲染(掛載) ，
function resetDom(domfather){
    while(domfather.firstChild){
        domfather.removeChild(domfather.firstChild)
    }
    mountLiDom()
}

//li-dom元素的所有監聽事件
function eventListenerConfig(dom){
    const stateBtn = dom.querySelector('.list-completed');
    const text = dom.querySelector('.list-text');
    const delBtn = dom.querySelector('.delete-item');

    stateBtn.addEventListener('click', async () => {
        const id = dom.getAttribute('data-id');
        const completed_at = await handleComplete(id)
        dom.setAttribute('time-completed', completed_at);
        setComplete(dom)
    });

    text.addEventListener('click', async (event) => {
        const id = dom.getAttribute('data-id');
        const responseValue = await handleEdit(event.target.textContent,id,editApi)
        if(responseValue !=undefined){
            const idIndex = todoData.findIndex((item)=>item.id === id)
            todoData[idIndex].content = responseValue.content
            event.target.textContent = responseValue.content
        }
    });

    delBtn.addEventListener('click', async() => {
        const id = dom.getAttribute('data-id');
        const responseValue = await handleDelete(id,deleteApi)
        if(responseValue===undefined){
            return
        }else if(responseValue.message==='已刪除'){
            const idIndex = todoData.findIndex((item)=>item.id === id)
            todoData.splice(idIndex,1);
            todoListVIew.splice(idIndex,1);
            resetDom(todoList)
        }
    });
}


//將資料，透過 createElementLi 轉成 li dom元素
function pushDataInView(){
    todoData.forEach((item) => {
        let li = createElementLi(item)
        eventListenerConfig(li) //對每一個li-dom元素綁定監聽事件
        todoListVIew.push(li)
    })
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
        const url = `https://todoo.5xcamp.us/todos/${id}/toggle`
        const headers = {
            headers: {
                'Authorization': `${token}`
            }
        }
        const response = await axios.patch(url, {}, headers)
        if (response.status === 200) {
            return response.data.completed_at
        }
    } catch (error) {
        console.log(error)
    }
}

//發送 編輯請求
async function editApi(id,userInput) {
    try {
        const url  =`https://todoo.5xcamp.us/todos/${id}`
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
async function deleteApi(id){
    const url = `https://todoo.5xcamp.us/todos/${id}`
    const headers = {headers: {'Authorization': `${token}`}}
    try {
        const response = await axios.delete(url,headers)
        return response
    } catch (error) {
        console.log(error)
    }  
}



//初始化設定
await getData(todoData)
pushDataInView()
mountLiDom()
