console.log("works!!", process.argv[2]);

const pg = require('pg');

const configs = {
    user: 'tsairenkun',
    host: '127.0.0.1',
    database: 'todo',
    port: 5432,
};

const client = new pg.Client(configs);

let queryDoneCallback = (err, result) => {
    if (err) {
      console.log("query error", err.message);
    } else {
      console.log("result", result.rows );
    }
    client.end();
};

let doneCallBack = (err, result) => {
    if (err) {
      console.log("query error", err.message);
    } else {
        for (var i = 0; i < result.rows.length; i++) {
            var list = result.rows[i]
            if(list.done){
                console.log(`${list.id}. [x] - ${list.name} Created: ${list.created_at}`)
            } else {
                console.log(`${list.id}. [ ] - ${list.name}`)
            }

        }
    }
    client.end();
};

let clientConnectionCallback = (err) => {

  if( err ){
    console.log( "error", err.message );
  }

//-------ADDING NEW ITEMS INTO LIST ----------------
    if(process.argv[2] === "add"){
      let text = "INSERT INTO items (name) VALUES ($1) RETURNING id, name";

      const values = [process.argv[3]];

      client.query(text, values, queryDoneCallback);
    }
//-------SHOWING LIST OF ITEMS------------------
    if(process.argv[2] === "show"){
        let text = "SELECT * FROM items ORDER BY id";
        client.query(text, doneCallBack);
    }
//------MARK AS DONE-----------------------
    if(process.argv[2] === "done"){
        let text = 'UPDATE items SET done=$2, updated_at = NOW()  WHERE id=$1 RETURNING id'
        const values = [process.argv[3], true]
        client.query(text, values, queryDoneCallback);
    }
//------AVERAGE TIME OF COMPLETION---------------------
    if(process.argv[2] === "stats" && process.argv[3] === "complete-time")

};

client.connect(clientConnectionCallback);