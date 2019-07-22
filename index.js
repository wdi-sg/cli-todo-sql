const pg = require('pg');

var commandType = process.argv[2];
var userInput  = process.argv[3];

var moment = require('moment-timezone');

const configs = {
    user: 'yixin',
    host: '127.0.0.1',
    database: 'todo',
    port: 5432,
};

const client = new pg.Client(configs);


//Show list
const show = function() {

    let sqlQuery = "SELECT * FROM items ORDER BY id ASC;";
    client.query(sqlQuery, (error, result) => {
        if (error) {
            console.log("query error", error.message);
        } else {
          var tasks = result.rows;
          for (var i = 0; i < tasks.length; i++){
            if (tasks[i].done  === true){
              console.log(tasks[i].id + ". "+ "[x] " + tasks[i].task + "   " + tasks[i].updated_at);
            } else {
              console.log(tasks[i].id + ". "+ "[ ] " + tasks[i].task + "   " + tasks[i].updated_at);
            }
          }
            process.exit();
        }
    });
}


//Add item
const add = function(newTask) {

    let sqlQuery = "INSERT INTO items (task, done, created_at, updated_at) VALUES ($1, $2, $3, $4)";
    let createdAt = moment().tz("Asia/Singapore").format('MMMM Do YYYY, h:mm:ss a');
    let updatedAt = moment().tz("Asia/Singapore").format('MMMM Do YYYY, h:mm:ss a');
    let values= [newTask, false, createdAt, updatedAt];
    client.query(sqlQuery, values, (error, result) => {
        if (error) {
            console.log("query error", error.message);
        } else {
            console.log(`Added Task`);
            process.exit();
        }
    });
}


//Mark Done
const markDone = function(id) {
    id = parseInt(id);

    let sqlQuery = "UPDATE items SET done = $2, updated_at = $3 WHERE id = $1";
    let updatedAt = moment().tz("Asia/Singapore").format('MMMM Do YYYY, h:mm:ss a');
    let values= [id, true, updatedAt];


    client.query(sqlQuery, values, (error, result) => {
        if (error) {
            console.log("query error", error.message);
        } else {
            console.log(`Marked Done`);
            process.exit();
        }
    });
}

//Mark Undone
const markUndone = function(id) {
    id = parseInt(id);

    let sqlQuery = "UPDATE items SET done = $2, updated_at = $3 WHERE id = $1";
    let updatedAt = moment().tz("Asia/Singapore").format('MMMM Do YYYY, h:mm:ss a');
    let values= [id, false, updatedAt];

    client.query(sqlQuery, values, (error, result) => {
        if (error) {
            console.log("query error", error.message);
        } else {
            console.log(`Marked Undone`);
            process.exit();
        }
    });
}

//Delete Task
const deleteTask = function(id) {
    id = parseInt(id);

    let sqlQuery = "DELETE FROM items WHERE id = $1";
    let values= [id];

    client.query(sqlQuery, values, (error, result) => {
        if (error) {
            console.log("query error", error.message);
        } else {
            console.log(`Deleted`);
            process.exit();
        }
    });
}


client.connect((err) => {

  var commandType = process.argv[2];
  var userInput  = process.argv[3];

    if (err) {
        console.log("error", err.message);
    } else {

      switch (commandType) {
          case "show":
              show();
              break;

          case "add":
              add(userInput);
              break;

          case "done":
              markDone(userInput);
              break;

          case "undo ":
              markUndone(userInput);
              break;

          case "delete":
              deleteTask(userInput);
              break;

          default:
              instructions();
              break;
      }


    }

});

//Intructions
const instructions = function() {
    console.log(`
      ████████╗ ██████╗     ██████╗  ██████╗     ██╗     ██╗███████╗████████╗
      ╚══██╔══╝██╔═══██╗    ██╔══██╗██╔═══██╗    ██║     ██║██╔════╝╚══██╔══╝
         ██║   ██║   ██║    ██║  ██║██║   ██║    ██║     ██║███████╗   ██║
         ██║   ██║   ██║    ██║  ██║██║   ██║    ██║     ██║╚════██║   ██║
         ██║   ╚██████╔╝    ██████╔╝╚██████╔╝    ███████╗██║███████║   ██║
         ╚═╝    ╚═════╝     ╚═════╝  ╚═════╝     ╚══════╝╚═╝╚══════╝   ╚═╝
         `);
    console.log("Instructions");
    console.log("$ node index.js show            -  to show the to do list");
    console.log("$ node index.js add 'new task'  -  to add a new task");
    console.log("$ node index.js done 1          -  to mark task 1 done");
    console.log("$ node index.js undo 1          -  to mark task 1 not done");
    console.log("$ node index.js delete 1        -  to delete task 1");
    process.exit();
}
