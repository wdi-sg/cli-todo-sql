// console.log("works!!", process.argv[2]);
//#!/usr/bin/env node
const pg = require('pg');

const configs = {
    user: 'siangeeeo',
    host: '127.0.0.1',
    database: 'todo',
    port: 5432,
};

const client = new pg.Client(configs);
const COMMAND = (process.argv[2]);
const ACTIVITY = (process.argv[3]); //takes a string (in the case of add and delete; or a number (in the case of DONE)

let queryDoneCallback = (err, result) => {
  if (err) {
      console.log("query error", err.message);
  }else{
    if (result.rows.length == 1){
      console.log(result.rows[0].id+". "+result.rows[0].completion+ " - " + result.rows[0].name);
    }
    else if(result.rows.length>1){
      for (let i = 0; i<result.rows.length;i++){
      console.log(result.rows[i].id + ". " + result.rows[i].completion + " - " + result.rows[i].name);
      };
    };
  };
};


let clientConnectionCallback = (err) => {

  let today = new Date();  //source: https://stackoverflow.com/questions/1531093/how-do-i-get-the-current-date-in-javascript
  let dd = String(today.getDate()).padStart(2, '0');
  let mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
  let yyyy = today.getFullYear();
  today = dd + '/' + mm + '/' + yyyy;

  if( err ){
    console.log( "error", err.message );
  }

  // let text = "SELECT * FROM items RETURNING id";

  // const values = ["hello"];

  // client.query(text, queryDoneCallback);
// };

  if (COMMAND === "show"){

      let text = "SELECT * FROM items";

      client.query(text, queryDoneCallback);
  }

  if (COMMAND === "add"){

      let text = "INSERT INTO items (completion, name, created_at, updated_at) VALUES ($1, $2, $3, $4) RETURNING *";

      let values =["[]", ACTIVITY, today,"[]"]; //user should insert new item in quotes

      client.query(text, values, queryDoneCallback);
  }

  if(COMMAND === "delete"){

      let text = "DELETE FROM items WHERE id=$1 RETURNING *";

      let values = [ACTIVITY];

      client.query(text, values, queryDoneCallback);
  }

  if(COMMAND == "done"){

    let text = "UPDATE items SET completion=$1, updated_at=$2 WHERE id=$3 RETURNING *";

    let values = ["[x]", today, ACTIVITY];

    client.query(text, values, queryDoneCallback);
  }

  if(COMMAND == "undone"){

    let text = "UPDATE items SET completion=$1 WHERE id=$2 RETURNING *";

    let values = ["[]", ACTIVITY];

    client.query(text, values, queryDoneCallback);
  }

  if(COMMAND == "help"){
    console.log("show: displays the items db");
    console.log("add_space_'activity_name': creates a new row in db with activity name");
    console.log("done_space_idNumber: assigns a cross to that row signifying completion");
    console.log("undone_space_idNumber: removes cross that was previously assigned");
    console.log("delete_space_idNumber: removes that row from the db");
  }

// let clientConnectionCallback = (err) => {
//
//   if( err ){
//     console.log( "error", err.message );
//   }
//
//   let text = "INSERT INTO items (name) VALUES ($1) RETURNING id";
//
/* // const values = ["hello"];
//   const values = ["process.argv[2]"]; */
//
//   client.query(text, values, queryDoneCallback);
// };
//
// if (values == "show"){
//     client.connect(clientConnectionCallback);
}
client.connect(clientConnectionCallback);
