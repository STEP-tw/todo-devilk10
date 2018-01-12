let fs = require('fs');
const http = require('http');
const WebApp = require('./webapp');
let registered_users = [{userName:'k',name:'chetan sangle'},{userName:'a',name:'ketan sangle'}];
let toS = o=>JSON.stringify(o,null,2);
let userDB = require('./data/userDB.json');
let displayForm=fs.readFileSync("public/editTodo.html","utf-8");

let getFileContents = function(filename, res) {
  let defaultDir='./public';
  let filePath = defaultDir + filename;
  if (fs.existsSync(filePath))
    return fs.readFileSync(filePath);
};
let updateDB = function () {
  fs.writeFile("./data/userDB.json", JSON.stringify(userDB,null,2),
  function(err) {if (err) return;
    });
}

let getUserToDoLists = function (user) {
  return showTodoTitle(userDB[0][user].todo);
};
let showTodoTitle = function (todoList) {
  let titles='';
  let id=0;
  todoList.forEach(function (todo) {
    titles+=`<a href="${id}">${todo.name}</a><br>`;
    id++;
  });
  return titles;
}
let respondedTodo = function (id,todo,res) {
  let items='';
  todo.contents.forEach(function (item) {
    items+=`<b>${item.name}</b><br>`;
  });
  res.setHeader('Content-type','text/html');
  res.write('<a href="logout">Log out</a><br><a href="/home.html">HOME</a><br>');
  res.write(`<a href="editTodo/${id}">Edit Todo</a><br>`);
  res.write(`<a href="deleteTodo/${id}">Delete Todo</a><br>`);
  res.write(`<h2>${todo.name}</h2><h5>${todo.description}</h5>${items}`);
  res.end();
}
let saveTodo = function (req,user) {
  let dataToPush={};
  let todoTable=userDB[0][user].todo;
  dataToPush.name=req.body.title.replace(/\+/g,' ');
  dataToPush.description=req.body.description.replace(/\+/g,' ');
  dataToPush.contents=[];
  dataToPush=prepareDataObject(dataToPush,req.body.items);
  if (req.body.id)
    todoTable[req.body.id]=dataToPush;
  else
    todoTable.push(dataToPush);
    updateDB();
};
let prepareDataObject = function (dataToPush,items) {
  let list=items.split('%0D%0A');
  list.forEach(function (item) {
    let id=0;
    dataToPush.contents.push(
      {
        id : id,
        name: item,
        status: true
      }
    );
    id++;
  });
  return dataToPush
}

let getTodoContent = function (req,id) {
  let name=req.user.userName;
  return userDB[0][name].todo[id];
}
let showEditableContents = function (todo,res,id) {
  text=displayForm.replace('"title" value=""',`"title" value="${todo.name}"`);
  text=text.replace('"description" value=""',`"description" value="${todo.description}"`);
  let items='';
  todo.contents.forEach(function (item) {
    items+=`${item.name}\n`;
  });
  text=text.replace('showItems',`${items}`);
  text=text.replace('idval',`${id}`);
  res.write(text);
  res.end();
}

let editTodo = (id,req,res) => {
  let todoToShow=getTodoContent(req,id);
  showEditableContents(todoToShow,res,id);
}
let deleteTodo = (id,req,res) => {
  let name=req.user.userName;
  let array=userDB[0][name].todo;
  let element=userDB[0][name].todo[id];
  remove(array,element,id);
  updateDB();
  res.redirect('/home.html');
};
let remove = function (array, element,id) {
  return array.splice(id, 1);
};
let getSpecificTodo = (id,req,res) =>{
  let todoToShow=getTodoContent(req,id);
  respondedTodo(id,todoToShow,res);
}

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
  saveTodo(req,req.user.userName);
  res.redirect('/addTodo.html');
});
app.postUse(getSpecificTodo);
app.postUse(serveFile);
app.postUse(editTodo);
app.postUse(deleteTodo);

const PORT = 5000;
let server = http.createServer(app);
server.on('error',e=>console.error('**error**',e.message));
server.listen(PORT,(e)=>console.log(`server listening at ${PORT}`));
