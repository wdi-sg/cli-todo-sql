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

function formatDate(date) {
    var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2)
        month = '0' + month;
    if (day.length < 2)
        day = '0' + day;

    return [day, month, year].join('/');
}

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


let queryDoneCallbackTask = (err, result) => {

    if (err) {
      console.log("query error", err.message);
    } else {
      //console.log("result", result.rows );
      let numberOfTask=result.rows.length;
      let sum=0;
      let createdTime=[]
      for(let count=0; count<result.rows.length; count++)
      {
        if ( result.rows[count].created_second!==null)
        {
          createdTime.push(result.rows[count].created_second);
        }
      }

      let maxTime= Math.max(...createdTime);
      let minTime= Math.min(...createdTime);
      console.log("Max time is "+ maxTime + " Min Time is "+ minTime);
      let totalTime= (maxTime-minTime)/86400;
      let averageTaskAdd=numberOfTask/totalTime;
      console.log(`The number of task added per day in ${totalTime} days is ${averageTaskAdd} task/day`);
    }
    client.end();
};

let queryDoneCallbackBestWorst = (err, result) => {

    if (err) {
      console.log("query error", err.message);
    } else {
      //console.log("result", result.rows );


          let completedTime=[];
          let sum=0;
          let worstTask=""
          let bestTask=""
          for(let count=0; count<result.rows.length; count++)
          {
            if ( result.rows[count].completedtime!==null)
            {
              completedTime.push(result.rows[count].completedtime);
            }
          }
          let bestTime= Math.max(...completedTime);
          let worstTime= Math.min(...completedTime);
        for(count=0; count<result.rows.length; count++)
          {
            if ( result.rows[count].completedtime===bestTime)
            {
              bestTask=result.rows[count].name;
            }
            if ( result.rows[count].completedtime===worstTime)
            {
              worstTask=result.rows[count].name;
            }
          }
          console.log(`
▀█████████▄     ▄████████    ▄████████     ███           ▄█     █▄   ▄██████▄     ▄████████    ▄████████     ███
  ███    ███   ███    ███   ███    ███ ▀█████████▄      ███     ███ ███    ███   ███    ███   ███    ███ ▀█████████▄
  ███    ███   ███    █▀    ███    █▀     ▀███▀▀██      ███     ███ ███    ███   ███    ███   ███    █▀     ▀███▀▀██
 ▄███▄▄▄██▀   ▄███▄▄▄       ███            ███   ▀      ███     ███ ███    ███  ▄███▄▄▄▄██▀   ███            ███   ▀
▀▀███▀▀▀██▄  ▀▀███▀▀▀     ▀███████████     ███          ███     ███ ███    ███ ▀▀███▀▀▀▀▀   ▀███████████     ███
  ███    ██▄   ███    █▄           ███     ███          ███     ███ ███    ███ ▀███████████          ███     ███
  ███    ███   ███    ███    ▄█    ███     ███          ███ ▄█▄ ███ ███    ███   ███    ███    ▄█    ███     ███
▄█████████▀    ██████████  ▄████████▀     ▄████▀         ▀███▀███▀   ▀██████▀    ███    ███  ▄████████▀     ▄████▀
                                                                                 ███    ███
`);

          console.log(`The best timing is ${worstTask} which took ${worstTime} seconds. The worst timing is ${bestTask} which took ${bestTime} seconds.`)
      }
    client.end();
};


