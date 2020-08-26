const operator = process.argv[2];

const pg = require('pg');

const configs = {
    user: 'vincent',
    host: '127.0.0.1',
    database: 'todo',
    port: 5432,
};

const client = new pg.Client(configs);

let queryDoneCallback = (err, result) => {
    if (err) {
      console.log("query error", err.message);
    } else {
      let items = result.rows;
      console.log(items)
      items.forEach(item => {
        let output = `${item.id}. ${item.status} - ${item.activity} created:${item.created_at} updated:${item.updated_at}`
        return console.log(output);
      })
    }
    client.end();
};

let addActivity = (err) => {
  if (err) {
    console.log("error", err.message)
  }
  let activity = process.argv[3];

  let queryText = 'INSERT INTO items (status, activity) VALUES ($1, $2) RETURNING *'
  let text = 'SELECT * FROM items'

  let values = ['[ ]', activity];

  client.query(queryText, values, (err, data) => {
    if (err) {
      console.log("ERROR")
    } else {
      client.query(text, queryDoneCallback)
    }
  });
}

let showActivity = (err) => {
  if (err) {
    console.log("error", err.message)
  }

  let queryText = 'SELECT * FROM items'

  client.query(queryText, queryDoneCallback);
}

let updateStatus = (err) => {
  if (err) {
    console.log("error", err.message)
  }

  let id = process.argv[3]

  let values = ['[X]', id]

  let queryText = `UPDATE items SET status=$1, updated_at=CURRENT_TIMESTAMP WHERE id=$2`
  let text = 'SELECT * FROM items'

  client.query(queryText, values, (err, data) => {
    if (err) {
      console.log("ERROR")
    } else {
      client.query(text, queryDoneCallback)
    }
  });
}

let removeActivity = (err) => {
  if (err) {
    console.log("error", err.message)
  }

  let id = process.argv[3]

  let queryText = `DELETE FROM items WHERE id=$1`
  let text = 'SELECT * FROM items'

  let values = [id]

  client.query(queryText, values, (err, data) => {
    if (err) {
      console.log("ERROR")
    } else {
      client.query(text, queryDoneCallback)
    }
  });
}

let avgTime = (err) => {
  if (err) {
    console.log("error", err.message)
  }

  let queryText = 'SELECT * FROM items'

  client.query(queryText, (err, res) => {
    if (err) {
      console.log("ERROR")
    } else {
      // console.log(res.rows)
      let items = res.rows;
      let timeDiff = items.map(item => {
        let diff = (item.updated_at - item.created_at)/60000;
        return diff;
      })
      let validTimeDiff = timeDiff.filter(time => time > 0)
      let totalValid = validTimeDiff.length;
      let totalTime = validTimeDiff.reduce((a,b) => {
        return a + b
      })
      let avgTime = totalTime/totalValid;
      console.log(`Avg Time Complete: ${avgTime.toFixed(2)} minutes for ${totalValid} nos of completed activity/-ies`)
    }
  });
}

let avgItemPerDay = (err) => {
  if (err) {
    console.log("error", err.message)
  }

  let queryText = 'SELECT id, created_at::DATE FROM items ORDER BY id DESC'

  client.query(queryText, (err, res) => {
    if (err) {
      console.log("ERROR")
    } else {
      console.log(res.rows)
      let convertTime = res.rows.map(item => {
        return item.created_at.getTime()
      })
      let totalDay = convertTime.length;
      let diffDays = [...new Set(convertTime)];

      let avg = totalDay/diffDays.length;

      // let totalDay = convertTime.length;
      // let sameDate = [];
      // for (let i = 1; i < totalDay; i++) {
      //   if (convertTime[0] !== convertTime[i]) {
      //     let index = i;
      //     sameDate = convertTime.splice(0, index);
      //     break;
      //   }
      // }
      console.log(`The average amount of item: ${avg} per day`);
    }
  });
}

let stats = (option) => {
  switch(option){
    case "complete-time":
      client.connect(avgTime);
      break;
    case "add-time":
      client.connect(avgItemPerDay);
    default:
      console.log("Please key in valid option")
  }
}


switch (operator) {
  case "add":
    client.connect(addActivity);
    break;
  case "show":
    client.connect(showActivity);
    break;
  case "done":
    client.connect(updateStatus);
    break;
  case "archive":
    client.connect(removeActivity);
    break;
  case "stats":
    let option = process.argv[3]
    stats(option);
    break;
  // case "check":
  //   client.connect(avgItemPerDay);
  //   break;
  default:
    console.log("Please key in a valid action");
}



