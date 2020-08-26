const pg = require('pg');
const moment=require('moment')

const configs = {
    user: 'clairetay',
    host: '127.0.0.1',
    database: 'todo',
    port: 5432,
};

const pool = new pg.Pool(configs);
pool.on('error', function (err) {
  console.log('idle client error', err.message, err.stack);
});

let userInputs = process.argv.slice(3)
let command = process.argv[2]

if(command=="show"){
    let queryText="SELECT *, TO_CHAR( created_at,'DD-Mon-YYYY HH:MI:SS') AS reform_create, TO_CHAR( updated_at,'DD-Mon-YYYY HH:MI:SS') AS reform_update FROM items"
    pool.query(queryText, (err, res)=>{
        if(err){
            console.log(err)
        }else{
            let itemList = res.rows
            itemList.forEach((item)=>{
                if(!item.archived){
                    let columnSpace = 28 - item.name.length
                    console.log(`${item.id}. ${item.done} - ${item.name}`, (" ").repeat(columnSpace),`${item.reform_create}`, (" ").repeat(5), `${item.reform_update}`)
                }
            })
        }
    })
}else if(command=="add"){
    let queryText="INSERT INTO items(name,done) VALUES($1,'[ ]') RETURNING *"
    let value = [userInputs[0]]
    pool.query(queryText, value, (err,res)=>{
        if(err){
            console.log(err)
        }else{
            let newItem = res.rows[0]
            console.log(`New item ${newItem.name} added at ${newItem.id}`)
        }
    })

}else if(command=="done"){
    let queryText = "UPDATE items SET done='[X]',updated_at=now() WHERE id=$1 RETURNING *"
    let value = [userInputs[0]]
    pool.query(queryText, value, (err,res)=>{
        if(err){
            console.log(err)
        }else{
            let updatedItem = res.rows[0]
            console.log(`${updatedItem.name} updated as DONE.`)
        }
    })
}else if(command=="archive"){
    let queryText = "UPDATE items SET archived=TRUE WHERE id=$1 RETURNING *"
    let value = [userInputs[0]]
    pool.query(queryText, value, (err,res)=>{
        if(err){
            console.log(err)
        }else{
            let archivedItem = res.rows[0]
            console.log(`${archivedItem.name} is now archived.`)
            console.log("Item will not be displayed on show.")
        }
    })

}else if(command=="stats"){
    if(userInputs[0]=="complete-time"){
        let queryText = "SELECT *, TO_CHAR( created_at,'DD-Mon-YYYY HH:MI:SS') AS reform_create, TO_CHAR( updated_at,'DD-Mon-YYYY HH:MI:SS') AS reform_update, EXTRACT(epoch FROM updated_at-created_at) AS completion_time FROM items WHERE updated_at IS NOT NULL"
        pool.query(queryText, (err, res)=>{
            if(err){
                console.log(err)
            }else{
                let itemList = res.rows
                let sum = 0
                itemList.forEach((item)=>{
                    sum += item.completion_time
                })
                console.log("Average completion time = " + (sum/(itemList.length*60)).toFixed(2) + " minutes")
            }
        })
    } else if(userInputs[0]=="best-worst"){
        let queryText = "SELECT *, TO_CHAR( created_at,'DD-Mon-YYYY HH:MI:SS') AS reform_create, TO_CHAR( updated_at,'DD-Mon-YYYY HH:MI:SS') AS reform_update, EXTRACT(epoch FROM updated_at-created_at) AS completion_time FROM items WHERE updated_at IS NOT NULL ORDER BY completion_time ASC"
        pool.query(queryText, (err, res)=>{
            if(err){
                console.log(err)
            }else{
                let itemList = res.rows
                console.log("Best completion time: " + itemList[0].name + ", " + (itemList[0].completion_time/60).toFixed(2) + "mins")
                console.log("Worst completion time: " + itemList[itemList.length-1].name + ", " + (itemList[itemList.length-1].completion_time/60).toFixed(2) + "mins")
            }
        })
    } else if(userInputs[0]=="add-time"){
        let queryText = "SELECT COUNT(id), DATE_TRUNC('day',created_at) FROM items GROUP BY DATE_TRUNC('day',created_at)"
        pool.query(queryText, (err, res)=>{
            if(err){
                console.log(err)
            }else{
                let itemList = res.rows
                let totalItems = 0
                itemList.forEach((item)=>{
                    totalItems += item.count
                })
                console.log("Average no of items added per day: " + (totalItems/itemList.length).toFixed(2))
            }
        })
    } else if(userInputs[0]=="between"){
        let order = userInputs[4]=="asc"? "ASC" : "DESC"
        let earlierDate = moment(userInputs[1], "DD-MM-YY")
        let laterDate = moment(userInputs[2], "DD-MM-YY")
        let value = [earlierDate, laterDate]
        let queryText = "SELECT *, TO_CHAR( created_at,'DD-Mon-YYYY HH:MI:SS') AS reform_create, TO_CHAR( updated_at,'DD-Mon-YYYY HH:MI:SS') AS reform_update, EXTRACT(epoch FROM updated_at-created_at) AS completion_time FROM items WHERE updated_at > $1 AND updated_at < $2 ORDER BY completion_time " + order
        pool.query(queryText, value, (err, res)=>{
            if(err){
                console.log(err)
            }else{
                let itemList = res.rows
                itemList.forEach((item)=>{
                    console.log(item.name, item.reform_create, item.reform_update,"Completed in " + (item.completion_time/60).toFixed(0) + "mins")
                })
            }
        })

    }

} else if(command=="between"){
    let earlierDate = moment(userInputs[0], "DD-MM-YY")
    let laterDate = moment(userInputs[1], "DD-MM-YY")
    let value = [earlierDate, laterDate]
    if(userInputs[2]=="create"){
        let queryText = "SELECT *, TO_CHAR( created_at,'DD-Mon-YYYY HH:MI:SS') AS reform_create, TO_CHAR( updated_at,'DD-Mon-YYYY HH:MI:SS') AS reform_update FROM items WHERE created_at > $1 AND created_at < $2"
        pool.query(queryText, value, (err, res)=>{
            if(err){
                console.log(err)
            }else{
                let itemList = res.rows
                itemList.forEach((item)=>{
                    console.log(item.name+" was created at "+item.reform_create)
                })
            }
        })
    } else if (userInputs[2]=="complete"){
        let queryText = "SELECT *, TO_CHAR( created_at,'DD-Mon-YYYY HH:MI:SS') AS reform_create, TO_CHAR( updated_at,'DD-Mon-YYYY HH:MI:SS') AS reform_update FROM items WHERE updated_at > $1 AND updated_at < $2"
        pool.query(queryText, value, (err, res)=>{
            if(err){
                console.log(err)
            }else{
                let itemList = res.rows
                itemList.forEach((item)=>{
                    console.log(item.name+" was completed at "+item.reform_update)
                })
            }
        })

    }
}