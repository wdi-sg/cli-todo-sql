console.log("works!!", process.argv[2]);

const pg = require('pg');

const configs = {
    user: 'sam',
    host: '127.0.0.1',
    database: 'todo',
    port: 5432,
};

const client = new pg.Client(configs);


let queryDoneCallback = (err, result) => {
    if (err) {
      console.log("query error", err.message);
    } else {
      console.log("result", result.rows[0] );
    }
};

// let clientConnectionCallback = (err) => {

//   if( err ){
//     console.log( "error", err.message );
//   }


//   client.query(text, values, queryDoneCallback);
// };


// client.connect(clientConnectionCallback);

  // let text = "INSERT INTO items (name) VALUES ($1) RETURNING id";

// const values = [process.argv[3]];
let command = process.argv[2];

const show = function (){
    if (command === 'show') {
    let queryText = 'SELECT * FROM items';

    client.query(queryText,(err,res) => {
        if (err){
            console.log("query error", err.message);
        }else{
            for (let i=0; i<res.rows.length; i++){
            console.log(res.rows[i]);
        }
        process.exit();
        }
        })
    };
}