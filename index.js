console.log("works!!", process.argv[2]);

const pg = require('pg');

const configs = {
    user: 'huiyu',
    host: '127.0.0.1',
    database: 'todo',
    port: 5432,
};

const client = new pg.Client(configs);

client.connect((err) => {
    if( err ){
    console.log( "error", err.message );
  } else{
    console.log("type 'show' to display list or type 'add' to add to the list");
    if(process.argv[2] === "add"){
        add(process.argv[3]);
    }
  }
});

const add = function(value){
    let text = "INSERT INTO items (name) VALUES ($1)";
    client.query(text, (err, res) => {
        if(err){
            console.log("query error ");
        }else{
            console.log("added to list");
            process.exit();
        }
    });
}