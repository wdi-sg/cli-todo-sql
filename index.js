// console.log("works!!", process.argv[2]);

const pg = require('pg');

const configs = {
    user: 'siangeeeo',
    host: '127.0.0.1',
    database: 'todo',
    port: 5432,
};

const client = new pg.Client(configs);
let command = String(process.argv[2]);
let activity = String(process.argv[3]);

let queryDoneCallback = (err, result) => {
    if (err) {
      console.log("query error", err.message);
    } else {
      for (let i = 0; i<result.rows.length;i++){
      console.log(result.rows[i].id + ". " + result.rows[i].completion + " - " + result.rows[i].name+ " - "+result.rows[i].created_at+" - "+result.rows[i].udpated_at);
      }
    }
};

let clientConnectionCallback = (err) => {

  if( err ){
    console.log( "error", err.message );
  }

  // let text = "SELECT * FROM items RETURNING id";

  // const values = ["hello"];

  // client.query(text, queryDoneCallback);
// };

  if (command === "show"){

      let text = "SELECT * FROM items";

      client.query(text, queryDoneCallback);
  }

  if (command === "add"){
    let today = new Date();  //source: https://stackoverflow.com/questions/1531093/how-do-i-get-the-current-date-in-javascript
    let dd = String(today.getDate()).padStart(2, '0');
    let mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    let yyyy = today.getFullYear();

    today = dd + '/' + mm + '/' + yyyy;

      let text = "INSERT INTO (completion, name, created_at, updated_at) VALUES ($1, $2, $3, $4)";

      let values =["[]", activity, today,"[]"]; //user should insert new item in quotes

      client.query(text, values, queryDoneCallback);
  }

  if(command === "delete"){

      let text = "DELETE FROM items WHERE name=$1 RETURNING *";

      let values = [activity];

      client.query(text, values, queryDoneCallback);
  }

// let clientConnectionCallback = (err) => {
//
//   if( err ){
//     console.log( "error", err.message );
//   }
//
//   let text = "INSERT INTO items (name) VALUES ($1) RETURNING id";
//
//   // const values = ["hello"];
//   const values = ["process.argv[2]"];
//
//   client.query(text, values, queryDoneCallback);
// };
//
// if (values == "show"){
//     client.connect(clientConnectionCallback);
}
client.connect(clientConnectionCallback);
