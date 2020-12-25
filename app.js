
const todoList = document.getElementById('todo-list');
const form = document.getElementById('add-todo-form');
const updateBtn = document.getElementById('updateBtn');
const updateValue = document.getElementById('updateValue');
const logo = document.querySelector('.logo');
let updateId = null;
let newTitle;

function renderList(doc){
    let li = document.createElement('li');
    li.className = "collection-item";
    li.setAttribute('data-id',doc.id);
    let div = document.createElement('div');
    let span = document.createElement('span');
    span.textContent = doc.data().title;
    let anchor = document.createElement('a');
    anchor.href = "#modal-edit";
    anchor.className = "modal-trigger secondary-content";
    let editBtn = document.createElement('i');
    editBtn.className="material-icons";
    editBtn.innerText = "edit";
    let deleteBtn = document.createElement('i');
    deleteBtn.className="material-icons secondary-content";
    deleteBtn.innerText = 'delete';
    anchor.appendChild(editBtn);
    div.appendChild(span);
    div.appendChild(deleteBtn);
    div.appendChild(anchor);
    li.appendChild(div);
    deleteBtn.addEventListener('click',(e)=>{
        // console.log(e.target); jo element hoga use target krega pura ka pura
        let id = e.target.parentElement.parentElement.getAttribute('data-id');
        db.collection('todos').doc(id).delete();
    })
    
    editBtn.addEventListener('click',(e)=>{
        // console.log('edit');
        // we will get update id by this method
        updateId = e.target.parentElement.parentElement.parentElement.getAttribute(['data-id']);
        console.log(updateId);
    })
    
    todoList.appendChild(li);
}
form.addEventListener('submit',e =>{
    e.preventDefault();
    // console.log(form.title.value);
   if(form.title.value != ''){ 
       db.collection('todos').add({
        title: form.title.value
    });
}
else{
    alert('Please Enter some Task');
}
    form.title.value = '';
})

updateBtn.addEventListener('click',(e)=>{
    newTitle = updateValue.value; //or we can use newTitle = document.getElementByName('newTitle)[0].value
    db.collection('todos').doc(updateId).update({ // update id will have to find 
        title:newTitle
    })
    console.log(newTitle);

})

    

db.collection('todos').orderBy('title').onSnapshot(
    snapshot =>{
        let changes = snapshot.docChanges()
        // console.log(changes);
        changes.forEach(change => {
            if(change.type ==='added')
            {
                renderList(change.doc);
                // console.log(change.doc.data());
            }
            else if(change.type == 'removed'){
                let li = todoList.querySelector(`[data-id="${change.doc.id}"]`);
                todoList.removeChild(li)
                // console.log('removed');
            }
            else if(change.type === 'modified'){
                let li = todoList.querySelector(`[data-id="${change.doc.id}"]`);
                li.getElementsByTagName('span')[0].textContent = newTitle;
                // console.log(newTitle);
                newTitle = '';
            }
        });
    }
)
