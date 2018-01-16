let Todo=require('./todo.js');
let Task=require('./task.js');
class User {
  constructor(name) {
    this.name=name;
    this.todos={};
  }
  getTodos() {
    return this.todos;
  }
  getTodoTitles(){
    return Object.keys(this.todos);
  }
  getTodoItems(title){
    let todo = this.todos[title];
    if (!todo) return [];
    return todo.getItems();
  }
  addTodoItem(title,task){
    let todo = this.todos[title];
    let newTask = new Task(task);
    return todo.addItem(newTask);
  }
  removeTodoItem(title,task){
    let todo = this.todos[title];
    return todo.removeItem(task);
  }
  editTodoItem(title,oldCaption,newCaption){
    let todo = this.todos[title];
    return todo.editItem(oldCaption,newCaption);
  }
  createTodo(title,description,task={}){
    return this.todos[title]=new Todo(title,description,task);
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
