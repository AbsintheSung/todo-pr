import{h as z,b as F,l as b,a as d,t as f}from"./swal-BUWR2XwI.js";const y=document.createDocumentFragment();function S(t){const e=document.createElement("i");return t.split(" ").forEach(o=>e.classList.add(o)),e}function A(t,e){const n=document.createElement("span"),o=S(e);return n.classList.add(t),n.appendChild(o),n}function V(){const t=document.createElement("button"),e=A("not-check","fa-regular fa-square"),n=A("is-check","fa-sharp fa-solid fa-check");return t.classList.add("list-completed"),t.appendChild(e),t.appendChild(n),t}function T(t=""){const e=document.createElement("p");return e.classList.add("list-text"),e.textContent=t,e}function N(t){const e=document.createElement("div"),n=V(),o=T(t);return e.classList.add("list-content"),e.appendChild(n),e.appendChild(o),e}function O(){const t=document.createElement("button"),e=S("fa-solid fa-x");return t.classList.add("delete-item"),t.appendChild(e),t}function I(t){const e=document.createElement("li"),n=N(t.content),o=O();return e.classList.add("todo-list__item"),e.setAttribute("data-id",t.id),e.setAttribute("time-completed",t.completed_at),y.appendChild(n),y.appendChild(o),e.appendChild(y),e}const a=document.cookie.replace(/(?:(?:^|.*;\s*)TokenCode\s*\=\s*([^;]*).*$)|^.*$/,"$1"),E=document.createDocumentFragment(),J=document.querySelector(".login-out"),w=document.querySelector(".home-userinput"),M=document.querySelector(".add-listItem"),i=document.querySelector(".todo-list"),U=document.querySelectorAll(".filter-btn"),C=document.querySelector(".list-info"),G=document.querySelector(".nav-user"),L=document.querySelector(".notData"),$=document.querySelector(".filter-button"),h=Array.from(U),c=[],l=[];function q(t){const e=t.querySelector(".is-check"),n=t.querySelector(".not-check");t.getAttribute("time-completed")!=="null"?(e.style.display="inline-block",n.style.display="none"):(e.style.display="none",n.style.display="inline-block")}function D(t,e){e.forEach(n=>{q(n),E.appendChild(n)}),t.appendChild(E)}function p(t,e){for(;t.firstChild;)t.removeChild(t.firstChild);D(t,e)}function v(t){const e=t.querySelector(".list-completed"),n=t.querySelector(".list-text"),o=t.querySelector(".delete-item");e.addEventListener("click",async()=>{const s=t.getAttribute("data-id"),r=await R(s);t.setAttribute("time-completed",r),q(t),k()}),n.addEventListener("click",async s=>{const r=t.getAttribute("data-id"),u=await z(s.target.textContent,r,W);if(u!=null){const m=l.findIndex(B=>B.id===r);l[m].content=u.content,s.target.textContent=u.content}}),o.addEventListener("click",async()=>{const s=t.getAttribute("data-id"),r=await F(s,X);if(r!==void 0&&r.message==="已刪除"){const u=l.findIndex(m=>m.id===s);l.splice(u,1),c.splice(u,1),p(i,c),k(),x()}})}function H(){l.forEach(t=>{let e=I(t);v(e),c.push(e)})}function K(){return c.filter(e=>e.getAttribute("time-completed")!=="null")}function _(){return c.filter(e=>e.getAttribute("time-completed")==="null")}function k(){let t=_();C.textContent=`${t.length} 個待完成`}function g(){h.forEach(t=>t.style.borderBottom="2px solid #EFEFEF")}function P(){const t=h.findIndex(e=>e.getAttribute("data-filter")==="全部");h[t].style.borderColor="black"}function x(){c.length===0?(L.style.display="block",$.style.display="none",i.style.display="none",C.style.display="none"):($.style.display="flex",i.style.display="block",C.style.display="block",L.style.display="none")}async function Q(t){try{const e="https://todoo.5xcamp.us/todos",n={headers:{Authorization:`${a}`}};(await d.get(e,n)).data.todos.forEach(s=>t.push(s))}catch(e){console.log(e)}}async function R(t){try{b("更改中");const e=`https://todoo.5xcamp.us/todos/${t}/toggle`,n={headers:{Authorization:`${a}`}},o=await d.patch(e,{},n);if(o.status===200)return f("success","更改成功"),o.data.completed_at}catch{f("error","更改失敗")}}async function W(t,e){try{const n=`https://todoo.5xcamp.us/todos/${t}`,o={todo:{content:`${e}`}},s={headers:{Authorization:`${a}`}};return await d.patch(n,o,s)}catch(n){return n.response}}async function X(t){const e=`https://todoo.5xcamp.us/todos/${t}`,n={headers:{Authorization:`${a}`}};try{return await d.delete(e,n)}catch(o){return o.response}}async function Y(){b("登出中");const t="https://todoo.5xcamp.us/users/sign_out",e={headers:{Authorization:`${a}`}};try{const n=await d.delete(t,e);console.log(n),n.status===200&&(f("success","登出成功"),sessionStorage.removeItem(`nickname${a}`),document.cookie=`TokenCode=${a}; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`,window.location.href="/todo-pr/pages/index")}catch{}}const Z=async()=>{const t=document.cookie.replace(/(?:(?:^|.*;\s*)TokenCode\s*\=\s*([^;]*).*$)|^.*$/,"$1");try{if((await d.get("https://todoo.5xcamp.us/check",{headers:{Authorization:t}})).status===200){const n=sessionStorage.getItem(`nickname${t}`);G.textContent=`${n}的代辦`;return}}catch(e){e&&(window.location.href="/todo-pr/pages/index")}};async function j(t){const e="https://todoo.5xcamp.us/todos",n={todo:{content:`${t}`}},o={headers:{Authorization:`${a}`}};b("新增中");try{const s=await d.post(e,n,o);if(s.status===201)return f("success","更改成功"),s.data}catch(s){f("error","新增失敗"),console.log(s)}}M.addEventListener("click",async()=>{const e={...await j(w.value),completed_at:null},n=I(e);v(n),l.unshift(e),c.unshift(n),w.value="",p(i,c),x()});J.addEventListener("click",async()=>{await Y()});h.forEach(t=>{t.addEventListener("click",()=>{const e=t.getAttribute("data-filter");if(e==="全部"&&(p(i,c),g(),t.style.borderColor="black"),e==="待完成"){const n=_();p(i,n),g(),t.style.borderColor="black"}if(e==="已完成"){const n=K();p(i,n),g(),t.style.borderColor="black"}})});async function tt(){await Z(),await Q(l),H(),D(i,c),k(),x(),P()}tt();
