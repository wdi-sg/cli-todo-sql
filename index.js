let numOfToDoItems;
let itemFound = false;

//Configuration
const pg = require('pg');

const configs = {
    user: 'postgres',
    password: 'postgres',
    host: '127.0.0.1',
    database: 'todo',
    port: 5432,
};

const client = new pg.Client(configs);


//
//Helper functions
//
const getAllInputAsString = function () {
	let processArgVIndex=3;
	let string = "";
	while (process.argv[processArgVIndex] !== undefined) {
		string += process.argv[processArgVIndex]+" ";
		processArgVIndex++;
	}
	return string;
}

const createTaskObj = function (task) {
	const taskArray = [];
	const done = false;
	const createdAt = new Date();
	const updatedAt = "";
	taskArray.push(task);
	taskArray.push(done);
	taskArray.push(createdAt.toString());
	taskArray.push(updatedAt);
	console.log("39");
	console.log(taskArray);
	return taskArray;
}

//
//SQL,postgres helper functions
//
const taskAdded = (err, result) => {
	if (err) {
	  console.log("70: query error", err.message);
	} else {
	  console.log("Task added!");
	  console.log(result.rows);
	  console.log("ID of task created:", result.rows[0].id);
	}
}

const columnAdded = (err, result) => {
	if (err) {
	  console.log("80: query error", err.message);
	} else {
	  console.log("Hi! Welcome to your to-do list!\nPlease choose an action from the following:\n-show\n-add\n-done\n-delete");
	}
}

const checkDoneStatus = (err, result) => {
	const singleItemArray = result.rows[0];
	const id = singleItemArray.id;
	const doneStatus = singleItemArray.done;
	if (err) {
	  console.log("90: query error", err.message);
	} else if (doneStatus) {
		console.log("Item already checked off.\nPlease check ID and try again.");
	} else {
		const updatedDate = new Date();
		const updateTask = `UPDATE items SET done='true', updated_at='${updatedDate}' where id='${id}' RETURNING *`;
		client.query(updateTask, taskUpdated);
	}
}

const taskUpdated = (err, result) => {
	if (err) {
	  console.log("106: query error", err.message);
	} else {
	  const object = result.rows[0];
	  const id = object.id;
	  const task = object.name;
	  const done = object.done;
	  const updated_at = object.updated_at;
	  console.log("Task checked off!");
	  console.log(`${id}. [${done?"x":" "}] - ${task}\nupdated_at: ${updated_at}`);
	}
}

const taskDeleted = (err, result) => {
	if (err) {
	  console.log("120: query error", err.message);
	} else {
	  console.log("Task deleted!");
	}
}

const showAll = (err, result) => {
	const taskArray = result.rows;
	if (err) {
	  console.log("129: query error", err.message);
	} else if (taskArray.length>0) {
		taskArray.forEach(item => {
			const id = item.id;
			const task = item.name;
			const done = item.done;
			const created_at = item.created_at;
			const updated_at = item.updated_at;
			console.log(`${id}. [${done?"x":" "}] - ${task}\ncreated_at: ${created_at}\nupdated_at: ${updated_at}`);
		})
	} else if (taskArray.length === 0) {
		console.log("To do list is empty!");
	}
}

const findItem = (err, result) => {
	const singleItemArray = result.rows;
	if (err) {
	  console.log("129: query error", err.message);
	} else if (singleItemArray.length === 1) {
		itemFound = true;
	} else if (singleItemArray.length === 0) {
		itemFound = false;
	}
	if (itemFound) {
		const deleteTask = `DELETE FROM items where id='${singleItemArray[0].id}'`;
		client.query(deleteTask, taskDeleted);
	} else {
		console.log("Item not found.\nPlease check ID and try again.");
	}
}

//
//Client Query Functions
//

const addColumn = function (err) {
	if (err) {console.log("Add column error", err.message)};
	const addColumn = "ALTER TABLE items ADD done boolean, ADD created_at text, ADD updated_at text";
	client.query(addColumn, columnAdded);
}

const addTask = function (err) {
	if (err) {console.log("Add task error", err.message)};
	const task = getAllInputAsString();
	const taskArray = createTaskObj(task);

	const insert = "INSERT INTO items (name, done, created_at, updated_at) VALUES ($1, $2, $3, $4) RETURNING id";
	client.query(insert, taskArray, taskAdded);
}

const checkOffTask = function (id, err) {
	if (err) {console.log("Update task error", err.message)};
	const checkItemDone = `SELECT id, done FROM items where id='${id}'`;
	client.query(checkItemDone, checkDoneStatus);
}

const deleteTask = function (id, err) {
	if (err) {console.log("Delete task error.", err.message)};
	const findAnItem = `SELECT * FROM items where id='${id}'`;
	client.query(findAnItem, findItem);	
}

const listAllItems = function (err) {
	if (err) {console.log("List all error", err.message)};
	const listAll = `SELECT * FROM items`;
	client.query(listAll, showAll);
}

//
//Client Connection Callback function
//

const clientConnectionCallback = (err) => {
  if( err ){
    console.log( "Client connection callback error", err.message );
  }

  const action = process.argv[2];
  let idOfTask;

  switch (process.argv[2]) {
  	case undefined:
  		addColumn();
  		break;
  	case "add": 
  		addTask();
  		break;
  	case "done":
  		idOfTask = process.argv[3];
  		checkOffTask(idOfTask);
  		break;
  	case "delete":
  		idOfTask = process.argv[3];
  		deleteTask(idOfTask);
  		break;
  	case "show":
  		listAllItems();
  		break;
  	default:
  		console.log("Invalid action.\nPlease choose an action from the following:\n-show\n-add\n-done\n-delete")
  }
};

client.connect(clientConnectionCallback);

