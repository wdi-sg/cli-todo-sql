console.log("works!!", process.argv[2]);

const pg = require('pg');

const configs = {
    user: 'postgres',
    host: '127.0.0.1',
    database: 'todo',
    port: 5432,
};

const client = new pg.Client(configs);
operator = process.argv[2];
itemToDo = process.argv[3];
date1 = process.argv[4]
console.log(itemToDo);

let queryDoneCallbackAdd = (err, result) => {
    if (err) {
      console.log("query error", err.message);
    } else {
        result.rows.forEach(obj=>{
            console.log(`${obj.id}. ${obj.status} - ${obj.todo} ${obj.created_at}`)
        })
      // console.log("result", result );
    }
    client.end();
};

let clientConnectionCallbackAdd = (err) => {

  if( err ){
    console.log( "error", err.message );
  }
  let text = 'INSERT INTO items (todo, status) VALUES ($1,$2) RETURNING id';

  const values = [itemToDo,` [ ]`,];

  client.query(text, values, queryDoneCallbackAdd);
};

let queryDoneCallbackShow = (err, result) => {
    if (err) {
      console.log("query error", err.message);
    } else {
        result.rows.forEach(obj=>{
            console.log(`${obj.id}. ${obj.status} - ${obj.todo} ${obj.created_at}`)
        })
      // console.log("result", result );
    }
    client.end();
};

let clientConnectionCallbackShow = (err) => {

  if( err ){
    console.log( "error", err.message );
  }
  let text = 'SELECT * FROM items Order By id';

  // const values = [`${itemToDo}`,` [ ]`];

  client.query(text, queryDoneCallbackShow);
};

let queryDoneCallbackUpdateSort = (err, res) => {
    if (err) {
      console.log("query error", err.message);
    } else {
            res.rows.forEach(obj=>{
            console.log(`${obj.id}. ${obj.status} - ${obj.todo} ${obj.created_at} ${obj.updated_at}`)
            })
    }
    client.end();
};

let queryDoneCallbackUpdate = (err, result) => {
    if (err) {
      console.log("query error", err.message);
    } else {
            let text = 'SELECT * FROM items Order By id';

            client.query(text, queryDoneCallbackUpdateSort);
    }
};

let clientConnectionCallbackUpdate = (err) => {

  if( err ){
    console.log( "error", err.message );
  }
  let text = 'UPDATE items SET status = $1, updated_at =CURRENT_TIMESTAMP WHERE id = $2';

  const values = [` [X]`,`${itemToDo}`];

  client.query(text, values, queryDoneCallbackUpdate);
};

let queryDoneCallbackUpdateDel = (err, res) => {
    if (err) {
      console.log("query error", err.message);
    } else {
            res.rows.forEach(obj=>{
            console.log(`${obj.id}. ${obj.status} - ${obj.todo} ${obj.created_at}`)
            })
    }
    client.end();
};

let queryDoneCallbackDel = (err, result) => {
    if (err) {
      console.log("query error", err.message);
    } else {
            let text = 'SELECT * FROM items Order By id';

            client.query(text, queryDoneCallbackUpdateDel);
    }
};

let clientConnectionCallbackDel = (err) => {

  if( err ){
    console.log( "error", err.message );
  }
  let text = 'DELETE FROM items WHERE id=$1';

  const values = [`${itemToDo}`];

  client.query(text, values, queryDoneCallbackDel);
};

let fuckingHell = (err, result) => {
    if (err) {
      console.log("query error", err.message);
    } else {
            let ohNo = result.rows.map((object,index)=>{
                return (object.updated_at - object.created_at)/60000
            })
            let fucK = ohNo.filter((value,index)=>{
                if (ohNo[index]>0){
                    return ohNo[index];
                }
            })
            totalTime = fucK.reduce((total,b)=>{
                return total + b;
            })
            avgTime = totalTime/fucK.length;
            console.log(`${avgTime} minutes`)
    }
};

let fuckThisShit = (err) => {

  if( err ){
    console.log( "error", err.message );
  }
  let text = 'SELECT * FROM items';

  client.query(text, fuckingHell);
};

let queryDonepullDate = (err, result) => {
    if (err) {
      console.log("query error", err.message);
    } else {
            let array = result.rows.map((date)=>{
                return date.created_at.getTime()})
            uniqueDays = [...new Set(array)];
            avgPerDay = array.length/uniqueDays.length;
            console.log(`${avgPerDay} items added per day`)
    }
};

let pullDate = (err) => {

  if( err ){
    console.log( "error", err.message );
  }
  let text = 'SELECT created_at::DATE FROM items';

  client.query(text, queryDonepullDate);
};

let bestWorstup = (err, result) => {
    if (err) {
      console.log("query error", err.message);
    } else {
            let ohNo = result.rows.map((object,index)=>{
                return (object.updated_at - object.created_at)/60000
            })
            let fucK = ohNo.filter((value,index)=>{
                if (ohNo[index]>0){
                    return ohNo[index];
                }
            })
            sLowest = Math.max(...fucK);
            faStest = Math.min(...fucK);
            console.log(`${sLowest}mins---slowest  ${faStest}mins----fastest`)
    }
};

let bestWorst = (err) => {

  if( err ){
    console.log( "error", err.message );
  }
  let text = 'SELECT * FROM items';

  client.query(text, bestWorstup);
};

let queryDoneCallbackaddBetween = (err, result) => {
    if (err) {
      console.log("query error", err.message);
    } else {
            result.rows.forEach((obj)=>{
                console.log(obj.todo)
            })
    }
};

let clientConnectionCallbackaddBetween = (err) => {

  if( err ){
    console.log( "error", err.message );
  }
  let text = 'SELECT todo FROM items WHERE created_at BETWEEN $1 and $2';

  const values = [`${itemToDo}`,`${date1}`];

  client.query(text, values, queryDoneCallbackaddBetween);
};

let queryDoneCallbackcompletedBetween = (err, result) => {
    if (err) {
      console.log("query error", err.message);
    } else {
            result.rows.forEach((obj)=>{
                console.log(obj.todo)
            })
    }
};

let clientConnectionCallbackcompletedBetween = (err) => {

  if( err ){
    console.log( "error", err.message );
  }
  let text = 'SELECT todo FROM items WHERE updated_at BETWEEN $1 and $2';

  const values = [`${itemToDo}`,`${date1}`];

  client.query(text, values, queryDoneCallbackcompletedBetween);
};

switch(operator){
    case "add":
        client.connect(clientConnectionCallbackAdd);
        break;
    case "show":
        client.connect(clientConnectionCallbackShow);
        break;
    case "update":
        client.connect(clientConnectionCallbackUpdate);
        break;
    case "del":
        client.connect(clientConnectionCallbackDel);
        break;
    case "fuck":
        client.connect(fuckThisShit);
        break;
    case "stats":
            if(itemToDo === 'add-time'){
                      client.connect(pullDate);
                  } else if(itemToDo === 'best-worst'){
                      client.connect(bestWorst);
                  } else {console.log("KEY IN SOMETHING PROPER YOU MORON")};
                  break;
    case "addbetween":
        client.connect(clientConnectionCallbackaddBetween);
        break;
    case "completedbetween":
        client.connect(clientConnectionCallbackcompletedBetween);
        break;
    default:
        console.log("KEY IN SOMETHING PROPER YOU MORON")
}