console.log("We gonna do this!!!");

//for postgres
const pg = require('pg');

const configs = {
    user: 'malcolmlow',
    host: '127.0.0.1',
    database: 'todo',
    port: 5432,
};

//=================================================

var input2 = process.argv[2]; //add, done
console.log("input2: " + input2);

var input3 = process.argv[3]; //"eat bak kut teh", 4
console.log("input3: " + input3);

var date = new Date();
console.log("date: " + date);

//=================================================

const client = new pg.Client(configs);

let queryDoneCallback = (err, result) => {
    if (err) {
      console.log("query error", err.message);
    } else {
      console.log("result", result.rows );
    }
};

//=================================================

let clientConnectionCallback = (err) => {

    if( err ){
        console.log( "error", err.message );
    }

    //see the list (deliverable)
    else if (input2 === 'show') {
        let queryText = "SELECT * FROM items;";

        client.query(queryText, (err, result) =>{
            if (err) {
                console.log("query error", err.message);
            }
            else {
                console.log("result");
                for (let i = 0; i < result.rows.length; i++) {
                    console.log(result.rows[i].id + ". " + result.rows[i].done + " - " + result.rows[i].name);
                }
            }
        })
    }

    //add to list (deliverable)
    else if (input2 === 'add'){

        let text = "INSERT INTO items (name, done, action, created) VALUES ($1, $2, $3, $4) RETURNING id";

        const values = [input3,'[ ]', 'added', date];

        client.query(text, values, queryDoneCallback);
    }

    //mark as done (further)
    else if (input2 === 'done') {

        // let text = "UPDATE items SET done = '[X]', action = 'updated', created =" +date+ "WHERE id =" + parseInt(input3);
        // let text = `UPDATE items SET done = '[X]', action = 'updated', created = ${date} WHERE id = ${parseInt(input3)}`;


        let text = "UPDATE items SET done = ($1), action=($2), created=($3) WHERE id =" + parseInt(input3) + "RETURNING id";

        let values = ['[X]', 'updated', date];

        client.query(text, values, queryDoneCallback);
    }
};

client.connect(clientConnectionCallback);

//=================================================

// let clientConnectionCallback = (err) => {

//   if( err ){
//     console.log( "error", err.message );
//   }

//   let text = "INSERT INTO items (name, done) VALUES ($1, $2) RETURNING id";

//   const values = [input2,'false'];

//   client.query(text, values, queryDoneCallback);
// };

// client.connect(clientConnectionCallback);