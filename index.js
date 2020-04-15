// Initialisation
const pg = require('pg');

const configs = {
  user: 'qunda',
  host: '127.0.0.1',
  database: 'todo',
  port: 5432,
};

const client = new pg.Client(configs);



// Code
const queryType = process.argv[2].toLowerCase();

client.connect((error) => {
  if (error) {
    console.log('connection error: ', error.message);
  }

  switch (queryType) {
    case 'show':
    {
      let queryText = 'SELECT * FROM items ORDER BY id';

      client.query(queryText, (error, result) => {
        if (error) {
          console.log("query error: ", error.message);
        } else {
          const todoList = result.rows;

          todoList.forEach(item => {
            if (item.done === false) {
              console.log(`${item.id}. [ ] - ${item.name}\nCreated: ${item.created_at}\n\n`);
            } else {
              console.log(`${item.id}. [X] - ${item.name}\nCreated: ${item.created_at}\nUpdated: ${item.updated_at}\n\n`);
            }
          })
        }
      });
      break;
    }

    case 'done':
    {
      const id = process.argv[3];

      client.query('SELECT * FROM items WHERE id = $1', [id], (error, result) => {
        if (error) {
          console.log('query error: ', error.message);
        } else {
          if (result.rows[0].done === false) {
            client.query('UPDATE items SET done = true, updated_at = now() WHERE id = $1', [id], (error, result) => {
              if (error) {
                console.log('update error: ', error.message);
              } else {
                console.log(`Task #${id} has been updated!`);
              }
            });
          } else {
            console.log(`Task #${id} has already been completed!`);
          }
        }
      });
      break;
    }
  }
});