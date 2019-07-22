console.log("works!!", process.argv[2]);
const pg = require('pg');
const configs = {
    user: 'sowyuen',
    host: '127.0.0.1',
    database: 'todo',
    port: 5432,
};
var commandType = process.argv[2];
var userInput = process.argv[3];

let queryDoneCallback = (err, res) => {
   if (err) {
     console.log("query error", err.message);
   } else {
     for( let i=0; i<res.rows.length; i++ ){
       console.log("result: ", res.rows[i]);
     }
       // process.exit()
   }
};
const client = new pg.Client(configs);
if(commandType === 'add'){
    const clientConnectionCallback=(err)=>{
        if(err){
            console.log("Error",err.message);
        }
        else{
            let date = new Date();
            let text = 'INSERT INTO items(name,completion,created_day) VALUES($1,$2,$3) RETURNING id';
            const values = [process.argv[3],false,date];
            client.query(text,values);
            console.log("Add sucessful");
        }
    }
client.connect(clientConnectionCallback);
}
else if( commandType === 'show'){
    const clientConnectionCallback=(err)=>{
        if(err){
            console.log("Error",err.message);
        }
        else{
            let text = 'SELECT * FROM items ORDER BY id ASC';
            client.query(text,queryDoneCallback);
        }
    }
    client.connect(clientConnectionCallback);
}
else if(commandType==='done'){
    const clientConnectionCallback=(err)=>{
        if(err){
            console.log("Error",err.message);
        }
        else{
            let date = new Date();
            let text = "UPDATE items SET completion ='true', created_day = '"+date+ "' WHERE id = '"+userInput+"'";
            client.query(text,queryDoneCallback);
        }
    }
        client.connect(clientConnectionCallback);
}
else if(commandType === 'delete'){
    const clientConnectionCallback =(err)=>{
        if(err){
            console.log("Error",err.message);
        }
        else{
            let text = "DELETE FROM items WHERE id = '"+userInput+"'";
            let deleteId = 'ALTER TABLE items DROP id';
            let addId = 'ALTER TABLE items ADD id SERIAL PRIMARY KEY';
                    client.query(text,queryDoneCallback);
        client.query(deleteId,queryDoneCallback);
        client.query(addId,queryDoneCallback);
        }
    }
    client.connect(clientConnectionCallback);
}