let fs = require('fs');
const WebApp = require('./webapp');
let registered_users = [{userName:'chetan',name:'chetan sangle'},{userName:'ketan',name:'ketan sangle'}];
let StaticFileHandler=require('./custom_handlers/static_file_handler.js');
let CompositeHandler=require('./custom_handlers/composite_handler.js');

let fileHandler = new StaticFileHandler("public");
let allHandler = new CompositeHandler();
allHandler.addHandler(fileHandler);
let loadUser = (req,res)=>{
  let sessionid = req.cookies.sessionid;
  let user = registered_users.find(u=>u.sessionid==sessionid);
  if(sessionid && user){
    req.user = user;
  }
};
let redirectLoggedInUserToHome = (req,res)=>{
  if(req.urlIsOneOf(['/login','/']) && req.user) res.redirect('/home.html')
}
let redirectLoggedOutUserToLogin = (req,res)=>{
  if(req.urlIsOneOf(['/logout','/']) && !req.user) res.redirect('/login');
}

let app = WebApp.create();
app.use(allHandler.requestHandler())
app.use(loadUser);
app.use(redirectLoggedInUserToHome);
app.use(redirectLoggedOutUserToLogin);
app.get('/login',(req,res)=>{
  res.setHeader('Content-type','text/html');
  res.write('<form method="POST"> <input name="userName"><input name="place"> <input type="submit"></form>');
  res.end();
});
app.post('/login',(req,res)=>{
  let user = registered_users.find(u=>u.userName==req.body.userName);
  if(!user) {
    res.setHeader('Set-Cookie',`logInFailed=true`);
    res.redirect('/login');
    return;
  }
  let sessionid = new Date().getTime();
  res.setHeader('Set-Cookie',`sessionid=${sessionid}`);
  user.sessionid = sessionid;
  res.redirect('/home.html');
});
app.get('/logout',(req,res)=>{
  res.setHeader('Set-Cookie',[`loginFailed=false,Expires=${new Date(1).toUTCString()}`,`sessionid=0,Expires=${new Date(1).toUTCString()}`]);
  delete req.user.sessionid;
  res.redirect('/login');
});

module.exports = app;
