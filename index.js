const pg = require('pg');

const configs = {
    user: 'apple',
    host: '127.0.0.1',
    database: 'todo',
    port: 5432,
};

const client = new pg.Client(configs);

let queryDoneCallback = (err, result) => {
    if (err) {
      console.log("query error", err.message);
    } else {
      console.log("result", result.rows);
    }
};

let clientConnectionCallback = (err) => {

    if( err ){
        console.log( "error", err.message );
    }

    if (process.argv[2] === "add") {

        let text = "INSERT INTO items (name, done) VALUES ($1, $2) RETURNING id";

        const values = [process.argv[3],"[ ]"];

        client.query(text, values, queryDoneCallback);
    }

    if (process.argv[2] === "show") {
        let queryText = 'SELECT * FROM items ORDER BY id ASC';
        client.query(queryText, (err, res) => {
            if (err) {
                console.log("error", err.message);
            }
            else {
                console.log("id     items");
                for( let i=0; i<res.rows.length; i++ ){
                    message = "";
                    for(var key in res.rows[i]) {
                        if (key === "id") {
                            message = message + "0"+ res.rows[i][key] + " ";
                        }
                        else {
                            message = message + res.rows[i][key] + " ";
                        }
                    }
                console.log(message);
                }
            }
        });
    }

    if (process.argv[2] === "delete") {
        let id = parseInt(process.argv[3]);
        client.query('DELETE FROM items WHERE id=($1)', [id]);
    }

    if (process.argv[2] === "done") {
        let id = parseInt(process.argv[3]);
        client.query('UPDATE items SET done=($1) WHERE id=($2)',
        ["[x]", id]);
    }
};

client.connect(clientConnectionCallback);