let queryDoneCallbackBetween = (err, result) => {
    if (err) {
      console.log("query error", err.message);
    } else {
      console.log(`All result between ${process.argv[3]} and  ${process.argv[4]}`, result.rows );
      let completedTask=[];
      for(let count=0; count<result.rows.length;count++)
      {
        if(result.rows[count].completion==='[  X  ]')
        {
          completedTask.push(result.rows[count])
        }
      }

      console.log(`
 ▄████████  ▄██████▄    ▄▄▄▄███▄▄▄▄      ▄███████▄  ▄█          ▄████████     ███        ▄████████ ████████▄           ███        ▄████████    ▄████████    ▄█   ▄█▄
███    ███ ███    ███ ▄██▀▀▀███▀▀▀██▄   ███    ███ ███         ███    ███ ▀█████████▄   ███    ███ ███   ▀███      ▀█████████▄   ███    ███   ███    ███   ███ ▄███▀
███    █▀  ███    ███ ███   ███   ███   ███    ███ ███         ███    █▀     ▀███▀▀██   ███    █▀  ███    ███         ▀███▀▀██   ███    ███   ███    █▀    ███▐██▀
███        ███    ███ ███   ███   ███   ███    ███ ███        ▄███▄▄▄         ███   ▀  ▄███▄▄▄     ███    ███          ███   ▀   ███    ███   ███         ▄█████▀
███        ███    ███ ███   ███   ███ ▀█████████▀  ███       ▀▀███▀▀▀         ███     ▀▀███▀▀▀     ███    ███          ███     ▀███████████ ▀███████████ ▀▀█████▄
███    █▄  ███    ███ ███   ███   ███   ███        ███         ███    █▄      ███       ███    █▄  ███    ███          ███       ███    ███          ███   ███▐██▄
███    ███ ███    ███ ███   ███   ███   ███        ███▌    ▄   ███    ███     ███       ███    ███ ███   ▄███          ███       ███    ███    ▄█    ███   ███ ▀███▄
████████▀   ▀██████▀   ▀█   ███   █▀   ▄████▀      █████▄▄██   ██████████    ▄████▀     ██████████ ████████▀          ▄████▀     ███    █▀   ▄████████▀    ███   ▀█▀
                                                   ▀                                                                                                       ▀
`);
      console.log(`All completed result between ${process.argv[3]} and  ${process.argv[4]}`, completedTask );
    }
    client.end();
};

function compare(a, b) {
  // Use toUpperCase() to ignore character casing
  const timingA = a.completedtime;
  const timingB = b.completedtime;

  let comparison = 0;
  if (timingA > timingB) {
    comparison = 1;
  } else if (timingA < timingB) {
    comparison = -1;
  }
  return comparison;
}

let queryDoneCallbackBetweenAsc = (err, result) => {
    if (err) {
      console.log("query error", err.message);
    } else {
     // console.log(`All result between ${process.argv[4]} and  ${process.argv[5]}`, result.rows );
      let completedTask=[];
      for(let count=0; count<result.rows.length;count++)
      {
        if(result.rows[count].completion==='[  X  ]')
        {
          completedTask.push(result.rows[count])
        }
      }
      completedTask.sort(compare);
      console.log(`
 ▄████████  ▄██████▄    ▄▄▄▄███▄▄▄▄      ▄███████▄  ▄█          ▄████████     ███        ▄████████ ████████▄           ███        ▄████████    ▄████████    ▄█   ▄█▄
███    ███ ███    ███ ▄██▀▀▀███▀▀▀██▄   ███    ███ ███         ███    ███ ▀█████████▄   ███    ███ ███   ▀███      ▀█████████▄   ███    ███   ███    ███   ███ ▄███▀
███    █▀  ███    ███ ███   ███   ███   ███    ███ ███         ███    █▀     ▀███▀▀██   ███    █▀  ███    ███         ▀███▀▀██   ███    ███   ███    █▀    ███▐██▀
███        ███    ███ ███   ███   ███   ███    ███ ███        ▄███▄▄▄         ███   ▀  ▄███▄▄▄     ███    ███          ███   ▀   ███    ███   ███         ▄█████▀
███        ███    ███ ███   ███   ███ ▀█████████▀  ███       ▀▀███▀▀▀         ███     ▀▀███▀▀▀     ███    ███          ███     ▀███████████ ▀███████████ ▀▀█████▄
███    █▄  ███    ███ ███   ███   ███   ███        ███         ███    █▄      ███       ███    █▄  ███    ███          ███       ███    ███          ███   ███▐██▄
███    ███ ███    ███ ███   ███   ███   ███        ███▌    ▄   ███    ███     ███       ███    ███ ███   ▄███          ███       ███    ███    ▄█    ███   ███ ▀███▄
████████▀   ▀██████▀   ▀█   ███   █▀   ▄████▀      █████▄▄██   ██████████    ▄████▀     ██████████ ████████▀          ▄████▀     ███    █▀   ▄████████▀    ███   ▀█▀
                                                   ▀                                                                                                       ▀
`);
      console.log(`All completed result between ${process.argv[4]} and  ${process.argv[5]}`, completedTask );
    }
    client.end();
};

