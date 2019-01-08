console.log("works!!", process.argv[2]);

let input = process.argv[2];
let inputDone = process.argv[3];
let inputId = parseInt(inputDone);
let inputArr = [];
for(let i = 3; i < process.argv.length; i++){
    inputArr.push(process.argv[i]);
}

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

      let text = 'SELECT * FROM items ORDER BY id ASC';

      client.query(text, (err, result) => {
        if (err) {
          console.log("query error", err.message);
        } else {
            console.log("Updated todo-list:- ");
            for(let i = 0; i < result.rows.length; i++){
                if(result.rows[i].complete === false){
                    console.log(result.rows[i].id + ":", "[ ]" + " ", result.rows[i].name, " " + result.rows[i].created_at, " " + result.rows[i].updated_at);
                }
                else if(result.rows[i].complete === true){
                    console.log(result.rows[i].id + ":", "[X]" + " ", result.rows[i].name, " " + result.rows[i].created_at, " " + result.rows[i].updated_at);
                }
            }
        }
      });

    });
};

let queryFinCallback = (err) => {
    client.connect((err) => {

      if( err ){
        console.log( "error", err.message );
      }

      let text = `UPDATE items SET complete = 'true', updated_at = 'now()' WHERE id = ${inputId}`;

      client.query(text, (err, result) => {
        if (err) {
          console.log("query error", err.message);
        } else {
            console.log("Item updated:- ");
            for(let i = 0; i < result.rows.length; i++){
                if(result.rows[i].complete === false){
                    console.log(result.rows[i].id + ":", "[ ]" + " ", result.rows[i].name);
                }
                else if(result.rows[i].complete === true){
                    console.log(result.rows[i].id + ":", "[X]" + " ", result.rows[i].name);
                }
            }
        }
      });
    });
};

let queryDelCallback = (err) => {
    client.connect((err) => {

      if( err ){
        console.log( "error", err.message );
      }

      let text = `DELETE from items WHERE id = ${inputId} RETURNING *`;

      client.query(text, (err, result) => {
        if (err) {
          console.log("query error", err.message);
        } else {
            console.log("Item deleted:- ");
            for(let i = 0; i < result.rows.length; i++){
                if(result.rows[i].complete === false){
                    console.log(result.rows[i].id + ":", "[ ]" + " ", result.rows[i].name);
                }
                else if(result.rows[i].complete === true){
                    console.log(result.rows[i].id + ":", "[X]" + " ", result.rows[i].name);
                }
            }
        }
        queryRsCallback();
      });
    });
};

let queryRsCallback = (err) => {
      let alter = `ALTER SEQUENCE items_id_seq RESTART`;

      client.query(alter, queryUpdCallback);
};

let queryUpdCallback = (err) => {
      let update = `UPDATE items set id = default;`;

      client.query(update);
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

  let text = "INSERT INTO items (name, complete, created_at) VALUES ($1, $2, $3) RETURNING *";

  let inputStr = inputArr.join(' ');
  let outputStr = inputStr.charAt(0).toUpperCase() + inputStr.slice(1)

  let today = new Date();
  let dd = today.getDate();
  let mm = today.getMonth() + 1;

  let yyyy = today.getFullYear();
    if (dd < 10) {
        dd = '0' + dd;
    }
    if (mm < 10) {
      mm = '0' + mm;
    }
  today = dd + '/' + mm + '/' + yyyy;

  const values = [outputStr, false, today];

  client.query(text, values, queryDoneCallback);
};

if(input === "add"){
    client.connect(clientConnectionCallback);
}
else if(input === "show"){
    queryShowCallback();
}
else if(input === "done"){
    queryFinCallback();
}
else if(input === "delete"){
    queryDelCallback();
}
else{
    console.log("Error! No such command");
}