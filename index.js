console.log("~~ Tuning in to todo database ~~", process.argv[2]);

const pg = require('pg');

const configs = {
    user: 'samuelhuang',
    host: '127.0.0.1',
    database: 'todo',
    port: 5432,
};

const client = new pg.Client(configs);

let queryDoneCallback = (err, result) => {

    let done = "";

    if (err) {
      console.log("query error", err.message);
    } else {
      for(let i = 0; i < result.rows.length; i++){
        if (result.rows[i].completed === false){
            done = "[ ]";
        } else {
            done = "[x]";
        }

        let obj = result.rows[i];

        if (obj.archived === null){
            console.log(`${obj.id}. ${done} - ${obj.name} created at: ${obj.created_at}` );
        }
      }
    }
    client.end();
};

let clientConnectionCallback = (err) => {

    let values = [process.argv[3]];

    if( err ){
        console.log( "error", err.message );
    }

    if(process.argv[2] === "show"){
        let text = "SELECT * FROM items ORDER BY id";
        client.query(text, queryDoneCallback);
    }

    if(process.argv[2] === "add"){
        let text = `INSERT INTO items (name,completed,created_at) VALUES ($1,false,CURRENT_TIMESTAMP) RETURNING *`;
        client.query(text, values, queryDoneCallback);
    }

    if(process.argv[2] === "done"){
        let text = "UPDATE items SET completed = true, updated_at = CURRENT_TIMESTAMP WHERE id = ($1) RETURNING *"
        client.query(text, values, queryDoneCallback);
    }

    if(process.argv[2] === "archive"){
        let text = "UPDATE items SET archived = true WHERE id = ($1) RETURNING *";
        client.query(text, values, queryDoneCallback);
    }
};

client.connect(clientConnectionCallback);