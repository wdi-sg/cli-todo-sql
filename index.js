// node-postgres config
const pg = require('pg');
const configs = {
    user: 'dwu',
    host: '127.0.0.1',
    database: 'todo',
    port: 5432,
};
const client = new pg.Client(configs);

const handleError = function (err) {
  console.log("Connect error:", err);
};

// readline config
const readline = require('readline');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  prompt: "What would you like to do? "
});

  if( err ){
    console.log( "error", err.message );
  }

  let text = "INSERT INTO todo (name) VALUES ($1) RETURNING id";

  const values = ["hello"];

const despatch = {
  "help": showHelp,
  "show": showItems,
  "add": addItem,
  "done": markDone,
  "stats": getStat
};

// main program
rl.prompt();

rl.on('line', (line) => {
  line = line.trim();
  if (line.toLowerCase() === 'q') {
    console.log("\nQuit\n");
    process.exit(0);
  } else if (despatch[line.toLowerCase()] === undefined) {
    console.log(line);
    line = "help";
  }

  despatch[line]();

}).on('close', () => {
  process.exit(0);
});
