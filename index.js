console.log(process.argv[2]);

const pg = require('pg');

const configs = {
    user: 'claireseah',
    host: '127.0.0.1',
    database: 'todo',
    port: 5432,
};

const client = new pg.Client(configs);

/* ===== BOILERPLATE CODE PROVIDED ===== */

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
  }

  // let text = "INSERT INTO todo (name) VALUES ($1) RETURNING id";

  // const values = ["hello"];

/* === DELIVERABLES ===
1. Create a function that allows you to see the list when you type "node index.js show" into command line. 
  - Write an if statement that allows you to access the items table and print it. */

  if (process.argv[2] === "list") {
    let text = "SELECT FROM * items ORDER BY id";
    client.query(text, queryDoneCallback);
  };
/* 
2. Insert new task onto the list. 
  - Write an if statement that allows you to insert new data in to the table. */

  if(process.argv[2] === "insert") {
    let text = `INSERT INTO items (task) VALUES ('${process.argv[3]}');`;
    client.query(text, queryDoneCallback);
  };
/* 
3. Mark the tasks completed as done. 
   - Write an if statement that allows you to update the status column in my table. */

   if (process.argv[2] === "done") {
    let text = `UPDATE items SET status = 'done' WHERE id ='${process.argv[3]}';`;
    client.query(text, queryDoneCallback);
   };
/* 
===========================================================================================================
4. Add a new column called created_at with data type date and display the date and time the item was added. 
=========================================================================================================== 
*/   

/*
5. Add the ability to permanently delete an item.
  - Here write an if statement that would permamently remove an item from the table depending on the id. */

  if (process.argv[2] === "delete") {
    let text = `DELETE FROM items WHERE id ='${process.argv[3]}';`;
    client.query(text, queryDoneCallback);
  };
/*
=========================================================================================================
6. Add a cloumn named 'updated at' with the data type and display the date the item was marked completed. 
=========================================================================================================
*/

};

client.connect(clientConnectionCallback);







