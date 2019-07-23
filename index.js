const pg = require('pg');

const configs = {
    user: 'mhafiz',
    host: '127.0.0.1',
    database: 'todo',
    password:'popo25',
    port: 5432
};
const client = new pg.Client(configs)


const userInput = process.argv.length;
const inputOne = process.argv[2];
const inputTwo = process.argv[3];

if(userInput === 2) {
    let queryDoneCallback = (err, res) => {
        if (err) {console.log("query error", err.message);}
        else {
        // for( let i=0; i<res.rows.length; i++ ){
        //     console.log("result: ", res.rows[i]);
        console.log("asdasd")
        }
    };
    const clientConnectionCallback=(err)=>{
        if(err){
            console.log("Error",err.message);
        }
        else{
            console.log("Connected successfully");
        }
    }
    client.connect(clientConnectionCallback);
};
if(userInput === 3) {
    if( inputOne === 'show'){
        let queryDoneCallback = (err, res) => {
            if (err) console.log("query error", err.message);
            else {
                for( let i=0; i<res.rows.length; i++ ){
                    console.log("result: ", res.rows[i]);
                }
            }
        };
    };
    const clientConnectionCallback=(err)=>{
        if(err) console.log("Error",err.message);
        else{
            let queryText = 'SELECT * FROM items ORDER BY id ASC';
            client.query(queryText,queryDoneCallback);
        }
    }
    client.connect(clientConnectionCallback);
}

if(userInput === 4) {
    if(inputOne === 'add'){
        const clientConnectionCallback=(err)=>{
            if(err) console.log("Error",err.message);
            else{
                let queryText = 'INSERT INTO items (name,completion,date) VALUES($1,$2,$3)';
                const now = new Date();
                const values = [inputTwo,false,now];
                client.query(queryText,values);
                console.log("Add successful");
            }
        };
        client.connect(clientConnectionCallback);
    };
};




//     if(userInput === 4) {

//         if(commandType === 'add'){
//             const clientConnectionCallback=(err)=>{
//                 if(err){
//                     console.log("Error",err.message);
//                 }
//                 else{
//                     let text = 'INSERT INTO task(name,completion) VALUES($1,$2,$3) RETURNING id';
//                     const values = [process.argv[3],false];
//                     client.query(text,values);

//                     console.log("Add sucessful");
//                     process.exit();
//                 }
//             }
//             client.connect(clientConnectionCallback);
//         }


//         if(commandType==='done'){
//             const clientConnectionCallback=(err)=>{
//                 if(err){
//                     console.log("Error",err.message);
//                 }
//                 else{
//                     let date = new Date();
//                     let text = "UPDATE task SET completion ='true', created_date = '"+date+ "' WHERE id = '"+userInput+"'";
//                     client.query(text,queryDoneCallback);
//                     process.exit();
//                 }
//             }
//             client.connect(clientConnectionCallback);
//         }

//         if(commandType === 'delete'){
//             const clientConnectionCallback =(err)=>{
//                 if(err){
//                     console.log("Error",err.message);
//                 }
//                 else{
//                     let text = "DELETE FROM task WHERE id = '"+userInput+"'";
//                     let deleteId = 'ALTER TABLE task DROP id';
//                     let addId = 'ALTER TABLE task ADD id SERIAL PRIMARY KEY';
//                     client.query(text,queryDoneCallback);
//                     client.query(deleteId,queryDoneCallback);
//                     client.query(addId,queryDoneCallback);
//                     process.exit();
//                 }

//             }
//             client.connect(clientConnectionCallback);
//         }

//     }

// }