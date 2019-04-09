// console.log("works!!", process.argv[2]);

const pg = require('pg');

const configs = {
    user: 'Daniyyal',
    host: '127.0.0.1',
    database: 'todo',
    port: 5432,
};

const client = new pg.Client(configs);

var add = function (newItem) {
   const onQueryFinished = (err, result) => {
    if (err) {
      console.log("query error", err.message);
    } else {
        for(let i = 0; i<result.rows.length; i++){
      console.log("result:", result.rows[i] );
    }
  }
};

const onConnectServer = (err) => {

  if( err ){
    console.log( "error", err.message );
  }

  let queryText = 'INSERT INTO todo (done, plans) VALUES ($1, $2) RETURNING id';

  const values = ["nothing", newItem];

  client.query(queryText, values, onQueryFinished);
};

client.connect(onConnectServer);
}



var show = function () {
   const onQueryFinished = (err, result) => {
    if (err) {
      console.log("query error", err.message);
    } else {
        for(let i = 0; i<result.rows.length; i++){
            if (result.rows[i].done == "undone") {
      console.log( result.rows[i].id + ". [ ] - " + result.rows[i].plans );
    }else if ( result.rows[i].done == "done"){
        console.log( result.rows[i].id + ". [x] - " + result.rows[i].plans );
    }
}
  }
};

const onConnectServer = (err) => {

  if( err ){
    console.log( "error", err.message );
  }

  let queryText = 'SELECT * FROM todo ORDER BY id';


  client.query(queryText, onQueryFinished);
};

client.connect(onConnectServer);
}