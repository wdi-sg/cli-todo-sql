const pg = require('pg');
const moment = require('moment');

// INITIALISE POSTGRES
const configs = {
    user: 'wongjoey',
    host: '127.0.0.1',
    database: 'todo',
    port: 5432,
};

const pool = new pg.Pool(configs);

pool.on('error', function(err) {
  console.log('idle client error', err.message, err.stack);
})

// let queryDoneCallback = (err, result) => {
//     if (err) {
//       console.log("query error", err.message);
//     } else {
//       console.log("result", result.rows );
//     }
//     pool.end();
// };

// let clientConnectionCallback = (err) => {

//   if( err ){
//     console.log( "error", err.message );
//   }

//   let text = "INSERT INTO todo (name) VALUES ($1) RETURNING id";

//   const values = process.argv[2]

//   pool.query(text, values, queryDoneCallback);
// };

// client.connect(clientConnectionCallback);

let ENV = process.argv[0];
let PATH = process.argv[1];
let operator = process.argv[2];
let item = process.argv[3];

if (operator == 'show') {

  const queryText = 'SELECT * FROM items Order By id';


  pool.query(queryText, (err, res) => {
    if (err) {
      console.log("Query Error", err.messages);
    }

    else {
      for ( let i = 0 ; i < res.rows.length ; i ++ ) {
        let output = `${res.rows[i].id}. ${res.rows[i].completion} - ${res.rows[i].item} ${res.rows[i].created_at} ${res.rows[i].updated_at}`
        console.log(output);
      }
    }
  })
}


if (operator == 'add') {
  const queryText = 'INSERT INTO items (completion, item) VALUES ($1, $2)';

  let values = [`[ ]`, `${item}`]

  pool.query(queryText,values, (err,res) => {
    if (err) {
      console.log("query error", err.message)
    }

    else {
      console.log("Added!");
    }
  })
}


if (operator == 'done') {
  const queryText = 'UPDATE items SET completion=$1 WHERE id =$2';
  const text = 'UPDATE items SET updated_at = now() WHERE id =$1';

  let values = [`[X]`, `${item}`]
  let values2 = [`${item}`]

  pool.query(queryText,values, (err,res) => {
    if (err) {
      console.log("query error", err.message)
    }

    else {
      pool.query(text,values2, (err, res) => {
        if (err) {
          console.log("query error", err.message)
        }

        else {
          console.log("Done!");
        }
      })
    }
  })
}


if (operator == 'archive') {
  const queryText = 'DELETE from items WHERE id =$1';

  let values = [`${item}`]

  pool.query(queryText,values, (err,res) => {
    if (err) {
      console.log("query error", err.message)
    }

    else {
      console.log("Deleted!");
    }
  })
}


if (operator == 'test') {
  console.log(moment().format('MMMM Do YYYY, h:mm:ss a'));
}

if (operator == 'complete-time') {

  const queryText = 'SELECT * FROM items Order By id';

  pool.query(queryText, (err, res) => {
    if (err) {
      console.log("query error", err.message);
    } 
    
    else {
            let timeDiff = res.rows.map((object,index)=>{
                return (object.updated_at - object.created_at)/60000
            })
            let positiveTimeDiff = timeDiff.filter((value,index)=>{
                if (timeDiff[index]>0){
                    return timeDiff[index];
                }
            })
            totalTime = positiveTimeDiff.reduce((total,b)=>{
                return total + b;
            })
            avgTime = totalTime/positiveTimeDiff.length;
            console.log(`${avgTime.toFixed(2)} minutes`)
    }
  })
}
