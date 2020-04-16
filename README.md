## A simple interactive cli todo app pet project

### Ideas and goals

#### Personal learning goals out of the project

1. To experiment and practice working with promises and asynchronous design in general.
2. To pracice on thinking and design in terms of high level abstractions, to exercise separation of concerns and experiment on ways to decouple concrete implentations from client code



#### General ideas

#### Main components 

- Database fascade handles only database related oprations
- ToDoItem abstraction to keep and manipulate states
- ToDoList abstraction to perform bulk operations on ToDoItems
- Prompt utitlity to process command line IO

### Challenges and Issues encountered:

##### Who's responsibility it is to save a todoItem into database?

The initial design was to have a ```save(db)``` method on TodoItem object, such that the TodoItem would use the the 'db' instance passed into it, and call the db's save method ,which updates the corresponding database record.

However, it quickly became apparent that this had been a bad idea.

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

The trouble starts from the db instance sitted inside TodoItem. If the todoItem was to call the db instance, the db instance has to be passed into an todoItem instance in the first place, somehow. But when it should be passed in? And How? How about the constructor?

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

What about using a setter?

```javascript
setDb(db) {
    this.db = db;
}
const todoItem = new TodoItem(newTodoContent, db )
todoList.push(todoItem);
todoList.map(item=>item.setDb(db))
```

That wasnt' much different.

#### The {not perfect} fix and the single responsibility principle

 An abstraction model object does one thing and only one thing - maintain and updates its own states. Therefore, it should not have the knowledge of persistence , neither the associated operations. 

The database facade does one and only one thing - controls the pesistence of states.

It is, naturally the databases's , and not the model's responsibility, to perform actual saving, updating, deteting, archiving etc. states persistence operations

```javascript
const init = async () => {
  db = new DB()
  const data = await db.fetchData()
  todoList = new TodoList(data)
}
```

```javascript
const handleShowTodos = async () => {
  const checkedIdsObj = await prompt.listTodos(todoList.getTodoItems())
  const checkedIds = await checkedIdsObj.todoList;
  await todoList.setChecked(checkedIds)
  await db.updateAll(todoList.getTodoItems())
    .catch(e=>console.log(e))
}
```

The TodoList object takes in an array of json objects with each reprentating a todoItem, in the form of a flattened promise. 

Neither the TodoList nor the TodoItem has knowledge of the db fascade. 

The db object takes in an array of arbitary objects, and perform crud operations based on the object's own properties. 



### Further work

- separate data interface from its concrete implementation, to allow applicaiton to use any datasource without having to change the client code
- To work on implementing an acual local storage adapter class to plug into the existing db class without having to modify client code.
- To allow crud methods of db object taking in options to modify how different objs should be parsed and fields to be used.
- refactor and separate business logic from interface, to allow any type of interface to plug in without having to change business logic. 
- Learn rxjs and obsservables and refactor existing code.



