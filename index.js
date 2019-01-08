console.log("works!!", process.argv[2]);

let input = process.argv[2];
let inputArr = [];
for(let i = 3; i < process.argv.length; i++){
    inputArr.push(process.argv[i]);
}
console.log(inputArr)

const pg = require('pg');

const configs = {
    user: 'sean',
    host: '127.0.0.1',
    database: 'todo',
    port: 5432,
};

const client = new pg.Client(configs);

let queryShowCallback = (err) => {
    client.connect((err) => {

      if( err ){
        console.log( "error", err.message );
      }

      let text = 'SELECT * FROM items';

      client.query(text, (err, result) => {
        if (err) {
          console.log("query error", err.message);
        } else {
            for(let i = 0; i < result.rows.length; i++){
                console.log(result.rows[i].id + ":", result.rows[i].name);
            }
        }
      });

    });
};

let queryDoneCallback = (err, result) => {
    if (err) {
      console.log("query error", err.message);
    } else {
      console.log("Information added into todo-list -->", result.rows );
    }
};

let clientConnectionCallback = (err) => {

  if( err ){
    console.log( "error", err.message );
  }

  let text = "INSERT INTO items (name) VALUES ($1) RETURNING *";

  let inputStr = inputArr.join(' ');

  const values = [inputStr];

  client.query(text, values, queryDoneCallback);
};

if(input === "add"){
    client.connect(clientConnectionCallback);
}
else if(input === "show"){
    queryShowCallback();
}
else{
    console.log("Error");
}