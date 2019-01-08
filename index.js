// to create table and insert data into table first
// https://wdi-sg.github.io/gitbook-2018/04-databases/sql-intro/readme.html
console.log("works!!", process.argv[2], 'anddd ' +process.argv[3]);
let instruction = process.argv[2], dbIndex = process.argv[3];
const pg = require('pg');

if (process.argv[2].toLowerCase() === 'done'){
    //UPDATE todosql SET completed= true WHERE id= dbIndex;
    let text = UPDATE todosql SET completed = true WHERE id= dbIndex;
    //const values = [false, 'go for a run'];
    client.query(text, queryDoneCallback);
}else if (process.argv[2] === 'view'){
    let text = 'SELECT * FROM todosql';
    client.query(text, queryDoneCallback);
}

const configs = { //config file for logging into postgresql
    user: 'kennethyeong',
    password: 'Grabfiles1',
    host: '127.0.0.1',
    database: 'todosql',
    port: 5432,
};

const client = new pg.Client(configs);

let queryDoneCallback = (err, result) => {//function to send message to postgres
    if (err) {
        console.log('error in queryDoneCallback')
        console.log("query error", err.message);
    } else {
        console.log("result", result.rows );
    }
};

let clientConnectionCallback = (err) => {

  if( err ){
    console.log( "error", err.message );
  }else{
    console.log('clientConnectioncallback pass')
    let text = "INSERT INTO todosql (completed, name) VALUES ($1, $2) RETURNING id";
    const values = [false, 'go for a run'];
    //client.query(text, values, queryDoneCallback);
  }
};
client.connect(clientConnectionCallback);
