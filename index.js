console.log("works!!", process.argv[2]);

let commandType = process.argv[2].toLowerCase();
let itemList = process.argv[3];


const pg = require('pg');

const configs = {
    user: 'donc',
    host: '127.0.0.1',
    database: 'todo',
    port: 5432,
    password: 'password'
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
    } else {
        if(commandType === "add"){

            let text = 'INSERT INTO items (name) VALUES ($1)';
            let values = [itemList];
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
            let text = 'UPDATE items SET Done=true WHERE id = ($1)';
            let sub = [itemList];
            client.query(text, sub, function (err, res) {
                if (err) throw err;
                console.log(res.affectedRows + " record(s) updated");
              });
        }

        /*let text = "INSERT INTO todo (name) VALUES ($1) RETURNING id";
        const values = ["hello"];
        client.query(text, values, queryDoneCallback);*/
  }


};

client.connect(clientConnectionCallback);