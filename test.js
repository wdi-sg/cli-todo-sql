const pg = require('pg');
const mo = require('moment');

const configs = {
    user: 'dwu',
    host: '127.0.0.1',
    database: 'todo',
    port: 5432,
};

const client = new pg.Client(configs);

const items = [
  ['Buy snacks', true, `${mo().subtract(7, 'days').format()}`, `${mo().subtract(6, 'days').format()}`, false],
  ['Buy beers', true, `${mo().subtract(7, 'hours').format()}`, `${mo().subtract(6, 'hours').format()}`, false],
  ['Buy comics', true, `${mo().subtract(7, 'minutes').format()}`, `${mo().subtract(6, 'minutes').format()}`, false],
  ['Buy meals', true, `${mo().subtract(7, 'months').format()}`, `${mo().subtract(6, 'months').format()}`, false],
  ['Buy more snacks', false, `${mo().subtract(1, 'days').format()}`, null, false],
  ['Buy more beers', false, `${mo().subtract(2, 'days').format()}`, null, false],
  ['Buy more beers', false, `${mo().subtract(3, 'days').format()}`, null, false],
  ['Buy more beers', false, `${mo().subtract(4, 'days').format()}`, null, false]
];

const createTable = function () {
  console.log("create");
  client.query(
    "CREATE TABLE items (id SERIAL PRIMARY KEY," +
      "name TEXT," +
      "done BOOLEAN," +
      "created TIMESTAMP," +
      "updated TIMESTAMP," +
      "archived BOOLEAN)")
    .then()
    .catch(err => handleErr(err));
};

const popTable = function () {
  let promises = [];
  for (let item of items) {
    let values = item;
    let query = "INSERT INTO items (name, done, created, updated, archived) VALUES ($1, $2, $3, $4, $5)";
    promises.push(client.query(query, values));
  }
  console.log("---- disconnecting");
  return Promise.all(promises);
};

const resetList = function () {
  client.query("DROP TABLE IF EXISTS items")
    .then(createTable)
    .then(popTable)
    .then(() => { client.end(); })
    .then(() => { console.log("disco"); })
    .catch(err => handleErr(err));
};

const handleErr = function (err) {
  console.log("error:", err);
};

client.connect()
  .then(resetList)
  .catch(err => handleErr(err));
