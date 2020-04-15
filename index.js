console.log("works!!", process.argv[2]);

const pg = require('pg');

const configs = {
    user: 'postgres',
    host: '127.0.0.1',
    database: 'todo',
    port: 5432,
};

const client = new pg.Client(configs);

let queryDoneCallback = (err, result) => {
    if (err) {
      console.log("query error", err.message);
    }
    else {
      console.log(result.rows);
      console.log(
        `
 ____  _____  ____    __    ____  ___  ____
(  _ \\(  _  )(  _ \\  (  )  (_  _)/ __)(_  _)
 ) _ < )(_)(  ) _ <   )(__  _)(_ \\__ \\  )(
(____/(_____)(____/  (____)(____)(___/ (__)

        `
        );
        result.rows.forEach(el => {
            console.log(`
${el.id}. ${el.name} - [${el.done}]
created_at: ${el.created_date}
updated_at: ${el.updated_date}
            `);
        })
    }
    client.end();
};

let clientConnectionCallback = (err) => {

  if( err ){
    console.log( "Connection callback error", err.message );
  }
  else if (process.argv[2] === 'show'){
    let text = "select * from items";

    client.query(text, queryDoneCallback);
  }
  else if (process.argv[2] === 'add'){
    let text = "insert into items (name, done) values ($1, $2) returning id";

    const values = [process.argv[3], " "];

    client.query(text, values, (err, result) => {
        if (err) {
            console.log("query error: " + err)
        }
        else{
            console.log("Successfully Added!")
        }

        client.end();
    });
  }

  else if(process.argv[2] === 'done'){
    let text = `update items set done='X' where id=${process.argv[3]}`;

    client.query(text, (err, result) => {
        if (err) {
            console.log("query error: " + err)
        }
        else{
            console.log("Update Successful!")
        }

        client.end();
    })
  }

};

client.connect(clientConnectionCallback);