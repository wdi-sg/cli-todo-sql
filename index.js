const NODE_INPUT = process.argv[2];
const NODE_ARGUMENT = [process.argv[3]];
const SHOW_TASKS = `SELECT * FROM items ORDER BY id`;
const ADD_TASK = `INSERT INTO items (task) VALUES ($1)`;
const MARK_DONE = `UPDATE items SET is_done=true, last_updated=now() WHERE id=${NODE_ARGUMENT}`;
const DELETE_TASK = `DELETE FROM items WHERE id=${NODE_ARGUMENT}`;
const RESTART_ID_SEQ = `ALTER SEQUENCE items_id_seq RESTART`;
const UPDATE_DEFAULT_ID = `UPDATE items SET id=default`;
const pg = require('pg');
const configs = {
    user: 'postgres',
    host: '127.0.0.1',
    database: 'todo',
    port: 5432,
    password: 'postgres'
};
const client = new pg.Client(configs);


let queryDoneCallback = err => {
    if (err) {
        console.log("query error", err.message);
    } else {
        client.query(SHOW_TASKS, (err, results)=>{
            results.rows.forEach((result, index) => {
                let resultString;
                result.is_done ? resultString = "X" : resultString = "";
                console.log(result.id + ". [" + resultString + "] " + result.task + " " + simplifyDate(result.last_updated));
            });
        });
    }
};

let clientConnectionCallback = err => {
    if (err) {
        console.log("error", err.message);
    }
    
    switch(NODE_INPUT){
        case "show":
            client.query(SHOW_TASKS, queryDoneCallback);
            break;
        case "add":
            client.query(ADD_TASK, NODE_ARGUMENT, queryDoneCallback);
            break;
        case "done":
            client.query(MARK_DONE, queryDoneCallback);
            break;
        case "delete":
            client.query(DELETE_TASK, restartID);
            break;
        default:
            break;
    }
};

let restartID = err => {
    err ? console.error(err) : null;
    client.query(RESTART_ID_SEQ, updateDefaultID);
}

let updateDefaultID = err => {
    err ? console.error(err) : null;
    client.query(UPDATE_DEFAULT_ID, queryDoneCallback);
}

function simplifyDate(date) {
    let dateString;
    date.getDate() < 10 ? dateString = "0" + date.getDate() : dateString = date.getDate();
    return "(" + dateString + "-" + date.getMonth() + 1 + "-" + date.getFullYear() + " " +
        date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds() + ")";
}

client.connect(clientConnectionCallback);