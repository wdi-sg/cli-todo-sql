console.log("works!!", process.argv[2]);

const pg = require('pg');

const configs = {
    user: 'postgres',
    host: '127.0.0.1',
    database: 'todo',
    port: 5432,
    password: 'postgres'
};

const client = new pg.Client(configs);

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

  // let text = 'INSERT INTO items (name) VALUES ($1) RETURNING id';

  // const values = ["go shopping"];
  // ["go shopping","feed dog","swim practice","code app","meet gabriel"];
  let text;
  const entry = process.argv[3];

  switch(process.argv[2])
  {
    case 'show' :
        text = 'SELECT * FROM items';
        client.query(text,queryDoneCallback);
        break;
    case 'add':        
        text = 'INSERT INTO items (name) VALUES ($1) RETURNING id';        
        client.query(text,entry,queryDoneCallback);
        break;
       

  }

  //client.query(text, values, queryDoneCallback);
};



client.connect(clientConnectionCallback);
