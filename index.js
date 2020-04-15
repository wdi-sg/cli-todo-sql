// console.log("works!!", process.argv[2]);

const pg = require('pg');

const configs = {
  user: 'Azhar',
  host: '127.0.0.1',
  database: 'todo',
  port: 5432,
};

const client = new pg.Client(configs);

let queryDoneCallback = (err, result) => {
  if (err) {
    console.log("query error", err.message);
  } else {
    // console.log("result", result.rows );
    let queryText = 'SELECT * FROM items';
    client.query(queryText, (err, res) => {
      if (err) {
        //Throw connection terminated error
        if(err.message != "Connection terminated"){
          console.log("query error", err.message);
        }
      } else {
        // iterate through all of your results:
        var outList = "";
        for (let i = 0; i < res.rows.length; i++) {
          var record = res.rows[i];
          if (record.done == false) {
            var string = `${i + 1}. [ ] - ${record.name}\n`;
            outList += string;
          } else {
            var string = `${i + 1}. [X] - ${record.name}\n`;
            outList += string;
          }
        }
        console.log(outList);
      }
      client.end();

    });
  }

};

var inputString = function () {
  var stringArr = process.argv;
  var remove = stringArr.splice(0, 3);
  // console.log(remove);
  var outString = "";
  for (id in stringArr) {
    outString += stringArr[id];
    outString += " ";
  }
  return outString;
}

let clientConnectionCallback = (err) => {

  if (err) {
    console.log("error", err.message);
  }
  var command = process.argv[2];
  switch (command) {
    case 'add':
      let text = "INSERT INTO items (name,done) VALUES ($1,$2) RETURNING id";
      var input = inputString();
      input = input.trim();
      var inputArr = [];
      if (input.includes(", ")) {
        inputArr = input.split(", ")
      } else {
        inputArr = [input];
      }
      for (id in inputArr) {
        const values = [inputArr[id], "f"];
        client.query(text, values, queryDoneCallback);
      }
      break;
    case "show":
      let queryText = 'SELECT * FROM items';
      client.query(queryText, queryDoneCallback);
      break;
    default:
      break;
  }


};

client.connect(clientConnectionCallback);
