// console.log("works!!", process.argv[2]);

const pg = require('pg');

const configs = {
    user: 'thomasoh',
    host: '127.0.0.1',
    database: 'todo',
    port: 5432,
};

const client = new pg.Client(configs);

//Helper Function to Create Date
let createDate = () => {
    let today = new Date();
    let dd = String(today.getDate()).padStart(2, '0');
    let mm = String(today.getMonth() + 1).padStart(2, '0');
    let yyyy = today.getFullYear();
    today = dd + '/' + mm + '/' + yyyy;
    return today
}

//Callback function to display results or error
let queryDoneCallback = (err, res) => {
    if (err) {
      console.log("query error", err.message);
    } else {
      //loop through res.rows
      for (let i = 0; i < res.rows.length; i++){
            //Formatting of output
          let brackets = "[ ]"
          if (res.rows[i].done == "yes") {
            brackets = "[x]"
          }

          let updatedTime = "";
          if (res.rows[i].updated_at != null){
            updatedTime = " - Updated at: " + res.rows[i].updated_at
          }

          let display = res.rows[i].id + ". " + brackets + " - " + res.rows[i].name + " - Created at: " + res.rows[i].created_at + updatedTime;
          console.log(display);
      }
    }
    client.end();
};


//Main function to manipulate database
let clientConnectionCallback = (err) => {

  if( err ){
    console.log( "error", err.message );
  }
  let values = [];
  let text = "";
  //Show Functionality
  if (process.argv[2] === "show"){
    text = "SELECT * FROM items ORDER BY id ASC"
    client.query(text, queryDoneCallback);
  }
  //Add Functionality
  else if (process.argv[2] === "add"){
    values = [process.argv[3]];
    text = "INSERT INTO items (name) VALUES ($1)";
    client.query(text, values);
    text = "SELECT * FROM items ORDER BY id ASC"
    client.query(text, queryDoneCallback);
  }
  //Done Functionality
  else if (process.argv[2] === "done"){
    values = [parseInt(process.argv[3])];
    text = "UPDATE items SET done='yes', updated_at=CURRENT_TIMESTAMP WHERE id=$1";
    client.query(text, values);
    text = "SELECT * FROM items ORDER BY id ASC"
    client.query(text, queryDoneCallback);
  }
  //Delete Functionality
  else if (process.argv[2] === "archive"){
    values = [parseInt(process.argv[3])];
    text = "DELETE from items WHERE id=$1";
    client.query(text, values);
    text = "SELECT * FROM items ORDER BY id ASC"
    client.query(text, queryDoneCallback);
  }
  //
  else {
    console.log("input: node todo.js [show/add/done/archive] [item number]")
  }

};

client.connect(clientConnectionCallback);