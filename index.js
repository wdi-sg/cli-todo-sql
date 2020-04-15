console.log("works!!", process.argv[2]);

const pg = require('pg');
const moment = require('moment');
const AsciiTable = require('ascii-table');

const configs = {
    user: 'rachelle',
    host: '127.0.0.1',
    database: 'todo',
    port: 5432,
};

const client = new pg.Client(configs);

let queryDoneCallback = (err, result) => {
    if (err) {
        console.log("query error", err.message);
    } else {
        //console.log("result", result.rows );
        //console.log("result", result.rows);
        //console.log(result.rows.length);
        let displayTable = new AsciiTable('TO-DO LIST');
        displayTable.setHeading('No.', 'Done', 'Chore', 'Date Created', 'Date Updated')
        displayTable.setAlign(1, AsciiTable.CENTER);
        for (i = 0; i < result.rows.length; i++) {
            const dateCreated = result.rows[i].created;
            const dateUpdated = result.rows[i].updated;
            // const dateCreatedString = `${dateCreated.getDate().toString().padStart(2,'0')}-${(dateCreated.getMonth()+1).toString().padStart(2,'0')}-${dateCreated.getFullYear()}`;
            let box = " ";
            if (result.rows[i].done === true) {
              box = "X";
            } else {
              box = " ";
            }
            displayTable.addRow(result.rows[i].id, box, result.rows[i].name, dateCreated, dateUpdated);
        }
        // listToDoItems();
        //console.log(result.row)
        console.log('****************************************')
        console.log(displayTable.toString());
    }
    client.end(); // ends the thing, don't need to \q to get out
};

let queryText;
let values;
let choresDone = false;
let dateAt = moment().format('lll');

const listToDoItems = () => {
    let queryText = 'SELECT * FROM todo ORDER BY id ASC';
    client.query(queryText, (err, result) => {
        console.log(result.rows.length)
    });
}

let clientConnectionCallback = (err, result) => {

    if (err) {
        console.log("error", err.message);
    }

    switch (process.argv[2]) {
        case 'insert':
            queryText = 'INSERT INTO todo (name, done, created) VALUES ($1, $2, $3) RETURNING id';
            //console.log(process.argv[3], choresDone, date)
            values = [process.argv[3], choresDone, dateAt];
            break;
        case 'select':
            queryText = 'SELECT * FROM todo ORDER BY id ASC';
            break;
        case 'show':
            queryText = 'SELECT * FROM todo ORDER BY id ASC';
            break;
        // case 'update':
        //     queryText = 'UPDATE todo set updatedat=$2 WHERE id=$1 RETURNING *';
        //     date = moment().format('MMMM Do YYYY, h:mm:ss a');;
        //     values = [process.argv[3], date];
        //     break;
        case 'done':
            queryText = 'UPDATE todo set done=$2, updated=$3 WHERE id=$1 RETURNING *';
            choresDone = true;
            dateAt = moment().format('lll');
            values = [process.argv[3], choresDone, dateAt];
            break;
          case 'delete':
            queryText = "DELETE FROM todo WHERE id=$1";
            values = [process.argv[3]];
            break;
    }

    client.query(queryText, values, queryDoneCallback);
};

client.connect(clientConnectionCallback);