//SET UP
const pg = require('pg');

const configs = {
    user: 'jessica',
    host: '127.0.0.1',
    database: 'todo',
    port: 5432,
};

const client = new pg.Client(configs);

//SET UP DISPLAY
const Table = require('ascii-art-table');

const createTable = (rowData) =>{
        Table.create({
        width : 300,
        data : rowData,
        bars : {
            'ul_corner' : '┏',
            'ur_corner' : '┓',
            'lr_corner' : '┛',
            'll_corner' : '┗',
            'bottom_t' : '┻',
            'top_t' : '┳',
            'right_t' : '┫',
            'left_t' : '┣',
            'intersection' : '╋',
            'vertical' : '┃',
            'horizontal' : '━',
        },
        borderColor : 'bright_white',
        columns : [
                {
                    value : ' No.'
                },
                {
                    value : ' Task'
                },
                {
                    value : ' created_at'
                },
                {
                    value : ' updated_at'
                }
            ]
    }, function(rendered){
        // use rendered text
        console.log(rendered);
    });
}
//END OF SET UP

let queryDoneCallback = (err, result) => {
        if (err) {
      console.log("query error", err.message);
    }else{
        console.log(result.rows);
        text = 'SELECT * FROM items ORDER BY id';
            client.query(text, showQueryDoneCallBack);
    }
    }

let showQueryDoneCallBack = (err,result)=>{
    if (err) {
      console.log("query error", err.message);
    } else {
        const displayData = [];
        for(let i = 0; i< result.rows.length;i++){
            let id = " "+(i+1)+". ";
            let done = '[ ]';
            let date = "                     ";
            let updateDate = result.rows[i].updated_at;
            if(result.rows[i].done){
                done='[X]';
                date = updateDate.toString();
            }
            let task = done + " - "+result.rows[i].task+ " ";
            let createDate = result.rows[i].created_at;
            const currentRow = [id, task, createDate.toString(), date];

            displayData.push(currentRow);
        }if(result.rows.length === 0){
            console.log("no data found");
        }else{
        createTable(displayData);
        }
    }
     client.end();
}

let done = (num)=>{
   let text = `SELECT * FROM items`;
    client.query(text, (err,result)=>{
    if(err){
         console.log("query error", err.message);
    }else{
        let id;
        if(result.rows.length === 0){
            console.log("no data found");
        }else{
            var d = new Date();

            id =result.rows[num-1].id;
            let text = `UPDATE items SET done='true', updated_at=$1 WHERE id=$2`;
            let values = [d,id];
             client.query(text,values, queryDoneCallback);
        }
    }
    });
}

let clientConnectionCallback = (err) => {
  if( err ){
    console.log( "error", err.message );
  }
  let commandType = process.argv[2];
        if(commandType === "show"){
            text = 'SELECT * FROM items ORDER BY id';
            client.query(text, showQueryDoneCallBack);
        }else if(commandType === "add"){
            var date = new Date();
            if(process.argv[3]!== undefined){
                text = `INSERT INTO items (task, done) VALUES ($1,false)`;
                let values = [process.argv[3]];
                client.query(text,values, queryDoneCallback);
            }
         }else if(commandType === "done"){
         let taskNumber = parseInt(process.argv[3]);
         if(isNaN(taskNumber)=== false){
            done(taskNumber);
        }
        else{
            console.log("Type error: enter a valid number");
            client.end();
        }
    }else{
        console.log("Add a valid input");
    }
}

client.connect(clientConnectionCallback);