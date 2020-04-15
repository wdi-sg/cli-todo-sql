console.log("works!!", process.argv[2]);

const pg = require('pg');

const configs = {
    user: 'apple',
    host: '127.0.0.1',
    database: 'apple',
    port: 5432,
};

const client = new pg.Client(configs);

let queryDoneCallback = (err, result) => {
    if (err) {
      console.log("query error", err.message);
    } else {
      console.log("result", result.rows );
    }
    client.end();
};

let clientConnectionCallback = (err) => {

  if( err ){
    console.log( "error", err.message );
  }

  let text = "INSERT INTO apple (name) VALUES ($1) RETURNING id";

  const values = ["hello"];

  client.query(text, values, queryDoneCallback);
};

client.connect(clientConnectionCallback);


let queryText = "INSERT INTO todolist (done, item) VALUES ('yes', 'feed')";

client.query(queryText, (err, res) => {
    if (err) {
      console.log("query error", err.message);
    } else {
      console.log("done!");
    }
});


const doList = new pg.doList(configs);

//###################################################
//Function to display table from todo database.
const display = () => {

     let queryText = "SELECT * FROM todo";

            doList.query(queryText, (err, res) => {
                if(err) {
                console.log("QUERY ERROR2", err.message);
            } else {
                for(let i = 0; i < res.rows.length; i++) {
                console.log(res.rows[i].id + '. ' + res.rows[i].done + ' - ' + res.rows[i].task + ' | ' + 'Created at: ' + res.rows[i].created_at);
            }
        }

    });
}

client.connect((err) => {
    if(err) {
        console.log('error', err.message);
    }
    console.log("CONNECTED");

if (process.argv[2] === 'add') {
        const taskAdded = process.argv[3];
        const isDone = '[ ]';


        const text = "INSERT INTO todo (task, done, created_at) VALUES ('"+taskAdded+"', '"+isDone+"')";

        client.query(text, (err, res) => {
            if(err) {
                console.log('QUERY ERROR', err.message);
            } else {
                console.log("ADDED");
            }
        })

    } else if (process.argv[2] === 'show') {
        display();


    } else if(process.argv[2] === 'done') {

        const taskCompleted = parseInt(process.argv[3]);

        const text = "UPDATE todo SET done='[X]' WHERE id='"+taskCompleted+"'";

        client.query(text, (err, res) => {
            if(err) {
                console.log('QUERY ERROR', err.message);
            } else {
                console.log("UPDATED");
            }
        })