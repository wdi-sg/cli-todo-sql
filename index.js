console.log("works!!", process.argv[2]);

let commandType = process.argv[2].toLowerCase();
let itemList = process.argv[3];


const pg = require('pg');

const configs = {
    user: 'donc',
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
    client.end();
};



let clientConnectionCallback = (err) => {

    if( err ){
      console.log( "error", err.message );
    } else {
        if(commandType === "add"){

            const now = new Date()
            let text = 'INSERT INTO items (name, created) VALUES ($1, $2)';
            let datenow = [now];
            let values = [itemList, datenow];
            client.query(text, values, queryDoneCallback);

        } else if (commandType === "show"){
             text = 'SELECT * FROM items';
            client.query(text, (err, res) => {
                if (err) {
                    console.log("query error", err.message);
                } else {
                    // iterate through all of your results:
                    for( let i=0; i<res.rows.length; i++ ){
                        console.log("result: ", res.rows[i]);
                    }
                }
            });
        } else if (commandType === "done"){
            let text = 'UPDATE items SET Done=true, updated=($1) WHERE id = ($2)';
            const now = new Date()
            let datenow = [now];
            let sub = [datenow, itemList];
            client.query(text, sub, function (err, res) {
                if (err) throw err;
                console.log(res.affectedRows + " record(s) updated");
              });
        } else if (commandType === "delete"){
            let text = 'DELETE from items WHERE id = ($1)';
            let sub = [itemList];
            client.query(text, sub, function (err, res) {
                if (err) throw err;
                console.log("The records have been updated");
              });
        }
  }


};

client.connect(clientConnectionCallback);
