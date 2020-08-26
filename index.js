console.log("works!!", process.argv[2]);
const operation = process.argv[2];
const chore = process.argv[3];
let choreStatus = false;
const pg = require('pg');

const configs = {
    user: 'aurelialim',
    host: '127.0.0.1',
    database: 'todo',
    port: 5432,
};

const client = new pg.Client(configs);



client.connect((error)=> {
    if(error){
        console.log('ERROR AT CONNECT', error.message)
    } else {
        if(operation ==="add"){

            queryText = 'INSERT INTO items (name, done) VALUES ($1, $2) RETURNING name';
            values = [chore, choreStatus];
            client.query(queryText,values, (err, res) => {
            if (err) {
            console.log("query error", err.message);
            } else {
            console.log("result", res.rows);
    }
  });
        } else if (operation ==='show'){
            queryText = 'SELECT * FROM items';
            client.query(queryText, (err, res) => {
            if (err) {
            console.log("query error", err.message);
            } else {
            console.log("here are your tasks", res.rows);
    }
  });

        } else if(operation ==="done"){
            let id = parseInt(chore);
            queryText = `UPDATE items SET done=true WHERE id =${id} RETURNING name`;
            client.query(queryText, (err, res) => {
            if (err) {
            console.log("query error", err.message);
            } else {
            console.log("done[X]", res.rows);
    }
  });

        }
    }
})