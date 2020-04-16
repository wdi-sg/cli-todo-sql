console.log("works!!", process.argv[2]);

const pg = require('pg');

const configs = {
    user: 'postgres',
    host: '127.0.0.1',
    database: 'todo',
    port: 5432,
};

const client = new pg.Client(configs);

// For showing items in the todolist
let queryDoneCallback = (err, result) => {

};

let clientConnectionCallback = (err) => {

  if( err ){
    console.log( "Connection callback error", err.message );
  }
  // Show items in todo list
  else if (process.argv[2] === 'show'){
    let text = "select * from items";

    client.query(text, (err, result) => {
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
    });
  }
  // Add items in todo list
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
  // Mark item as done
  else if(process.argv[2] === 'done'){
    const updatedDate = `TO_CHAR(NOW() :: DATE, 'dd/mm/yyyy')`;

    let text = `update items set done='X', updated_date=${updatedDate} where id=${process.argv[3]}`;

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
  // Archive item by copying row into another table and deleting from current table
  else if (process.argv[2] === 'archive'){
    let text1 = `insert into archive (select * from items where id=${process.argv[3]})`;

    let text2 = `delete from items where id=${process.argv[3]}`;

    // Insert archived data into separate archive table
    client.query(text1, (err, result) => {
        if (err) {
            console.log("query error: " + err)
        }
        else{
            console.log("insert into archive table Successful!")
        }
    })

    // Delete archive data from items table
    client.query(text2, (err, result) => {
        if (err) {
            console.log("query error: " + err)
        }
        else{
            console.log("delete from items table Successful!")
        }
        client.end();
    })
  }


};

client.connect(clientConnectionCallback);