// console.log("works!!", process.argv[2]);

const pg = require('pg');

const configs = {
    user: 'ishak',
    host: '127.0.0.1',
    database: 'todo',
    port: 5432,
};

const client = new pg.Client(configs);
const num = process.argv[3];

var add = () => {

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
            let text = "INSERT INTO items (name) VALUES ($1) RETURNING id, name";
            const values = [process.argv[3]];

            client.query(text, values, queryDoneCallback);
        }
    };
client.connect(clientConnectionCallback);
}

var show = () => {

    let queryDoneCallback = (err, result) => {
        if (err) {
          console.log("query error", err.message);
        } else {
            const length = result.rows.length;
            const items = result.rows;
            //iterate items, if status = false [ ], else if status = true [x]
            for(let i = 0; i < length; i++) {
                if (items[i].status === false) {
                    console.log(items[i].id + ". " + "[ ] - " +items[i].name);
                } else if (items[i].status === true) {
                    console.log(items[i].id + ". " + "[x] - " +items[i].name);
                }
            }
        }
    };

    let clientConnectionCallback = (err) => {

        if( err ){
            console.log( "error", err.message );
        } else {
            let show = "SELECT * FROM items ORDER BY id ASC";

            client.query(show, queryDoneCallback);
        }
    };
client.connect(clientConnectionCallback);
}


var done = () => {

    //query for
    let queryUpdateCallback = (err,result) => {
        if (err) {
            console.log("query error", err.message);
        } else {
            console.log(`Item ${num} deleted`)
        }
    };


    let queryDoneCallback = (err, result) => {
        if (err) {
            console.log("query error", err.message);
        } else {
            const length = result.rows.length;
            const items = result.rows;
            //iterate items, if status = false [ ], else if status = true [x]
            for(let j = 0; j < length; j++) {
                if (items[j].status === false) {
                    console.log(items[j].id + ". " + "[ ] - " +items[j].name);
                } else if (items[j].status === true) {
                    console.log(items[j].id + ". " + "[x] - " +items[j].name);
                }
            }
        }
    };


    let clientConnectionCallback = (err) => {

        if( err ){
            console.log( "error", err.message );
        } else {
            let select = `UPDATE items SET status = TRUE WHERE id = ${num}`;
            let show = "SELECT * FROM items ORDER BY id ASC";

            client.query(select, queryDeleteCallback);
            client.query(show, queryUpdateCallback);
        }
    };
client.connect(clientConnectionCallback);
}


switch (process.argv[2]) {
    case "add":
    add ();
    break;
    case "show":
    show();
    break;
    case "done":
    done();
    break;
}