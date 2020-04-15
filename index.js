/*console.log("works!!", process.argv[2]);

const pg = require('pg');

const configs = {
    user: 'nausheen',
    host: '127.0.0.1',
    database: 'todo',
    port: 5432,
};

const client = new pg.Client(configs);


/*let queryDoneCallback = (err, result) => {
    if (err) {
      console.log("query error", err.message);
    } else {
      console.log("result", result.rows );
    }
    client.end();
};

let clientConnectionCallback = (err) => {

  if( err ){
    console.log( "error", err.message );
  }

  let text = "INSERT INTO todo (name) VALUES ($1) RETURNING id";

  const values = ["hello"];

  client.query(text, values, queryDoneCallback);
};

client.connect(clientConnectionCallback);

let clientConnectionCallback = (err) => {
    let action = process.argv[2];
    let name = process.argv[3];
    let values;
    if (action == "show") {
        client.connect((err) => {
            if( err ){
             console.log( "error", err.message );
            }
            const text = 'SELECT * FROM items'
            client.query(text, (err, res) => {
             if (err) {
               console.log("query error", err.message);
             } else {
               console.log("result", res.rows);
               client.end();
             }
           });

         });
     }
    if (action == "add"){
    queryText = 'INSERT INTO items (name) VALUES ($1) RETURNING id'; 
    values = [name]; 
    client.query(queryText, values, (err, res) => {
        if (err) {
           console.log("query error", err.message);
        } else {
            console.log("created!")
             client.end();
        }
    });
}
    else{ 
    console.log("invalid input");
    return;
    }
};
client.connect(clientConnectionCallback); 







client.connect((err) => {

  if( err ){
    console.log( "error", err.message );
  }


  let action = process.argv[2];
  let name = process.argv[3];
  let values;
  if (action == "add"){
     values = [name]; 
    queryText = 'INSERT INTO items (name) VALUES ($1) RETURNING id'; 
    } else if (process.argv[2] == "show") {
        values = [name]
       queryText = "SELECT * FROM items RETURNING id"; 
    } else if (process.argv[2] == "done") { 
       values = [name]; 
       queryText = "UPDATE items SET name = '[X]' WHERE name = $1 RETURNING id"; 

} else
{ 
    console.log("invalid input");
    return;
} 

  client.query(text, (err, res) => {
    if (err) {
      console.log("query error", err.message);
    } else {
      console.log("result", res.rows[0]);
    }
  });

});
*/

const pg = require('pg');

const configs = {
    user: 'nausheen',
    host: '127.0.0.1',
    database: 'todo',
    port: 5432,
};

const client = new pg.Client(configs);
client.connect((err) => {
    if( err ){
        console.log( "error", err.message );
    }
    let action = process.argv[2];
    let actionName = process.argv[3];
    let values;
    if (action == "show"){
        if (err){
            console.log("error", err.message);
        }
        const text = 'SELECT * FROM items';
        client.query(text, (err, res) => {
            if (err) {
                console.log("query error", err.message);
            }else{
                for (var i = 0; i < res.rows.length; i++) {
                    console.log(res.rows[i].id+". [ ]  "+res.rows[i].name)
                }
                     // console.log("result", res.rows);
                client.end();
            }
        });
    }
    if (action == "add"){
        let queryText = 'INSERT INTO items (name) VALUES ($1) RETURNING id';
        values = [actionName];
        console.log(values);
        client.query(queryText,values, (err, res) => {
            if (err) {
                console.log("query error", err.message);
            }else{
                console.log("created!")
                 client.end();
             }
        })
    }
    else {
        return;
     }

});