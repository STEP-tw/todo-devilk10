let Todo = require('../lib/todo.js');
let Task = require('../lib/task.js');
let User = require('../lib/user.js');
let assert = require('chai').assert;

describe('todo',()=>{
  beforeEach(()=>{
    todoList=new Todo('Title','detail',0);
  });

  it('Should create todo of Title:"title"',()=>{
    assert.equal(todoList.title,'Title');
    assert.equal(todoList.description,'detail');
  });

  it('addItem should add item to todo list',()=>{
    todoList.addItem('Type something');
    let expected={ '0': {
      caption: 'Type something', _isDone: false }}
    assert.deepEqual(todoList.task,expected);
  });

  it('getItem should give list of todo task',()=>{
    todoList.addItem('Type something');
    let tasks=todoList.getItems();
    let expected={0: {"_isDone": false,
      "caption": "Type something"}};
    assert.deepEqual(tasks,expected);
  })

  it('editItem should delete given item',()=>{
    todoList.addItem('Type something');
    todoList.editItem(0,'Changed task');
    assert.deepEqual(todoList.getItems(),{1: {"_isDone": false,
      "caption": "Changed task"}
    });
  })

  it('editTitle should edit title of given todo',()=>{
    todoList.editTitle('Changed title');
    assert.deepEqual(todoList.title,'Changed title');
  })

  it('checkIsDone gives false if status is false',()=>{
    todoList.addItem('Type something');
    assert.notOk(todoList.checkIsDone(0));
  })

  it('checkIsDone gives true task is completed',()=>{
    todoList.addItem('Type something');
    todoList.markTaskDone(0);
    assert.ok(todoList.checkIsDone(0));
  })
})

describe('task',()=>{
  beforeEach(()=>{
    item = new Task('Do something');
  });

  it('markAsDone should change status true',()=>{
    item.markAsDone();
    assert.ok(item._isDone);
  })

  it('markAsUnDone should change status to false',()=>{
    item.markAsUnDone();
    assert.notOk(item._isDone);
  })

  it('isDone should tell true if status is true',()=>{
    item.markAsDone();
    assert.ok(item.isDone());
  })

  it('isDone should tell false if status is false',()=>{
    assert.notOk(item.isDone());
  })
})

describe('User',()=>{
  beforeEach(()=>{
    user=new User('ketan');
  });

  it('getTodos should give no todos when todos are not added',()=>{
    assert.deepEqual(user.getTodos(),{});
  })

  it('getTodos should give all todos ',()=>{
    user.createTodo('This is title','This is description');
    let expected = {"0": {"title": "This is title","description": "This is description","id": 0,"task": {},"taskTag":0}}
    assert.deepEqual(user.getTodos(),expected);
  })

  it('getTodoTitles should give all titles',()=>{
    user.createTodo('This is title','This is description');
    let expected = ['This is title'];
    assert.deepEqual(user.getTodoTitles(),expected);
  })

  it('getTodoTitles should give empty list if todos are not entered',()=>{
    assert.deepEqual(user.getTodoTitles(),[]);
  })

  it('getTodoItems should give task list',()=>{
    user.createTodo('Todo','This is description');
    user.addTodoItem(0,'this is task');
    let input = user.getTodoItems(0);
    let expected = { 0: { caption: 'this is task', _isDone: false } }
    assert.deepEqual(input,expected);
  })

  it('getTodoItems should give empty list if todo does not exist',()=>{
    assert.deepEqual(user.getTodoItems(1),[]);
  })

  it('getTodoItems should give empty object if tasks are not entered',()=>{
    user.createTodo('Todo','This is description');
    assert.deepEqual(user.getTodoItems(0),{});
  })

  it('addTodoItem should add todo in todo object',()=>{
    user.createTodo('Todo','This is description');
    user.addTodoItem(0,'this is task');
    assert.notDeepEqual(user.getTodoItems(0),{});
  })

  it('removeTodoItem should remove the given task',()=>{
    user.createTodo('Todo','This is description');
    user.addTodoItem(0,'this is task');
    user.removeTodoItem(0,0);
    assert.deepEqual(user.getTodoItems(0),{});
  })

  it('editTodoItem should edit task text',()=>{
    user.createTodo('Todo','This is description');
    user.addTodoItem(0,'this is task');
    user.editTodoItem(0,0,'same task with diff text');
    let expected={1: {"caption":"same task with diff text","_isDone":false}};
    assert.deepEqual(user.getTodoItems(0),expected);
  })

  it('deleteTodo should delete the given todo',()=>{
    user.createTodo('Todo','This is description');
    user.deleteTodo(0);
    assert.deepEqual(user.getTodoTitles(),[]);
  })

  it('editTodoTitle should edit todo title',()=>{
    user.createTodo('Todo','This is description');
    user.editTodoTitle(0,'This is todo');
    let expected={1: {"title": "This is todo","description": "This is description","id": 1,"taskTag":0,"task": {}}}
    assert.deepEqual(user.getTodos(),expected);
  })
})
