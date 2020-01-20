const pg = require('pg');
const moment = require('moment')

const configs = {
  user: 'robertkolsek',
  host: '127.0.0.1',
  database: 'todo',
  port: 5432,
};

const client = new pg.Client(configs);



let queryDoneCallback = (err, result) => {
  if (err) {
    console.log("query error", err.message);
  } else {
    for (let i = 0; i < result.rows.length; i++) {
      if (!result.rows[i].archived && !result.rows[i].updated_at) {
          let a = result.rows[i].created_at
          let b = result.rows[i].updated_at
          let diff = moment(b).diff(moment(a, true))
        console.log(`${result.rows[i].id}. ${result.rows[i].done} - ${result.rows[i].todo}\ncreated at: ${moment(result.rows[i].created_at).format('MMMM Do YYYY, h:mm:ss a')}`)

      } else if (!result.rows[i].archived && result.rows[i].updated_at) {
        let a = result.rows[i].created_at
          let b = result.rows[i].updated_at
          let diff = moment(b).diff(moment(a, true))
        console.log(`${result.rows[i].id}. ${result.rows[i].done} - ${result.rows[i].todo}\ncreated at: ${moment(result.rows[i].created_at).format('MMMM Do YYYY, h:mm:ss a')}\nupdated at: ${moment(result.rows[i].updated_at).format('MMMM Do YYYY, h:mm:ss a')}\ndifference: ${diff/1000/60} minutes`)
      }
    }
  }
  client.end();
};

let clientConnectionCallback = (err) => {

  if (err) {
    console.log("error", err.message);
  }

  let queryText;
  const command = process.argv[2].toLowerCase()

  const values = [process.argv[3], "[]"];

  if (command === "add") {
    queryText = "INSERT INTO items (todo, done, created_at, archived) VALUES ($1, $2, CURRENT_TIMESTAMP, false) RETURNING *"
    client.query(queryText, values, queryDoneCallback);

  } else if (command === "show") {
    queryText = "SELECT * FROM items ORDER BY done ASC"
    client.query(queryText, queryDoneCallback)

  } else if (command === "done") {
    values.splice(1, 1)
    queryText = "UPDATE items SET done='[X]', updated_at=CURRENT_TIMESTAMP WHERE id=$1 RETURNING *"
    client.query(queryText, values, queryDoneCallback)

  } else if (command === "archive") {
    values.pop()
    queryText = "UPDATE items SET archived='true' WHERE id=$1 RETURNING *"
    client.query(queryText, values, queryDoneCallback)
  } else if (command === "stats" && process.argv[3] === "complete-time") {

    queryText = "SELECT * FROM items ORDER BY done ASC"
    client.query(queryText, (err, result) => {


      if (err) {
        console.log("query error", err.message);
      } else {
        let totalTime = 0;
        let counter = 0
        for (let i = 0; i < result.rows.length; i++) {
          if (!result.rows[i].archived && result.rows[i].updated_at) {
            let a = result.rows[i].created_at
            let b = result.rows[i].updated_at
            let diff = moment(b).diff(moment(a, true))
            totalTime += diff
            counter++
            if (diff / 1000 < 60) {
              console.log(`${result.rows[i].id}. ${result.rows[i].done} - ${result.rows[i].todo}\ncompleted in: ${diff/1000}seconds`)
              client.end()

            } else if (diff / 1000 > 60) {
              diff = diff/1000;
              console.log(`${result.rows[i].id}. ${result.rows[i].done} - ${result.rows[i].todo}\ncompleted in: ${diff/60} minutes`)
              client.end()
            } else if (diff / 1000 / 60 > 60){
              diff = diff/1000/60
              console.log(`${result.rows[i].id}. ${result.rows[i].done} - ${result.rows[i].todo}\ncompleted in: ${diff/60} hours`)
              client.end()
            }
          }


        }
        console.log("Average completion time: " + (totalTime/counter/1000/60) + " minutes")
      }

    })
  }

};

client.connect(clientConnectionCallback);