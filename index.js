const pg = require('pg');
const configs = {
    user: 'chelseaee',
    host: '127.0.0.1',
    database: 'todo',
    port: 5432,
};
const client = new pg.Client(configs);
const d = new Date();
const today = `${d.getDate()}/${(d.getMonth()+1)}/${d.getFullYear()}`
const now = `${d.getHours()}:${d.getMinutes()}:${d.getSeconds()}`
const command = process.argv[2]

let queryDoneCallback = (err, res) => {
    if (err) {
        console.log("query error", err.message);
    } else {
        formatDisplay(res);
    }
    client.end();
};

let clientConnectionCallback = (err) => {

    if (err) {
        console.log("error", err.message);
    }

    //ADD ITEMS INTO TO-DO LIST.
    if (command === 'add') {
        const inputs = process.argv.slice(3).join(" ");
        let text = `INSERT INTO items (name) VALUES ('${inputs}') RETURNING id, name`;
        client.query(text, queryDoneCallback);

        //COMPLETE ITEMS INTO TO-DO LIST.
    } else if (command === 'done') {
        const targetItem = process.argv[3];
        const script = `UPDATE items SET completion = TRUE, completed_at = CURRENT_TIMESTAMP WHERE id=${targetItem}`
        client.query(script, queryDoneCallback);

        //DISPLAY ITEMS INTO TO-DO LIST.
    } else if (command === 'show') {
        client.query(`SELECT * FROM items`, queryDoneCallback);

        // ARCHIVE AN ITEM IN THE TO-DO LIST.
    } else if (command === 'archive') {
        const targetItem = process.argv[3];
        const script = `UPDATE items SET archived = TRUE WHERE id=${targetItem}`
        client.query(script, queryDoneCallback);

        // UN-ARCHIVE AN ITEM IN THE TO-DO LIST.
    } else if (command === 'unarchive') {
        const targetItem = process.argv[3];
        const script = `UPDATE items SET archived = FALSE WHERE id=${targetItem}`
        client.query(script, queryDoneCallback);

        // USE ONE OF THE STATS COMMANDS.
    } else if (command === 'stats') {
        const statQuery = process.argv[3]
        let script;
        switch (statQuery) {

            // GET THE AVERAGE COMPLETION TIME OF EACH TASK.
            case 'complete-time':
                script = `SELECT *, EXTRACT(EPOCH FROM (completed_at - created_at)/60)  as mins_diff from items`
                client.query(script, getAvgTime);
                break;
                // GET THE TASKS WITH THE LONGEST / SHORTEST COMPLETION TIME.
            case 'best-worst':
                script = `SELECT *, EXTRACT(EPOCH FROM (completed_at - created_at)/60) as mins_diff from items WHERE completion = true ORDER BY mins_diff ASC`
                client.query(script, bestWorst)
                break;
                // GET THE AVERAGE NUMBER OF ITEMS ADDED PER DAY.
            case 'add-time':
                script = `SELECT name, date(created_at) AS date FROM items WHERE completion = true;`
                client.query(script, avgItemsPerDay)
                break;
                //GET THE ITEMS CREATED BETWEEN TWO DATES.
            case 'between':
                var date1 = process.argv[4];
                var date2 = process.argv[5];
                if (process.argv[6] === 'complete-time') {
                    let order = (process.argv[7]).toLowerCase();
                    script = `SELECT * FROM items WHERE date(created_at) BETWEEN to_date('${date1}', 'DD/MM/YY') AND to_date('${date2}', 'DD/MM/YY') ORDER BY EXTRACT(EPOCH FROM (completed_at - created_at)/60) ${order}`;
                } else {
                    script = `SELECT * FROM items WHERE date(created_at) BETWEEN to_date('${date1}', 'DD/MM/YY') AND to_date('${date2}', 'DD/MM/YY')`;
                }
                client.query(script, queryDoneCallback);
                break;
                //GET THE ITEMS THAT WERE COMPLETED BETWEEN TWO DATES.
            case 'completed-between':
                var date1 = process.argv[4];
                var date2 = process.argv[5];
                script = `SELECT * FROM items WHERE date(completed_at) BETWEEN to_date('${date1}', 'DD/MM/YY') AND to_date('${date2}', 'DD/MM/YY')`
                client.query(script, queryDoneCallback);
                break;
            default:
                return console.log(`Error. Stat query not found.`)
                break;
        }
    }
};

client.connect(clientConnectionCallback);


// ======= HELPER FUNCTIONS ============
const formatDisplay = res => {
    res.rows.forEach(item => {
        if (item.archived) {
            return;
        }
        let box = `[ ]`
        if (item.completion) {
            box = `[X]`
            let output = `${item.id}. ${box} - ${item.name} \n Created: ${item.created_at} \n Completed: ${item.completed_at} \n =======================`;
            colorLog('green', output);
        } else {
            let output = `${item.id}. ${box} - ${item.name} \n Created: ${item.created_at} \n =======================`;
            colorLog('red', output)
        }
    });
};

//Get the average time of completion for all the items.

const getAvgTime = (err, res) => {
    if (err) {
        console.log("query error", err.message);
    } else {
        const array = res.rows
        const theNums = array.map(item => item.mins_diff);
        const theSum = theNums.reduce((a, b) => a + b);
        const averageMins = (theSum / theNums.length).toFixed(1);
        colorLog('lavender', `Average minutes to complete a task: ${averageMins}`)
    }
    client.end();
};

//Get the items with the longest (worst) and shortest (best) completion times.
const bestWorst = (err, res) => {

    err && console.log(`Query error`, err.message)

    const array = res.rows;
    const best = array.shift();
    const worst = array.pop();
    let itemDisplay = item => `${item.id}. ${item.name} | Completed in ${item.mins_diff} mins`
    let output = `Fastest item: \n ${itemDisplay(best)} \n\n Slowest item: \n ${itemDisplay(worst)}`
    colorLog('lavender', output);
    client.end();
}

const avgItemsPerDay = (err, res) => {
    err && console.log(`Query error`, err.message)
    const array = res.rows;
    let noOfDays = 1;

    array.forEach((item, index) => {
        let nextItem = array[index+1]
        let thisDate = item.date.toString();

        //If this is not the last item in the array
        if (nextItem) {
            let nextDate = nextItem.date.toString();

            //And the next date is not the same, add to noOf Days.
            if (thisDate!==nextDate) {
                noOfDays++;        
            }
            //If this is the last item in the array, save the latest count into the array.
        }
    })
    const avgNoPerDay = array.length / noOfDays;
    colorLog('lavender', `Average number of items created per day = ${avgNoPerDay}`);
    client.end();
}


//Function to format colors of console logs: lavender, green or red.
const colorLog = (col, output) => {
    let r;
    let g;
    let b
    switch (col) {
        case 'lavender':
            r = 181;
            g = 126;
            b = 220
            break;
        case 'red':
            r = 230;
            g = 0;
            b = 0;
            break;
        case 'green':
            r = 0;
            g = 230;
            b = 0
            break;
        case 'white':
            r = 255;
            g = 255;
            b = 255;
            break;
        default:
            r = 255;
            g = 255;
            b = 255;
            break;
    }
    console.log(`\x1b[38;2;${r};${g};${b}m%s\x1b[0m`, output);
}