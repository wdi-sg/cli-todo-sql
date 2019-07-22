const pg = require('pg');
const columnify = require('columnify')

const configs = {
    user: 'marcus',
    password: 'happytreefriends',
    host: '127.0.0.1',
    database: 'todo',
    port: 5432,
};

const client = new pg.Client(configs);

let queryDoneCallback = (err, result) => {
    if (err) {
      console.log("query error", err.message);
    } else {
      //displaying results on console based on data entries
      var data = [];
      for (var i = 0; i < result.rows.length; i++){
        if (result.rows[i].complete === true){
          var cross = 'x'
          data.push({
            id: result.rows[i].id,
            task: " ["+cross+"]" + " - " + result.rows[i].task,
            date_created: result.rows[i].date_created,
            date_completed: result.rows[i].date_completed
          })
        }else {
          var cross = ' '
          data.push({
            id: result.rows[i].id,
            task: " ["+cross+"]" + " - " + result.rows[i].task,
            date_created: result.rows[i].date_created,
            date_completed: result.rows[i].date_completed
          })
        }
      }
      //put info into columns
      var columns = columnify(data, {
        columns: ['id','task','date_created','date_completed']
      })
      console.log(columns);
    }
};

var clientConnectionCallback = (err) => {
  if(err){
    console.log( "error", err.message );
  }else{
  //inserting new item into todo task list
  if (process.argv[2] === "add"){
    //combining all the strings after process.argv[2] for the task list
    var combinedStr = ''
    for (var i = 3; i < process.argv.length; i++){
      combinedStr += process.argv[i]+" "
    }
    let text = "INSERT INTO todo (task, complete, date_created, date_completed) VALUES ($1, $2, $3, $4)";
    var date = new Date();
    var months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
    var formattedDate = date.getDate() + "-" + months[date.getMonth()] + "-" + date.getFullYear() + "-" + date.getHours()+date.getMinutes()+"H";
    const values = [combinedStr,false,formattedDate, ""];
    client.query(text, values, queryDoneCallback);
  //marking item in todo task list as done
  }else if (process.argv[2] === "done"){
    //figure out which id is being marked as done and add date completed
    let text = "UPDATE todo SET complete=$1, date_completed=$2 where id=" + process.argv[3]+";";
    let date = new Date();
    var months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
    var formattedDate = date.getDate() + "-" + months[date.getMonth()] + "-" + date.getFullYear() + "-" + date.getHours()+date.getMinutes()+"H";
    const values = [true, formattedDate];
    client.query(text, values, queryDoneCallback);
  //unmark items
  }else if (process.argv[2] === "undo"){
    //figure out which id is to be marked as undone and remove date completed
    var dateRemove = ""
    let text = "UPDATE todo SET complete=($1), date_completed=($2) where id=" + process.argv[3]+";";
    const values = [false,dateRemove];
    client.query(text, values, queryDoneCallback);
  }else if (process.argv[2] === "delete"){
    let text = "DELETE FROM todo WHERE id="+process.argv[3]+";"
    client.query(text, queryDoneCallback);
  }
};
//send query to database to retrieve all records for display on console
let output = "SELECT * FROM todo order by id;"
client.query(output, queryDoneCallback);
}

client.connect(clientConnectionCallback);
