
// Global Variables
const args = process.argv
let operation = args[2];
let todoItem = args[3];

// PG to handle postGres requests
const pg = require('pg');

const configs = {
    user: 'jarryl',
    host: '127.0.0.1',
    database: 'todo',
    port: 5432,
};

const client = new pg.Client(configs);


// Results Handler
let queryDoneCallback = (err, result) => {
    if (err) {
        console.log("query error", err.message);
    } else {
        switch (operation) {
            case "show":
                result.rows.forEach((entry, index) => {
                    console.log(`${result.rows[index].id}. ${result.rows[index].status} - ${result.rows[index].name}`);
                })
                break;
            case "add":
                console.log("Item successfully added!")
                break;
            case "done":
                console.log("Item marked as done")
                break;
            default:
                console.log("Invalid selection")
        }
    }
    client.end();
}


// Query Handler
let clientConnectionCallback = (err) => {
    if( err ){
        console.log( "error", err.message );
    }
    if (operation === "add"){
        let text = "INSERT INTO items (status, name) VALUES ('[ ]', $1) RETURNING id;"
        const values = [todoItem];
        client.query(text, values, queryDoneCallback);
    } else if (operation === "show") {
        let text = "SELECT * FROM items ORDER BY id;"
        client.query(text, queryDoneCallback);
    } else if (operation === "done") {
        const values = [todoItem];
        let text = "UPDATE items SET status = '[x]' WHERE id = $1;"
        client.query(text, values, queryDoneCallback);
    }
};


client.connect(clientConnectionCallback);