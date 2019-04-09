//===================================
// Configurations and set up
//===================================
const figlet = require('figlet');
const promise = require("bluebird");
const pg = promise.promisifyAll(require('pg'));

const configs = {
    user: 'chuasweechin',
    host: '127.0.0.1',
    database: 'todo',
    port: 5432,
};

const client = new pg.Client(configs);

//===================================
// Helper Function
//===================================
var addZero = function(i) {
  if (i < 10) {
    i = "0" + i;
  }
  return i;
}

var getCurrentDateAndTime = function () {
    let date = new Date();
    let dateAndTime = `${ date.getDate() }/${ date.getMonth() + 1 }/${ date.getFullYear() } ` +
                        `${ addZero(date.getHours()) }:${ addZero(date.getMinutes()) }:${ addZero(date.getSeconds()) }`;

    return dateAndTime;
}

var setConsoleMessages = function (content) {
    figlet(content, function(err, data) {
        if (err) {
            console.dir(err);
            return;
        }
        console.log(data)

        console.log('Options');
        console.log('1. View All Items - Type in "node index.js show" to display all your to do to items');
        console.log('2. Add New Item - Type in "node index.js add [task name]" to add new to do item');
        console.log('3. Mark Item as Done - Type in "node index.js done [task #]" to mark to do item as done');
        console.log('4. Delete Item: Type in "node index.js delete [task #]" to delete to do item');
    });
}

var executeWriteQuery = function (sqlQuery, values) {
    client.connectAsync()
        .then( () => {
            client.queryAsync(sqlQuery, values)
                .then( () => {
                    client.end();
                })
                .catch( (err) => {
                    client.end();
                    console.log("query error: ", err.message);
                });
        })
        .catch( (err) => {
            client.end();
            console.log("connection error: ", err.message);
        });
}

//===================================
// Function
//===================================
var showTasks = async function () {
    let sqlQuery = 'SELECT * FROM items';

    client.connectAsync()
        .then( () => {
            client.queryAsync(sqlQuery)
                .then( (result) => {
                    if (result.rows !== undefined) {
                        result.rows.forEach( (item, index) => {
                            if (item.done == false) {
                                console.log(`${ index + 1 }. [ ] - ${ item.task }`);
                            } else {
                                console.log(`${ index + 1 }. [X] - ${ item.task }`);
                            }
                        });
                    } else {
                        console.log("You have an empty task list. Add in something first.");
                    }
                    client.end();
                })
                .catch( (err) => {
                    client.end();
                    console.log("query error: ", err.message);
                });
        })
        .catch( (err) => {
            client.end();
            console.log("connection error: ", err.message);
        });
}

var addTask = function (task) {
    const values = [task, false, getCurrentDateAndTime()];
    let sqlQuery = 'INSERT INTO items (task, done, created_at) VALUES ($1, $2, $3)';

    executeQuery(sqlQuery, values);
}

var markTaskAsDone = function (id) {
    const values = [true, getCurrentDateAndTime(), id];
    let sqlQuery = 'UPDATE items SET done = $1, updated_at = $2 where id=$3';

    executeQuery(sqlQuery, values);
}

var deleteTask = function (id) {
    const values = [id];
    let sqlQuery = 'DELETE FROM items WHERE id=$1';

    executeQuery(sqlQuery, values);
}


//===================================
// Main
//===================================
var main = function (userCommandType, userInput) {
    switch (userCommandType) {
        case "show":
            showTasks();
            break;

        case "add":
            addTask(userInput);
            console.log("Task added!");
            break;

        case "done":
            markTaskAsDone(userInput);
            console.log("Task marked as done!");
            break;

        case "delete":
            deleteTask(userInput);
            console.log("Task deleted!");
            break;

        default:
            setConsoleMessages("Swee Chin - To Do List");
            break;
    }
}

main(process.argv[2], process.argv[3]);