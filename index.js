// Run this everytime you restart  
// sudo /etc/init.d/postgresql restart

const pg = require('pg');
var moment = require('moment');

const configs = {
    user: 'weizheng1910',
    host: '127.0.0.1',
    database: 'todo',
    port: 5432,
};

const client = new pg.Client(configs);

// External Functions

const showDoneYet = (doneYet) => {
  if(doneYet == false){
    return "[ ]"
  } else {
    return "[X]"
  }
}

const alignList = (id) => {
  if(id < 10) {
    return " "
  } else {
    return ""
  }
}

const getDateTime = () => {
 
var today = new Date();
var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
var dateTime = date+' '+time;
  
    // const dateFormat = `${thisYear} - ${thisMonth} - ${thisDate}`
    return dateTime;
}

// End External Functions

let taskDoneCallBack = (err, result) => {
    if (err) {
      console.log("Error", err.message);
    } else {
      console.log("Task inserted!");
      console.log("Current data: ")
    }
};

let showAllQueryCallBack = (err, result) => {
    if (err) {
      console.log("Error", err.message);
    } else {
      for(let i = 0; i < result.rows.length; i++){
        console.log(`${alignList(i+1)}${i + 1}. ${showDoneYet(result.rows[i].doneyet)} ${result.rows[i].name} | Date Created: ${result.rows[i].date_created}`)
      }
    }
    client.end();
};

let clientConnectionCallback = (err) => {

  if( err ){
    console.log( "error", err.message );
  }

  // Query Strings 
  let insertNew = "INSERT INTO items (name,doneYet,date_created) VALUES ($1,$2,$3) RETURNING *";
  let showAll = "SELECT * from items"
  let markDone = `UPDATE items SET doneyet = 'true' WHERE name = $1;`;
  
  switch(process.argv[2]){
    
    case("show"):
      client.query(showAll,showAllQueryCallBack)
      break;

    case("add"):
      let newTask = process.argv[3];
      let newDate = moment().format('LTS');
      const insertNewInput = [newTask,false, newDate];
      client.query(insertNew, insertNewInput, taskDoneCallBack);
      client.query(showAll,showAllQueryCallBack);
      break;

    case("done"):
      let doneTask = process.argv[3];
      const markDoneInput = [doneTask]
      client.query(markDone,markDoneInput,taskDoneCallBack);
      client.query(showAll,showAllQueryCallBack);
      break;

    default:
      console.log("Command Invalid.");
      break;
  }

  
};

client.connect(clientConnectionCallback);

