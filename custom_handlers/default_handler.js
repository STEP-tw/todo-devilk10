class DefaultHandler {
  constructor() {
  }
  execute(){}
  requestHandler(req,res){
    return this.execute.bind(this);
  }
}
module.exports=DefaultHandler;
