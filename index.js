console.log("works!!");

const pg = require('pg');

const configs = {
    user: 'leowzhenkang',
    host: '127.0.0.1',
    database: 'todo',
    port: 5432,
};

const client = new pg.Client(configs);

// let queryDoneCallback = (err, result) => {
//     if (err) {
//       console.log("query error", err.message);
//     } else {
//       console.log("result", result.rows );
//     }
//     client.end();
// };

// let clientConnectionCallback = (err) => {

//   if( err ){
//     console.log( "error", err.message );
//   }

//   let text = "INSERT INTO todo (name) VALUES ($1) RETURNING id";

//   const values = ["hello"];

//   client.query(text, values, queryDoneCallback);
// };

let clientConnectionCallback = (err) => {
    //--------------------SHOW TABLE------------------
    if (process.argv[2] === "show") {
        // client.connect((err) => {

            if (err) {
                console.log("error", err.message);
            }

            const text = 'SELECT * FROM items ORDER BY id, id ASC'

            client.query(text, (err, res) => {
                if (err) {
                    console.log("query error", err.message);
                } else {
                    for (var i = 0; i < res.rows.length; i++) {
                        if(res.rows[i].status === true){
                        console.log(res.rows[i].id+". [X]  "+res.rows[i].name)
                        }else{
                        console.log(res.rows[i].id+". [ ]  "+res.rows[i].name)
                        }
                    }
                    // console.log("result", res.rows);
                    client.end();
                }
            });

        // });
    }
    //----------------------ADD ITEMS-----------------
    if (process.argv[2] === "add") {
        let queryText = 'INSERT INTO items (name) VALUES ($1)';

        let values = [process.argv[3]];
        console.log(values)
        client.query(queryText, values, (err, res) => {
            if (err) {
                console.log("query error", err.message);
            } else {
                console.log("created!")
                client.end();
            }
        });
    } if(process.argv[2] === "done") {
        let queryText = 'UPDATE items SET status = true WHERE id = $1';
        let values = [process.argv[3]]
        client.query(queryText, values, (err, res) => {
            if (err) {
                console.log("query error", err.message);
            } else {
                console.log( "task done!")
            }

        })
    }
};
client.connect(clientConnectionCallback);