console.log("works!!", process.argv[2]);

const pg = require('pg');

const configs = {
    user: 'll',
    host: '127.0.0.1',
    database: 'todo',
    port: 5432,
};

const client = new pg.Client(configs);

var d = new Date ();

// let queryDoneCallback = (err, result) => {
//     if (err) {
//       console.log("query error", err.message);
//     } else {
//       console.log("result", result.rows );
//     }
// };

// let clientConnectionCallback = (err) => {

//   if( err ){
//     console.log( "error", err.message );
//   }

//   let text = "INSERT INTO todo (task) VALUES ($1) RETURNING id";

//   const values = [process.argv[3]];

//   client.query(text, values, queryDoneCallback);
// };

// client.connect(clientConnectionCallback);

const add = function (err) {
    client.connect ()
    let text = 'INSERT INTO todo (task, created_at) VALUES ($1, $2) RETURNING id';
    const values = [process.argv[3], d.getFullYear() + "-" + d.getMonth() + "-" +d.getDate()];
    client.query(text, values, (err,res) => {
        if (err) {
            console.log("error", err.message);
        } else {
            console.log("result", res.rows);
        }
    });
}

const show = function (err) {
    client.connect();
    let text = 'SELECT * FROM todo';
    client.query(text, (err, res) => {
        if (err) {
            console.log("error", err.message);
        } else {
            for (let i=0; i<res.rows.length;i++) {
                if (res.rows[i].completed === null) {
                    console.log(res.rows[i].id + ". [ ] - " + res.rows[i].task + " (" + res.rows[i].created_at +")");
                } else if (res.rows[i].completed === "x") {
                    console.log(res.rows[i].id + ". [x] - " + res.rows[i].task + " (" + res.rows[i].created_at +")");
                }
            }
        }
    });
}

const complete = function (err) {
    client.connect();
    let text = 'UPDATE todo SET completed=($1) where task = ($2)';
    let value = ["x",process.argv[3]];
    client.query(text, value, (err, res) => {
        if (err) {
            console.log("error", err.message);
        } else {
            console.log("result", res.rows);
        }
    });
}

const del = function (err) {
    client.connect();
    let text = 'DELETE from todo WHERE task = ($1)';
    let value = [process.argv[3]];
    client.query(text, value, (err, res) => {
        if (err) {
            console.log("error", err.message);
        } else {
            console.log("result", res.rows);
        }
    });
}


// function show = (err,result) => {
//     console.log(result.row);
// }

if (process.argv[2] === 'add') {
    add();
} else if (process.argv[2] === 'show') {
    show();
} else if (process.argv[2] === 'complete') {
    complete();
} else if (process.argv[2] === 'del') {
    del();
}