console.log("works!!", process.argv[2]);

const pg = require('pg');

const configs = {
    user: 'tengchoonhong',
    host: '127.0.0.1',
    database: 'todolist',
    port: 5432,
};

const client = new pg.Client(configs);

let commandType = process.argv[2];
let userInput = process.argv[3];

let queryDoneCallback = (err, result) => {
  if (err) {
    console.log("query error", err.message);
  } else {
    info()
    for (let i = 0; i < result.rows.length; ++i) {
      if (result.rows[i].completion === true) {
          x = 'X';
      } else {
          x = ' ';
      }
      console.log(`${result.rows[i].id}.    Completed    - [${x}] 
      Things to do - ${result.rows[i].todo} 
      Created at   - ${result.rows[i].created_at} 
      Last done at - ${result.rows[i].updated_at}`)
    }
    
  }
};

const add = () => {
  let addItem = `INSERT INTO items (completion, todo) VALUES($1, $2);`;
  const values = [false, userInput]

  client.query(addItem, values, queryDoneCallback);
};

const show = () => {
  let queryItem = `SELECT * FROM items;`;

  client.query(queryItem, queryDoneCallback);
};

const done = () => {
  let update = `UPDATE items SET completion = 'True' WHERE id = ${userInput};
  UPDATE items SET updated_at = now() WHERE id = ${userinput};
  ALTER SEQUENCE items_id_seq RESTART;
  UPDATE items SET id = DEFAULT;`;

  client.query(update, queryDoneCallback);
}

const remove = () => {
  let remove = `DELETE FROM items WHERE id = ${userInput};
  ALTER SEQUENCE items_id_seq RESTART;
  UPDATE items SET id = DEFAULT;`;

  client.query(remove, queryDoneCallback);
}

const info = () => {
  console.log(`  =======================================================================`)
  console.log(`       ██╗██╗   ██╗███████╗████████╗    ██████╗  ██████╗     ██╗████████╗`)
  console.log(`       ██║██║   ██║██╔════╝╚══██╔══╝    ██╔══██╗██╔═══██╗    ██║╚══██╔══╝`)
  console.log(`       ██║██║   ██║███████╗   ██║       ██║  ██║██║   ██║    ██║   ██║   `)
  console.log(`  ██   ██║██║   ██║╚════██║   ██║       ██║  ██║██║   ██║    ██║   ██║   `)
  console.log(`  ╚█████╔╝╚██████╔╝███████║   ██║       ██████╔╝╚██████╔╝    ██║   ██║   `)
  console.log(`   ╚════╝  ╚═════╝ ╚══════╝   ╚═╝       ╚═════╝  ╚═════╝     ╚═╝   ╚═╝   `)
  console.log(`  =======================================================================`)
}


let clientConnectionCallback = (err) => {
  if( err ){
    console.log( "error", err.message );
  }

  switch(commandType.toLowerCase()) {
    case "add": add();
    break;
    case "show": show();
    break;
    case "done": done();
    break;
    case "delete": remove();
    break;
    default: break;
  }
};

client.connect(clientConnectionCallback);
