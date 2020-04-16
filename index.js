console.log("works!!", process.argv[2]);

const pg = require('pg');

const configs = {
    user: 'ari',
    host: '127.0.0.1',
    database: 'todo',
    port: 5432,
};

const client = new pg.Client(configs);

let queryDoneCallback = (err, result) => {
    if (err) {
      console.log("query error", err.message);
    } else {
      // console.log("result", result.rows );
    let queryText = 'SELECT * FROM items';
    client.query(queryText, (err, res) => {
      if (err) {
        //Throw connection terminated error
        if(err.message != "Connection terminated"){
          console.log("query error", err.message);
        }
      } else {
        // iterate through all of your results:
        var outList = "";
        for (let i = 0; i < res.rows.length; i++) {
          var record = res.rows[i];
          if (record.done == false) {
            var string = `${i + 1}. [ ] - ${record.name}\n`;
            outList += string;
          } else {
            var string = `${i + 1}. [X] - ${record.name}\n`;
            outList += string;
          }
        }
        console.log(outList);
      }
      client.end();

    });
  }

};

let clientConnectionCallback = (err) => {

  if( err ){
    console.log( "error", err.message );
  }

  let text = "INSERT INTO todo (name) VALUES ($1) RETURNING id";

  const values = ["hello"];

  client.query(text, values, queryDoneCallback);
};

client.connect(clientConnectionCallback);
