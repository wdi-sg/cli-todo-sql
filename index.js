
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
                console.log("Item marked as done.")
                break;
            case "archive":
                console.log("Item successfully archived.")
                break;
            case "stats":
                if (todoItem === "add-time") {
                    console.log(`A total of ${result.rows[0].count} tasks have been added today`);
                } else if (todoItem === "complete-time") {
                    console.log(`The average time to complete all tasks is ${result.rows[0].date_part} seconds`);
                }
                break;
            default:
                console.log("Invalid selection.")
                break;
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
        let text = "INSERT INTO items (status, name, updated_at) VALUES ('[ ]', $1, now()) RETURNING id;"
        const values = [todoItem];
        client.query(text, values, queryDoneCallback);
    } else if (operation === "show") {
        let text = "SELECT * FROM items ORDER BY id;"
        client.query(text, queryDoneCallback);
    } else if (operation === "done") {
        const values = [todoItem];
        let text = "UPDATE items SET status = '[x]', updated_at = now() WHERE id = $1;"
        client.query(text, values, queryDoneCallback);
    } else if (operation === "archive") {
        const values = [todoItem];
        client
        .query("INSERT INTO archive SELECT status, name FROM items WHERE id= $1", values)
        .then(result => console.log(`Archiving...`))
        .catch(e => console.log(e.stack))

        client
        .query("DELETE FROM items WHERE id= $1;", values)
        .then(result => console.log(`Done!`))
        .catch(e => console.log(e.stack))
        .then(() => client.end())

        // let text = "DELETE FROM items WHERE id= $1;"
        // client.query(text, values, queryDoneCallback);
    } else if (operation === "stats" && todoItem === "complete-time") {
        let text = "SELECT EXTRACT(EPOCH FROM avg(updated_at - created_at)) FROM items;"
        client.query(text, queryDoneCallback);
    } else if (operation === "stats" && todoItem ==="add-time") {
        let text = "SELECT count(1) FROM items WHERE created_at > now() - interval '1 day';"
        client.query(text, queryDoneCallback);
    } else if (operation === "stats" && todoItem ==="best-worst") {
        client
        .query("SELECT name, time_taken FROM items WHERE time_taken = (SELECT min(time_taken) FROM items);")
        .then(result => console.log(`Fastest task: ${result.rows[0].name} at ${result.rows[0].time_taken}`))
        .catch(e => {
            console.log(e.stack)
        });

        client
        .query("SELECT name, time_taken FROM items WHERE time_taken = (SELECT max(time_taken) FROM items);")
        .then(result => console.log(`Slowest task: ${result.rows[0].name} at ${result.rows[0].time_taken}`))
        .catch(e => console.log(e.stack))
        .then(() => client.end())
    }
};


client.connect(clientConnectionCallback);