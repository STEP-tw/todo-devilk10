let Task=require('./task.js');
class Todo {
  constructor(title,description,task={}) {
    this.title=title;
    this.description=description;
    this.task=task;
  }
  getItems() {
    return this.task;
  }
  addItem(item) {
    return this.task[item.caption]=item;
  }
  removeItem(item) {
    delete this.task[item];
  }
  editItem(oldCaption,newCaption) {
    this.removeItem(oldCaption);
    let changedTask= new Task(newCaption);
    this.task[newCaption] = changedTask;
  }
  editTitle(caption) {
    return this.title=caption;
  }
  markTaskDone(item) {
    let task=this.task[item];
    return task.markAsDone();
  }
  markTaskUnDone(item) {
    let task=this.task[item];
    return task.markAsUnDone();
  }
  checkIsDone(item) {
    let task = this.task[item];
    return task.isDone();
  }
}
module.exports=Todo;
