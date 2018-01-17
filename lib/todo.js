let Task=require('./task.js');
class Todo {
  constructor(title,description,id,task={}) {
    this.title=title;
    this.description=description;
    this.task=task;
    this.id=id;
    this.taskTag=0;
  }
  getItems() {
    return this.task;
  }
  addItem(item) {
    let task=new Task(item);
    let tag=this.taskTag++;
    return this.task[tag]=task;
  }
  removeItem(id) {
    return delete this.task[id];
  }
  editItem(id,newCaption) {
    this.removeItem(id);
    let changedTask= new Task(newCaption);
    let tag=this.taskTag++;
    return this.task[tag] = changedTask;
  }
  editTitle(caption) {
    return this.title=caption;
  }
  editDescription(detail) {
    return this.description=detail;
  }
  markTaskDone(id) {
    let task=this.task[id];
    return task.markAsDone();
  }
  markTaskUnDone(id) {
    let task=this.task[id];
    return task.markAsUnDone();
  }
  checkIsDone(id) {
    let task = this.task[id];
    if(task) return task.isDone();
  }
}
module.exports=Todo;
