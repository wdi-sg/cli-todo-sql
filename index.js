// console.log("works!!", process.argv[2]);

const pg = require('pg');

const configs = {
    user: 'ianfoo',
    host: '127.0.0.1',
    database: 'todo',
    port: 5432,
};

const client = new pg.Client(configs);

//###################################################
//Function to display table from todo database.
const display = () => {

     let queryText = "SELECT * FROM todo";

            client.query(queryText, (err, res) => {
                if(err) {
                console.log("QUERY ERROR2", err.message);
            } else {
                for(let i = 0; i < res.rows.length; i++) {
                console.log(res.rows[i].id + '. ' + res.rows[i].done + ' - ' + res.rows[i].task + ' | ' + 'Created at: ' + res.rows[i].created_at);
            }
        }

    });
}

//####################################################


client.connect((err) => {
    if(err) {
        console.log('error', err.message);
    }
    console.log("CONNECTED");

if (process.argv[2] === 'add') {
        const taskAdded = process.argv[3];
        const isDone = '[ ]';
        const timeAdded = new Date().toISOString();

        const text = "INSERT INTO todo (task, done, created_at) VALUES ('"+taskAdded+"', '"+isDone+"', '"+timeAdded+"')";

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
        const timeUpdated = new Date().toISOString();
        const text = "UPDATE todo SET done='[X]' WHERE id='"+taskCompleted+"'";

        client.query(text, (err, res) => {
            if(err) {
                console.log('QUERY ERROR', err.message);
            } else {
                console.log("UPDATED");
            }
        })

        const update = "UPDATE todo SET updated_at='"+timeUpdated+"' WHERE done='[X]'";

        client.query(update, (err, res) => {
            if(err) {
                console.log('QUERY ERROR', err.message);
            } else {
                console.log("UPDATED");
            }
        })

        const queryText = "SELECT * FROM todo ORDER BY id ASC";

        client.query(queryText, (err, res) => {
                if(err) {
                console.log("QUERY ERROR2", err.message);
            } else {
                for(let i = 0; i < res.rows.length; i++) {
                    if(res.rows[i].updated_at === null) {
                        res.rows[i].updated_at = '';
                    }
                console.log(res.rows[i].id + '. ' + res.rows[i].done + ' - ' + res.rows[i].task + ' | ' + 'Updated at: ' + res.rows[i].updated_at);
            }
        }
        });
    }
})