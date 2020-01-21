console.log("works!!", process.argv[2]);
const pg = require('pg');
const configs = {
    user: 'joyce',
    host: '127.0.0.1',
    database: 'todo',
    port: 5432,
};

var moment = require('moment');
moment().format();

const client = new pg.Client(configs);
let queryDoneCallback = (err, result) => {
    if (err) {
      console.log("query error", err.message);
    } else {
      console.log("result", result.rows );
    }
    client.end();
};
let clientConnectionCallback = (err) => {
  if( err ){
    console.log( "error", err.message );
    }
      if (process.argv[2] === "show"){
        let text1 = 'SELECT * FROM items';
        client.query(text1, (err, res) => {
            if (err) {
              console.log("query error", err.message);
            } else {
              // iterate through all of your results:
              for( let i=0; i<res.rows.length; i++ ){
                console.log("result: ", res.rows[i]);
              }
            }
        });
      }
      else if (process.argv[2]==="add"){
        var now = moment();
        let text2 = "INSERT INTO items (marked_done, name, created_at) VALUES ($1, $2, $3) RETURNING *";
        const values = ["[] -",process.argv[3],now];
        client.query(text2, values, queryDoneCallback);
      }

      else if (process.argv[2]==="done"){
        // const values = [];
        const values = ["[X] -", process.argv[3]]
        let id = parseInt(process.argv[3]);
        //let text3 = "UPDATE items SET marked_done='[X] -' WHERE id="+id;//
        let text3 = "UPDATE items SET marked_done=$1 WHERE id=$2";//$1 "pre-input" replaces $ index into the item at the position 
        client.query(text3, values, queryDoneCallback);
      }

      };

client.connect(clientConnectionCallback);
