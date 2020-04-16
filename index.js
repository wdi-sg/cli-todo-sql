
const pg = require('pg');

const configs = {
    user: 'Mac',
    host: '127.0.0.1',
    database: 'todo',
    port: 5432,
};

const client = new pg.Client(configs);

///////////////////////////////////////////////

const user_command = process.argv[2];
const input_index = process.argv[3];


const renderList = function(res){
  const list = res.rows;
  list.forEach(obj => console.log(`${obj.id}. ${obj.done} - ${obj.thing}`));
}

//callback function after sending query
const queryDoneCallback = (err, res) => {
    if (err) {
      console.log("query error", err.message);
    } else {
      // console.log(res.rows);
      renderList(res);
    }
    client.end();
};


//callback function after successful connection
const clientConnectionCallback = (err) => {
  let queryText = undefined;
  let values = undefined;

  if( err ){
    console.log( "error", err.message );
  }

  if (user_command === 'add'){
    queryText = 'INSERT INTO todolist (thing, done) VALUES ($1, $2) RETURNING';
    values = [process.argv[3], '[ ]']; 

  } else if (user_command === 'show'){
    queryText = 'SELECT * FROM todolist;';
  } else if (user_command === 'done'){
    queryText = `UPDATE todolist SET done = '[X]' WHERE id = ${input_index}`;
  }

  //send query after connection
  client.query(queryText, values, queryDoneCallback);
};

//connects to pg with a callback function
client.connect(clientConnectionCallback);