///////// adding Task
let addTask=()=>{
  let date=new Date();
  let formattedDate=formatDate(date);
  let timeSecond=new Date();
  n=timeSecond.getTime()/1000;
    let text = "INSERT INTO items (completion, name, created_at, created_second) VALUES ($1, $2, $3, $4) RETURNING id, created_at";
  const values = ["[    ]",process.argv[3], formattedDate,n];
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
  let date = new Date();
    let formattedDate=formatDate(date);
  let calculateDate=new Date();
  let calculateSecond=calculateDate.getTime()/1000;
  //let ReadText="SELECT * from items";
  //client.query(ReadText, queryDoneCallback);
  let Updatetext = `UPDATE items SET completion = REPLACE(completion,completion,'[  X  ]'), finished_at =($1), completedtime =  ($2)- created_second  WHERE id=${parseInt(process.argv[3])}`;
    client.query(Updatetext,[formattedDate, calculateSecond], queryDoneCallback2);


}

let computeAverage=()=>{
  let text="SELECT * FROM items";
  if(process.argv[3].toLowerCase()==="complete-time")
    {
      client.query(text, queryDoneCallbackAverage);
    }
  if(process.argv[3].toLowerCase()==="add-time")
    {
      client.query(text, queryDoneCallbackTask);
    }
    if(process.argv[3].toLowerCase()==="best-worst")
    {
      client.query(text, queryDoneCallbackBestWorst);
    }
}


let findBetween=()=>{
  let text="SELECT * FROM items WHERE created_at >= ($1) AND created_at <= ($2)"
  client.query(text,[process.argv[3], process.argv[4]],queryDoneCallbackBetween);
}

let findBetweenAsc=()=>{
  let text="SELECT * FROM items WHERE created_at >= ($1) AND created_at <= ($2)"
  client.query(text,[process.argv[4], process.argv[5]],queryDoneCallbackBetweenAsc);
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

if(process.argv[2].toLowerCase()==="archive")
{

  archiveTask();
  return
}

if(process.argv[2].toLowerCase()==="stats"&& process.argv[3].toLowerCase()==="between" && process.argv[6]==="complete-time"  && process.argv[7].toLowerCase()==="asc")
{

  findBetweenAsc();
  return;
}
if(process.argv[2].toLowerCase()==="stats"&&process.argv[4]===undefined)
{

    computeAverage();


    return;
}
if(process.argv[2].toLowerCase()==="between")
{
  findBetween();
  return
}

console.log(`
 ██▓ ███▄    █ ██▒   █▓ ▄▄▄       ██▓     ██▓▓█████▄
▓██▒ ██ ▀█   █▓██░   █▒▒████▄    ▓██▒    ▓██▒▒██▀ ██▌
▒██▒▓██  ▀█ ██▒▓██  █▒░▒██  ▀█▄  ▒██░    ▒██▒░██   █▌
░██░▓██▒  ▐▌██▒ ▒██ █░░░██▄▄▄▄██ ▒██░    ░██░░▓█▄   ▌
░██░▒██░   ▓██░  ▒▀█░   ▓█   ▓██▒░██████▒░██░░▒████▓
░▓  ░ ▒░   ▒ ▒   ░ ▐░   ▒▒   ▓▒█░░ ▒░▓  ░░▓   ▒▒▓  ▒
 ▒ ░░ ░░   ░ ▒░  ░ ░░    ▒   ▒▒ ░░ ░ ▒  ░ ▒ ░ ░ ▒  ▒
 ▒ ░   ░   ░ ░     ░░    ░   ▒     ░ ░    ▒ ░ ░ ░  ░
 ░           ░      ░        ░  ░    ░  ░ ░     ░
                   ░                          ░
`);
return;
};

client.connect(clientConnectionCallback);