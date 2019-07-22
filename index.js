console.log("starting");

const pg = require('pg');

const configs = {
    user: 'aliciawong',
    host: '127.0.0.1',
    database: 'todo',
    port: 5432,
};

const client = new pg.Client(configs);

let queryDoneCallback = (err, result) => {
    if (err) {
      console.log("query error", err.message);
    } else {
      console.log("result", result.rows );
    }
};

let clientConnectionCallback = (err) => {

    if( err ){
        console.log( "error", err.message );
    }
// query to add to list
    else if (process.argv[2] === 'add') {
        let addTask = "INSERT INTO items (name) VALUES ($1) RETURNING id";
        let newTask = process.argv[3];
        const values = newTask.split();

        client.query(addTask, values, queryDoneCallback);

        let showList = "SELECT * FROM items";
        client.query(showList, queryDoneCallback);
    }
// query to show list
    else if (process.argv[2] === 'show') {
        let showList = "SELECT * FROM items";
        client.query(showList, queryDoneCallback);

    }
//query to mark task completed
    else if (process.argv[2] === 'done') {
        let taskDoneId = process.argv[3];
        console.log('completed task ' + taskDoneId);
        let taskDone = "UPDATE items SET done='✅' WHERE id="+taskDoneId;
        client.query(taskDone, queryDoneCallback);

        let showList = "SELECT * FROM items";
        client.query(showList, queryDoneCallback);

    }
//query to delete task
    else if (process.argv[2] === 'delete') {
        let taskDeleteId = process.argv[3];
        console.log('deleting task ' + taskDeleteId);
        let taskDelete = "DELETE FROM items WHERE id="+taskDeleteId;
        client.query(taskDelete, queryDoneCallback);

        let showList = "SELECT * FROM items";
        client.query(showList, queryDoneCallback);
    }

}

client.connect(clientConnectionCallback);