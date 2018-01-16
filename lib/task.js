class Task {
  constructor(caption) {
    this.caption=caption;
    this._isDone=false;
  }
  isDone(){
    return this._isDone;
  }
  markAsDone(){
    return this._isDone=true;
  }
  markAsUnDone(){
    return this._isDone=false;
  }
}
module.exports=Task;
