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
  process.exit();
};

const add = () => {
  let addItem = `INSERT INTO items (completion, todo) VALUES($1, $2);`;
  const values = [false, userInput]

  client.query(addItem, values, show);
};

const show = () => {
  let queryItem = `SELECT * FROM items;`;

  client.query(queryItem, queryDoneCallback);
};

const done = () => {
  let update = `UPDATE items SET completion = 'True', updated_at = now() WHERE id = ${userInput};
  ALTER SEQUENCE items_id_seq RESTART;
  UPDATE items SET id = DEFAULT;`;
  client.query(update, show);
}

const remove = () => {
  let remove = `DELETE FROM items WHERE id = ${userInput};
  ALTER SEQUENCE items_id_seq RESTART;
  UPDATE items SET id = DEFAULT;`;

  client.query(remove, show);
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
  console.log(`   Use the following commands:`)
  console.log(`   1: node todo.js add " "`)
  console.log(`   2: node todo.js show`)
  console.log(`   3: node todo.js done #`)
  console.log(`   4: node todo.js delete #`)
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
