let Todo = require('../lib/todo.js');
let Task = require('../lib/task.js');
let User = require('../lib/user.js');
let assert = require('chai').assert;

describe('todo',()=>{
  beforeEach(()=>{
    todoList=new Todo('Title','detail');
  });

  it('Should create todo of Title:"title"',()=>{
    assert.equal(todoList.title,'Title');
    assert.equal(todoList.description,'detail');
  });

  it('addItem should add item to todo list',()=>{
    let item = new Task('Type something');
    todoList.addItem(item);
    assert.deepEqual(todoList.task,{"Type something": {"_isDone": false,
      "caption": "Type something"}
    });
  });

  it('getItem should give list of todo task',()=>{
    let item = new Task('Type something');
    todoList.addItem(item);
    let tasks=todoList.getItems();
    let expected={"Type something": {"_isDone": false,
      "caption": "Type something"}};
    assert.deepEqual(tasks,expected);
  })

  it('editItem should delete given item',()=>{
    let item = new Task('Type something');
    todoList.addItem(item);
    todoList.editItem('Type something','Changed task');
    assert.deepEqual(todoList.getItems(),{"Changed task": {"_isDone": false,
      "caption": "Changed task"}
    });
  })

  it('editTitle should edit title of given todo',()=>{
    todoList.editTitle('Changed title');
    assert.deepEqual(todoList.title,'Changed title');
  })

  it('checkIsDone gives false if status is false',()=>{
    let item = new Task('Type something');
    todoList.addItem(item);
    assert.notOk(todoList.checkIsDone(item.caption));
  })

  it('checkIsDone gives true task is completed',()=>{
    let item = new Task('Type something');
    todoList.addItem(item);
    todoList.markTaskDone(item.caption);
    assert.ok(todoList.checkIsDone(item.caption));
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
    let expected = {"This is title": {"title": "This is title","description": "This is description","task": {}}}
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
    user.addTodoItem('Todo','this is task');
    let input = user.getTodoItems('Todo');
    let expected = { 'this is task': { caption: 'this is task', _isDone: false } }
    assert.deepEqual(input,expected);
  })

  it('getTodoItems should give empty list if todo does not exist',()=>{
    assert.deepEqual(user.getTodoItems('Todo'),[]);
  })

  it('getTodoItems should give empty object if tasks are not entered',()=>{
    user.createTodo('Todo','This is description');
    assert.deepEqual(user.getTodoItems('Todo'),{});
  })

  it('addTodoItem should add todo in todo object',()=>{
    user.createTodo('Todo','This is description');
    user.addTodoItem('Todo','this is task');
    assert.notDeepEqual(user.getTodoItems('Todo'),{});
  })

  it('removeTodoItem should remove the given task',()=>{
    user.createTodo('Todo','This is description');
    user.addTodoItem('Todo','this is task');
    user.removeTodoItem('Todo','this is task');
    assert.deepEqual(user.getTodoItems('Todo'),{});
  })

  it('editTodoItem should edit task text',()=>{
    user.createTodo('Todo','This is description');
    user.addTodoItem('Todo','this is task');
    user.editTodoItem('Todo','this is task','same task');
    let expected={"same task": {"caption":"same task","_isDone":false}};
    assert.deepEqual(user.getTodoItems('Todo'),expected);
  })

  it('deleteTodo should delete the given todo',()=>{
    user.createTodo('Todo','This is description');
    user.deleteTodo('Todo');
    assert.deepEqual(user.getTodoTitles(),[]);
  })

  it('editTodoTitle should edit todo title',()=>{
    user.createTodo('Todo','This is description');
    user.editTodoTitle('Todo','This is todo');
    let expected={"This is todo": {"title": "This is todo","description": "This is description","task": {}}}
    assert.deepEqual(user.getTodos(),expected);
  })
})
