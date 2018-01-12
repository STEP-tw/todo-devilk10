let fs = require('fs');
const http = require('http');
const WebApp = require('./webapp');
let registered_users = [{userName:'k',name:'chetan sangle'},{userName:'a',name:'ketan sangle'}];
let toS = o=>JSON.stringify(o,null,2);
let userDB = require('./data/userDB.json');
let getFileContents = function(filename, res) {
  let defaultDir='./public';
  let filePath = defaultDir + filename;
  if (fs.existsSync(filePath))
    return fs.readFileSync(filePath);
};


const getUserToDoLists = function (user) {
  return showTodoTitle(userDB[0][user].todo);
};

const showTodoTitle = function (todoList) {
  let titles='';
  let id=0;
  todoList.forEach(function (todo) {
    titles+=`<a href="${id}">${todo.name}</a><br>`;
    id++;
  });
  return titles;
}

const getSpecificTodo = (number,req,res) =>{
  let name=req.user.userName;
  let todoToShow=userDB[0][name].todo[number];
  respondedTodo(todoToShow,res);
}

const respondedTodo = function (todo,res) {
  let items='';
  todo.contents.forEach(function (item) {
    items+=`<b>${item.name}</b>`;
  });
  res.setHeader('Content-type','text/html');
  res.write('<a href="logout">Log out</a><br><a href="/home.html">HOME</a><br>')
  res.write(`<h2>${todo.name}</h2><h5>${todo.description}</h5>${items}`);
  res.end();
}

const displayComments = function () {
  let comments = '';
  commentsFile.forEach(function (comment) {
    comments+=`<p class="comments">${comment.date}, Name: ${comment.name},
    comment: ${comment.comment}</p>`
  });
  return comments;
};

let recordComment = function (req) {
  req.body.date=new Date().toLocaleString();
  req.body.name=req.user.userName;
  req.body.comment=req.body.comment.replace(/\+/g,' ');
  commentsFile.unshift(req.body);
  fs.writeFile("./data/comments.json", JSON.stringify(commentsFile,null,2), function(err) {
    if (err) return;
  });
};

let logRequest = (req,res)=>{
  let text = ['------------------------------',
    `${req.method} ${req.url}`,
    `HEADERS=> ${toS(req.headers)}`,
    `COOKIES=> ${toS(req.cookies)}`,
    `BODY=> ${toS(req.body)}`,''].join('\n');
  fs.appendFile('request.log',text,()=>{});
  console.log(`${req.method} ${req.url}`);
}
let loadUser = (req,res)=>{
  let sessionid = req.cookies.sessionid;
  let user = registered_users.find(u=>u.sessionid==sessionid);
  if(sessionid && user){
    req.user = user;
  }
};
let redirectLoggedInUserToHome = (req,res)=>{
  if(req.urlIsOneOf(['/','/login']) && req.user) res.redirect('/home.html')
}
let redirectLoggedOutUserToLogin = (req,res)=>{
  if(req.urlIsOneOf(['/','/logout','/home.html','/addTodo','/viewTodo.html','/addTodo.html']) && !req.user) res.redirect('/login');
}

let serveFile = (url,req,res)=>{
  let contents = getFileContents(url);
  if (contents)
    res.write(contents);
  else
    handleUnsupportedURL(res);
  res.end();
};
let handleUnsupportedURL = function (res) {
  res.statusCode = 404;
  res.write("page not found");
};

let app = WebApp.create();
app.use(logRequest);
app.use(loadUser);
app.use(redirectLoggedInUserToHome);
app.use(redirectLoggedOutUserToLogin);
app.get('/login',(req,res)=>{
  res.setHeader('Content-type','text/html');
  res.write('<form method="POST"> <input name="userName"> <input type="submit"></form>');
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
app.get('/viewTodo.html',(req,res)=>{
  contents = getFileContents('/viewTodo.html');
  userTodo = getUserToDoLists(req.user.userName);
  res.write(contents+userTodo);
  res.end();
});
app.post('/addTodo',(req,res)=>{
  recordComment(req);
  res.redirect('/userBook.html');
});
app.postUse(getSpecificTodo);
app.postUse(serveFile);


const PORT = 5000;
let server = http.createServer(app);
server.on('error',e=>console.error('**error**',e.message));
server.listen(PORT,(e)=>console.log(`server listening at ${PORT}`));
