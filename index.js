//console.log("works!!", process.argv[2]);

const pg = require('pg');
let startDate="";
const configs = {
    user: 'kenneththesheep',
    host: '127.0.0.1',
    database: 'todo',
    port: 5432,
};
let data={task:[]};
const client = new pg.Client(configs);

let queryDoneCallback = (err, result) => {
    if (err) {
      console.log("query error", err.message);
    } else {
      //console.log("result", result.rows );
      //console.log(result.rows);

    }
    client.end();
};

let queryDoneCallback2 = (err, result) => {

    if (err) {
      console.log("query error", err.message);
    } else {
      console.log("result", result.rows );
      //result.rows[0].completedtime="Something";
      console.log(result.rows);

    }
    client.end();
};

let queryDoneCallbackAverage = (err, result) => {

    if (err) {
      console.log("query error", err.message);
    } else {
      //console.log("result", result.rows );
      let completedTime=[];
      let sum=0;
      for(let count=0; count<result.rows.length; count++)
      {
        if ( result.rows[count].completedtime!==null)
        {
          completedTime.push(result.rows[count].completedtime);
        }
      }
      for(let loopCount=0; loopCount < completedTime.length;loopCount++)
      {
        sum += completedTime[loopCount];
      }
      console.log("Average completed time is "+sum/completedTime.length+ " seconds.");
      //result.rows[0].completedtime="Something";
      //console.log(result.rows);

    }
    client.end();
};


///////// adding Task
let addTask=()=>{
  let timeSecond=new Date();
  n=timeSecond.getTime()/1000;
    let text = "INSERT INTO items (completion, name, created_at, created_second) VALUES ($1, $2, $3, $4) RETURNING id, created_at";
  const values = ["[    ]",process.argv[3], Date(),n];
  //console.log(text);

  client.query(text, values, queryDoneCallback);
}

///////// view Task
let viewTask=()=>{
    let text = `SELECT * FROM items WHERE id=${parseInt(process.argv[3])} `;
    console.log("text is "+text);
  client.query(text, queryDoneCallback);
}

//////////////////Update Tasks
let updateTask=()=>{
  console.log(typeof Date());
  let date = Date();
  //let ReadText="SELECT * from items";
  //client.query(ReadText, queryDoneCallback);
  let Updatetext = `SELECT * FROM items WHERE id=${parseInt(process.argv[3])}`;
    client.query(Updatetext, queryDoneCallback2);


}

//////////////////Delete Tasks
let archiveTask=()=>{


  let archivetext = `DELETE  FROM items WHERE id=${parseInt(process.argv[3])}`;
    client.query(archivetext, queryDoneCallback2);
  }





//////////////////Done Tasks
let doneTask=()=>{
  console.log(typeof Date());
  let date = Date();
  let calculateDate=new Date();
  let calculateSecond=calculateDate.getTime()/1000;
  //let ReadText="SELECT * from items";
  //client.query(ReadText, queryDoneCallback);
  let Updatetext = `UPDATE items SET completion = REPLACE(completion,completion,'[  X  ]'), finished_at =($1), completedtime =  ($2)- created_second  WHERE id=${parseInt(process.argv[3])}`;
    client.query(Updatetext,[date, calculateSecond], queryDoneCallback2);


}

let computeAverage=()=>{
  let text="SELECT * FROM items";
  client.query(text, queryDoneCallbackAverage);
}

let clientConnectionCallback = (err) => {

  if( err ){
    console.log( "error", err.message );
  }

if(process.argv[2].toLowerCase()==="add")
{
  addTask();
  return
}
if(process.argv[2].toLowerCase()==="done")
{
  doneTask();
  return
}
if(process.argv[2].toLowerCase()==="view")
{
  viewTask();
  return
}
if(process.argv[2].toLowerCase()==="update")
{
  updateTask();
  return
}
  console.log("archive");
if(process.argv[2].toLowerCase()==="archive")
{

  archiveTask();
  return
}
if(process.argv[2].toLowerCase()==="stats")
{
  if(process.argv[3].toLowerCase()==="complete-time")
  {
    computeAverage();
    return;
  }
}
};

client.connect(clientConnectionCallback);