## A simple interactive cli todo app pet project

### Ideas and goals

#### Goals

1. To experiment and practice working with promises
2. To pracice on thinking and design in terms of high level abstractions, separation of concerns and ways to decouple concrete implentations from client.



#### General ideas

#### Main components 

- Database object handles only database related oprations

- ToDoItem abstraction to keep and manipulate states

- ToDoList abstraction to perform bulk operations on ToDoItems

- Prompt to process command line IO

  

### Challenges and Issues encountered:

##### Who's responsibility it is to save a todoItem into database?

The initial design was to have a ```save(db)``` method on TodoItem object, such that the TodoItem would use the the 'db' instance passed into it, and call the db's save method and update the corresponding record.

However, it became apparent that this had been a bad idea

```javascript
Index.js
=========
const init = async () => {
  const db = new DB()
  todoList = new TodoList(db)
}

ToDoList.js
===========
class TodoList {
constructor(dataSource) {
    this.dataSource = dataSource
 }

async getTodoItems() {
    const data = await this._getData();
    return this.deSerializeJson(data)
}
  
async _getData () {
    return this.dataSource
      .fetchToDoData()
      .catch(e=>console.error(e))
 }
  
async deSerializeJson(arr) {
    const todoItems = arr.map(rawObj=> {
      return Object.create(
        TodoItem.prototype,
        Object.getOwnPropertyDescriptors(rawObj)
      )})
    return todoItems
  }
}

ToDoItem
========
class TodoItem {
  static _numInstances = 0;
	/*
	constructor(content,db){
    this.db = db;
  }
  */
  constructor(content) {
    this._id = 0
    this.title = content;
    this.created_at = new Date();
    this.is_done = false;
  }
	
/*
	setDb(db) {
    this.db = db;
  }
*/
	update([fields, newValues]) {
    this.db.update(fields,newValues)
  }

	toJSON
}
```

##### The obvious problem

The trouble comes with the db instance sitted inside TodoItem, if it is going to call on the db instance, the db instance has to be passed in somehow. But where to pass that in? How about the constructor?

```javascript
	constructor(content,db){
	  this._id = 0
    this.title = content;
    this.created_at = new Date();
    this.is_done = false;
    this.db = db;
  }
```

This would mean that whenever user adds a new TodoItem, the db instance has to be passed in as together, like this.

```javascript
db = new DB()
const newTodoContent = getUserInput()
const todoItem = new TodoItem(newTodoContent, db )
```

Then how about using a setter instead?

```javascript
setDb(db) {
    this.db = db;
}
const todoItem = new TodoItem(newTodoContent, db )
todoList.push(todoItem);
todoList.map(item=>item.setDb(db))
```

That wasnt' much different.



### Further work

- separate data interface from its concrete implementation, to allow applicaiton to use any datasource without having to change the client code
- refactor and separate business logic from interface, to allow any type of interface to plug in without having to change business logic. 
- Learn rxjs and obsservables

1

