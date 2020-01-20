const pg = require('pg');

const configs = {
    user: 'stuartmyers',
    host: '127.0.0.1',
    database: 'todo',
    port: 5432,
};

const client = new pg.Client(configs);

const repetitions = process.argv[2];

// Clear the table

// Function to generate a random date:
// https://stackoverflow.com/questions/9035627/elegant-method-to-generate-array-of-random-dates-within-two-dates
const randomDate = (start, end) => {
    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}


const clientConnectionCallback = (err) => {

    if (err) {
        console.log("error", err.message);
        client.end();
    } else {
      for (var i = 0; i < repetitions; i++) {
        addRandomItemToDatabase();
      }
    }
};


const addRandomItemToDatabase = () => {
  const queryString = "INSERT INTO items (name, isdone, datecreated, dateupdated, archived) VALUES ($1, $2, $3, $4, $5) RETURNING *"
  const name = (randomDate(new Date(2017, 1, 1), new Date()).getTime().toString());
  const isdone = Math.random() < 0.5;
  const dateCreated = randomDate(new Date(2017, 1, 1), new Date(2019, 1, 1));
  const dateUpdated = randomDate(new Date(2019, 1, 1), new Date(2020, 1, 20));
  const archived = Math.random() < 0.5;
  const values = [name, isdone, dateCreated, dateUpdated, archived];
  client.query(queryString, values, (err, result) => {
    if (err) {
      console.log('error', err);
      client.end();
    } else {
      console.log('success');
    }
  })
}

// "INSERT INTO items (name, isdone, datecreated, dateupdated, archived) VALUES ($1, $2, $3, $4, $5) RETURNING *"


client.connect(clientConnectionCallback);
