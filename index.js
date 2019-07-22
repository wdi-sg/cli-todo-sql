/*
 * ===================================
 * Initialisation
 * ===================================
 */

const pg = require('pg');
var program = require('commander');

const configs = {
    user: 'postgres',
    host: '127.0.0.1',
    database: 'todo',
    port: 5432
};

const client = new pg.Client(configs);

client.connect(function (err) {
  if( err ){
    console.log( "error", err.message );
  }
});  

/*
 * ===================================
 *  Main Display Function
 * ===================================
 */



var display = function (listArray){
    console.log(`
 .d8888b.  888      8888888      88888888888 .d88888b.         8888888b.   .d88888b.       888      8888888 .d8888b. 88888888888 
d88P  Y88b 888        888            888    d88P" "Y88b        888  "Y88b d88P" "Y88b      888        888  d88P  Y88b    888     
888    888 888        888            888    888     888        888    888 888     888      888        888  Y88b.         888     
888        888        888            888    888     888        888    888 888     888      888        888   "Y888b.      888     
888        888        888            888    888     888        888    888 888     888      888        888      "Y88b.    888     
888    888 888        888            888    888     888 888888 888    888 888     888      888        888        "888    888     
Y88b  d88P 888        888            888    Y88b. .d88P        888  .d88P Y88b. .d88P      888        888  Y88b  d88P    888     
 "Y8888P"  88888888 8888888          888     "Y88888P"         8888888P"   "Y88888P"       88888888 8888888 "Y8888P"     888     
                                                                                                                                 
================================================================================================================================
  
  List of commands:
  1. List To-Do List [node index.js show] 
  2. Add item into To do List [node index.js add {item}] 
  3. Mark item done [node index.js done {id}]
  4. Delete item [node index.js remove {id}]

================================================================================================================================

The following is your to-do list:
"Format: Id. ['done'] - List | Created Date | Updated Date "
..............................................................`)

    //sort by ID
    listArray.sort(function (a,b) {
    return a.id - b.id;
    });

    //Print items
    listArray.map(item => {
    let done = (item.completion) ? 'x' : ' ';
    let createdDate = String(item.created_at).slice(0,14);
    let updatedDate = (item.updated_at === null) ? ' ' : String(item.updated_at).slice(0,14); 

    console.log(`${item.id}. [${done}] - ${item.name} | ${createdDate} | ${updatedDate}`)
    })
    console.log('');
};

/*
 * ===================================
 *  CLIENT QUERY FUNCTIONS
 * ===================================
 */

let showListQueryCallback = (err, result) => {
    if (err) {
      console.log("query error", err.message);
    } else {
      display(result.rows);
      process.exit();
    }
};

let updateDoneQueryCallback = (err, result) => {
    if (err) {
      console.log("query error", err.message);
    }
  };

let queryCallback = (err, result) => {
    if (err) {
      console.log("query error", err.message);
    } else {
      let allItem = 'SELECT * FROM items';

      client.query(allItem, showListQueryCallback);
    }
};


/*
 * ===================================
 *  COMMAND NPM PROGRAMMES
 * ===================================
 */

//list all items
program
  .command('show')
  .alias('s')
  .description('List all items in To-Do List.')

  .action(function (){
    
    let allItem = 'SELECT * FROM items';

    client.query(allItem, showListQueryCallback);

  });

//add item to list
program
  .command('add <item>')
  .alias('a')
  .description('Add item to To-Do List.')

  .action(function (item){

    let newItem = `INSERT INTO items (name, completion, created_at, updated_at) VALUES ('${item}',FALSE,CURRENT_DATE,NULL)`;
    

    client.query(newItem, queryCallback);

  });

//Mark Done
program
  .command('done <id>')
  .alias('d')
  .description('Mark Item Done on List.')

  .action(function (id){

    let updateDone = `UPDATE items SET completion=TRUE  WHERE id = '${id}'`;
    let updateDate = `UPDATE items SET updated_at=CURRENT_DATE WHERE id = '${id}'`;

    client.query(updateDone, updateDoneQueryCallback);
    client.query(updateDate, queryCallback);

  });

//Remove Item
program
  .command('remove <id>')
  .alias('r')
  .description('Remove Item from list.')

  .action(function (id){
 
    let removeItem = `DELETE FROM items WHERE id = '${id}'`;

    client.query(removeItem, queryCallback);
  });

program.parse(process.argv);
