let DefaultHandler=require('./default_handler.js');
class CompositeHandler extends DefaultHandler {
  constructor() {
    super();
    this.handlers=[];
  }
  addHandler(handler){
    return this.handlers.push(handler);
  }
  execute(req,res){
    let i=0;
    while (!res.finished && i<this.handlers.length) {
      this.handlers[i].execute(req,res);
      i++;
    }
  }
}
module.exports=CompositeHandler;
