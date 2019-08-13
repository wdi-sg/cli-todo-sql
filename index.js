console.log("starting up!!");

let commandType = process.argv[2];
let taskDesc = process.argv[3];

const express = require('express');
const pg = require('pg');

// Initialise postgres client
const configs = {
  user: 'xxx',
  password: 'xxx',
  host: '127.0.0.1',
  database: 'todo',
  port: 5432,
};

//const pool = new pg.Pool(configs);
const client = new pg.Pool(configs);

const app = express();

app.use(express.json());
app.use(express.urlencoded({
  extended: true
}));

app.get('/hello', (req, res) => {

  res.send('hello');
});


let datestamp = function(){
    let date = new Date();
    return `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}, ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
};

// Add new task singly
function addTask (description, completionStatus, dateCreated, dateCompleted){
    this.description = description;
    this.completionStatus = completionStatus;  // True for completed; false for not completed
    this.dateCreated = dateCreated;
    this.dateCompleted = dateCompleted;
};


// Read and write new Task
let addNewTask = function(){
    // to create an object, use 'new' keyword with custom func
    client.connect((err) => {
        let newTask = new addTask(taskDesc, false, datestamp(), '');
        console.log(newTask);

        let queryText = 'INSERT INTO items (description, completionStatus, dateCreated, dateCompleted) VALUES ($1, $2, $3, $4) RETURNING id';

        const values = [newTask.description, newTask.completionStatus, newTask.dateCreated, newTask.dateCompleted];
        console.log (client.query);

        client.query(queryText, values, (err, res) => {

            if (err) {
                console.log("query error", err.message);
            } else {
                console.log("id of the thing you just created:", res.rows[0].id);
            }
        });
    });
};


let showAllTask = function(){

    client.connect((err) => {
        const queryText = 'SELECT * FROM items';
        client.query(queryText, (err, res) => {
            if (err) {
                console.log("query error", err.message);
            } else {
                 for( let i=0; i<res.rows.length; i++ ){

                    console.log((i+1).toString() + ' \t [' + (res.rows[i].completionstatus == false ? ' ' : 'X') + '] \t \t ' + res.rows[i].description + ' \t \t ' + res.rows[i].datecreated + ' \t \t ' + res.rows[i].datecompleted);
                }
            }
        });
    });
};


let taskDone = function(){

    client.connect((err) => {
        let queryText = 'UPDATE items SET completionstatus=$1, datecompleted=$2 WHERE id=$3 RETURNING id';
        const values = [true, datestamp(), taskDesc];

        client.query(queryText, values, (err, res) => {
            if (err) {
                console.log("query error", err.message);
            } else {
                console.log("id of the thing you just created:", res.rows[0].id);
            }
        });
    });
};


let deleteTask = function(){

    let queryText = 'DELETE FROM items WHERE id=$1  RETURNING id';
    const values = [taskDesc];

    client.query(queryText, values, (err, res) => {
        if (err) {
            console.log("query error", err.message);
        } else {
            console.log("id of the thing you just created:", res.rows[0].id);
        }
    });
};


// Actions based on command type
switch (commandType){
    case "add":
        addNewTask()
        break;
    case "show":
        showAllTask()
        break;
    case "done":
        taskDone()
        break;
    case "delete":
        deleteTask()
        break;
};