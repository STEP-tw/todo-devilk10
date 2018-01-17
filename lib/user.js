let Todo=require('./todo.js');
let Task=require('./task.js');
class User {
  constructor(name) {
    this.name=name;
    this.todos={};
    this.id=0;
  }
  getTodos() {
    return this.todos;
  }
  getTodoTitles(){
    let todos = Object.values(this.todos)
    return todos.map(function (todo) {
      return todo.title;
    });
  }
  getTodoItems(id){
    let todo = this.todos[id];
    if (!todo) return [];
    return todo.getItems();
  }
  addTodoItem(id,tag){
    let todo = this.todos[id];
    return todo.addItem(tag);
  }
  removeTodoItem(id,tag){
    let todo = this.todos[id];
    return todo.removeItem(tag);
  }
  editTodoItem(id,tag,newCaption){
    let todo = this.todos[id];
    return todo.editItem(tag,newCaption);
  }
  createTodo(title,description,task={}){
    let id=this.id++;
    return this.todos[id]=new Todo(title,description,id,task);
  }
  deleteTodo(todo){
    delete this.todos[todo];
  }
  editTodoTitle(title,newTitle){
    let todo=this.todos[title];
    let detail=todo.description;
    let tasks=todo.task;
    this.deleteTodo(title);
    return this.createTodo(newTitle,detail,tasks);
  }
}
module.exports=User;
