import axios from 'axios'
import Swal from 'sweetalert2'
import createElementLi from "./li_module"
import { handleEdit,handleDelete } from "./swal"
const token = document.cookie.replace(/(?:(?:^|.*;\s*)TokenCode\s*\=\s*([^;]*).*$)|^.*$/, "$1"); //獲取存在cookie的token
const fragment = document.createDocumentFragment()
const todoList = document.querySelector('.todo-list')
const todoListVIew = [] //顯示層
const todoData = []


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

function mountLiDom() {
    todoData.forEach((item) => {
        let li = createElementLi(item)
        todoListVIew.push(li)
    })
    todoListVIew.forEach((item) => {
        setComplete(item)
        fragment.appendChild(item);
    })
    todoList.appendChild(fragment)
}




await getData(todoData)
mountLiDom()
todoListVIew.forEach((item) => {
    const stateBtn = item.querySelector('.list-completed');
    const text = item.querySelector('.list-text');
    const delBtn = item.querySelector('.delete-item');

    stateBtn.addEventListener('click', async () => {
        const id = item.getAttribute('data-id');
        const completed_at = await handleComplete(id)
        item.setAttribute('time-completed', completed_at);
        setComplete(item)
    });

    text.addEventListener('click', async (event) => {
        const id = item.getAttribute('data-id');
        const responseValue = await handleEdit(event.target.textContent,id,editApi)
        if(responseValue !=undefined){
            const idIndex = todoData.findIndex((item)=>item.id === id)
            todoData[idIndex].content = responseValue.content
            event.target.textContent = responseValue.content
        }
    });

    delBtn.addEventListener('click', () => {
        const id = item.getAttribute('data-id');
        console.log('Delete button clicked, id:', id);
    });
})