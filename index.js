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

// moment
const mo = require('moment');

// global variables
let connected = false;

// sql functions
const connectSql = function () {
  connected = true;
  return client.connect();
};

const checkConnection = async function () {
  if (!connected) {
    await connectSql();
  }
};

const makeIdMap = async function () {
  let query = "SELECT id, archived FROM items ORDER BY id";
  let results = await client.query(query);
  let items = results.rows.filter(e => e.archived === false);

  let idMap = {};
  for (let i = 1; i <= items.length; i++) {
    idMap[i] = items[i-1].id;
  }

  return idMap;
};

// todo manipulation functions
const showItems = async function () {
  checkConnection();

  let query = "SELECT * FROM items ORDER BY id";
  let results = await client.query(query);
  let items = results.rows.filter(e => e.archived === false);

  let idMap = {};
  for (let i = 1; i <= items.length; i++) {
    idMap[i] = items[i-1].id;
  }

  let heading = [
    "S/N",
    "Done".padEnd(4),
    "Item".padEnd(29, " "),
    "Created at".padEnd(20, " "),
    "Updated at".padEnd(20, " "),
  ];
  console.log("\n", heading.join(" "));
  console.log("-".repeat(80));

  for (let num in idMap) {
    let item = items.filter(e => e.id === idMap[num])[0];
    let index = String(num).padStart(3, " ");
    let done = item.done ? "[x] " : "[ ] ";
    let title = item.name.padEnd(29, " ");
    let cDateObj = new Date(item.created);
    let cDateStr = mo(cDateObj).fromNow().padEnd(20);
    let uDateObj = (item.updated === null) ? "" : new Date(item.updated);
    let uDateStr = parseDate(uDateObj).padEnd(20);
    console.log(index, done, title, cDateStr, uDateStr);
  }

  console.log("-".repeat(80));

  rl.prompt();
};

const addItem = async function (line) {
  checkConnection();

  let args = line.split(" ");
  let item = args.splice(1, args.length - 1).join(" ");
  let values = [item, false, mo().format(), false];
  let query =
      "INSERT INTO items (name, done, created, archived) " +
      "VALUES ($1, $2, $3, $4) RETURNING id";
  let results = await client.query(query, values);

  showItems();
};

const archiveItem = function () {
  console.log("archive item");
  return;
};

const archiveItem = async function (line) {
  checkConnection();

  let args = line.split(" ");
  let idMap = await makeIdMap();
  let archiveId = args.splice(1, args.length - 1).join(" ");
  let value = [idMap[archiveId]];
  let query =
      "UPDATE items " +
      "SET archived = true " +
      "WHERE id = $1";

  await client.query(query, value);
  showItems();
  return;
};

const getStat = function () {
  console.log("get stats");
  return;
};

// help display
const showHelp = function () {
  console.log(
    "Usage:\n" +
      "show: show all items in list\n" +
      "add 'string': add an item named string\n" +
      "done <num>: mark item <num> done\n" +
      "archive <num>: archive item <num>\n" +
      "stats [comp-time|add-time|best-worst|add-bet|done-bet]: get stats\n" +
      "help: show this help"
  );
  rl.prompt();
};

const despatch = {
  "help": showHelp,
  "show": showItems,
  "add": addItem,
  "done": markDone,
  "archive": archiveItem,
  "stats": getStat
};

// main program
rl.prompt();

rl.on('line', (line) => {
  line = line.trim();
  let command = line.split(" ")[0];
  if (command.toLowerCase() === 'q') {
    console.log("\nQuit\n");
    process.exit(0);
  } else if (despatch[command.toLowerCase()] === undefined) {
    command = "help";
  }

  despatch[command](line);

}).on('close', () => {
  process.exit(0);
});
