let numOfToDoItems;

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

//Read server for number of items in list
//if empty, set id = 1
//if not empty user increasing number
//get user input and create obj



// const deleteItem

//
//SQL,postgres functions
//

// const getNumOfItemsInList = (err, result) => {
//     if (err) {
//       console.log("73: query error", err.message);
//     } else {
//     	console.log(results.row);
//     	numOfToDoItems = results.row.length;
//     	console.log("76");
//     	console.log(numOfToDoItems);
//     }
// }

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
	  console.log("78: query error", err.message);
	} else {
	  console.log("Hi! Welcome to your to-do list!\nPlease choose an action from the following:\n-show\n-add\n-done\n-delete");
	}
}

//
//Client Connection Callback
//

const addColumn = function (err) {
	if (err) {console.log("Add column callback error", err.message)};
	const addColumn = "ALTER TABLE items ADD done boolean, ADD created_at text, ADD updated_at text";
	client.query(addColumn, columnAdded);
}

const addTask = function (err) {
	const task = getAllInputAsString();
	console.log("98 task: "+task);
	const taskArray = createTaskObj(task);

	const insert = "INSERT INTO items (name, done, created_at, updated_at) VALUES ($1, $2, $3, $4) RETURNING id";
	client.query(insert, taskArray, taskAdded);
}

const clientConnectionCallback = (err) => {
  if( err ){
    console.log( "Client connection callback error", err.message );
  }
  // let selectRows = "SELECT id FROM items";
  // client.query(selectRows, getNumOfItemsInList);

  const action = process.argv[2];

  switch (process.argv[2]) {
  	case undefined:
  		addColumn();
  		break;
  	case "add": 
  		addTask();
  		break;
  	// case "done":
  	// 	return checkOffItem();
  	// case "delete":
  	// 	return deleteItem();
  	// case "show":
  		// return ;
  	default:
  		console.log("Invalid action.\nPlease choose an action from the following:\n-show\n-add\n-done\n-delete")
  }

  // let selectRows = "SELECT id FROM items";
  // client.query(text, getNumOfItemsInList);
};

client.connect(clientConnectionCallback);

