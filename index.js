
const pg = require('pg');

const configs = {
    user: 'weizheng1910',
    host: '127.0.0.1',
    database: 'todo',
    port: 5432,
};

const client = new pg.Client(configs);

// External Functions

function showDoneYet(doneYet) {
  if(doneYet == false){
    return "[ ]"
  } else {
    return "[X]"
  }
}

//`${result.rows.id}. ${showDoneYet(result.rows.doneYet)} ${result.rows.name}`
// End External Functions

let queryDoneCallback = (err, result) => {
    if (err) {
      console.log("query error", err.message);
    } else {
      console.log("Task inserted!");
      console.log("Current data: ")
    }
};

let queryDoneCallback2 = (err, result) => {
    if (err) {
      console.log("query error", err.message);
    } else {
      for(let i = 0; i < result.rows.length; i++){
        console.log(`${i + 1}. ${showDoneYet(result.rows[i].doneyet)} ${result.rows[i].name}`)
      }
    }
    client.end();
};

let clientConnectionCallback = (err) => {

  if( err ){
    console.log( "error", err.message );
  }

  let newTask = process.argv[3];

  // Query Strings 
  let text = "INSERT INTO items (name,doneYet) VALUES ($1,$2) RETURNING *";
  let text2 = "SELECT * from items"
  let 

  const values = [newTask,false];

  

  switch(process.argv[2]){
    case("show"):
      client.query(text2,queryDoneCallback2)
      break;
    case("add"):
      client.query(text, values, queryDoneCallback);
      client.query(text2,queryDoneCallback2);
      break;
    default:
    console.log("hey");
      break;
  }

  
};

client.connect(clientConnectionCallback);
