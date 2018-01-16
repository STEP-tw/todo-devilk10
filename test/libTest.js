let TodoHandler = require('../lib/todo.js');
let TaskHandler = require('../lib/task.js');
let assert = require('chai').assert;

describe('todo',()=>{
  beforeEach(()=>{
    todoList=new TodoHandler('Title','detail');
  });

  it('Should create todo of Title:"title"',()=>{
    assert.equal(todoList.title,'Title');
    assert.equal(todoList.description,'detail');
  });

  it('addItem should add item to todo list',()=>{
    let item = new TaskHandler('Type something');
    todoList.addItem(item);
    assert.deepEqual(todoList.task,{"Type something": {"_isDone": false,
      "caption": "Type something"}
    });
  });

  it('getItem should give list of todo task',()=>{
    let item = new TaskHandler('Type something');
    todoList.addItem(item);
    let tasks=todoList.getItems();
    let expected={"Type something": {"_isDone": false,
      "caption": "Type something"}};
    assert.deepEqual(tasks,expected);
  })

  it('editItem should delete given item',()=>{
    let item = new TaskHandler('Type something');
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
})
