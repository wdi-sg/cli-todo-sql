const pg = require('pg');

const configs = {
        user: 'postgres',
        host: '127.0.0.1',
        database: 'todo',
        port: 5432,
};


const client = new pg.Client(configs);


let queryDoneCallback = (err, result) => {
        if (err) {
            console.log("query error", err.message);
        }
        switch (process.argv[2].toLowerCase()) {
            case "show":
                console.log("result", result.rows );
            break;
            case "add":
                console.log("Added "+process.argv[3]+" to To-Do-List")
            break;
            case "done":
                console.log("Task "+process.argv[3]+". done.")
            break;
            default:
            console.log("Something is wrong in queryDoneCallback")
        }
        client.end();
};


let clientConnectionCallback = (err) => {
    if( err ){
        console.log( "error", err.message );
    }
    let text;
    let values = [];
    switch (process.argv[2].toLowerCase()) {
        case "show":
            text = "SELECT * FROM items ORDER BY id ASC";
        break;
        case "add":
            text = "INSERT INTO items (name, done) VALUES ($1, false) RETURNING *";
            values = [process.argv[3]];
        break;
        case "done":
            text = "UPDATE items SET done=true WHERE id=$1 RETURNING name"
            values = [process.argv[3]];
        break;
        default:
        console.log("Something is wrong")
    }
    client.query(text, values, queryDoneCallback);
};

client.connect(clientConnectionCallback);
