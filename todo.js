const jsonfile = require('jsonfile');
const { DateTime } = require("luxon");
DateTime.local();


const file = 'data.json'

let newKey = process.argv[2]
let newValue = process.argv[3]
let nDate;
let dt;
let nMilli = 0;
let timeTotal = 0;
let averageTime = 0;
let counter = 0;
let dayCount = 0;
let newDate = 0;
let bestWorst = {};

jsonfile.readFile(file, (err, obj) => {
    //----------------------------------show
    if( process.argv[2] == "show") {

        console.log(obj)
        console.log(obj[1])
        for (let i=0 ; i<obj.todoItems.length ; i++){

            let x = i+1;
            console.log(x+". "+obj.brac[i]+" - "+obj.todoItems[i]+" - "+obj.date[i]);
        }
    }
    //------------------------------------clear
    if (process.argv[2] == "clear") {

         obj = {};

        console.log(obj)
    }
    //-------------------------------------add
    if (process.argv[2] == "add") {
        if (obj.todoItems == undefined) {
            obj.brac = [];
            obj.todoItems = [];
            obj.date = [];
            obj.milli = [];
            obj.diff = [];
            obj.day = [];
            obj.addTime = {};

            createDate();


            obj.brac.push("[ ]");
            obj.todoItems.push(process.argv[3]);
            obj.date.push(nDate);
            obj.milli.push(nMilli);
            obj.day.push(nDay);

            obj.addTime[nDay] = 1;

            console.log(obj);
        }
        else {

            createDate();
            obj.brac.push("[ ]");
            obj.todoItems.push(process.argv[3]);
            obj.date.push(nDate);
            obj.milli.push(nMilli);
            obj.day.push(nDay);

            obj.addTime[nDay] += 1;
            // if(obj[nDay] == undefined) {
            //     obj[nDay] = 1;
            //     newDate += 1;
            // }
            // if(obj[nDay] != undefined) {
            //     obj[nDay] += 1;
            // }
            console.log(obj);
            //dateCounter();
        }
    }
    //---------------------------------------done
    if(process.argv[2] == 'done') {
        let i = process.argv[3] - 1;
        obj.brac[i] = "[x]"; //mark X

        createDate(); //create nMilli and nDate
        let timeDiff = (nMilli - parseInt(obj.milli[i])); //calculate difference
        obj.diff[i] = timeDiff; //replace with timeDifference in milliseconds
        obj.date[i] = nDate;    //replace with new Date.

        console.log(obj);
    }

    jsonfile.writeFile(file, obj, (err) => {
        console.log(err)
    });
    //--------------------------------------stats
    if(process.argv[2] == 'stats') {

        if(process.argv[3] == 'complete-time') {
            for(let i=0 ; i<obj.todoItems.length ; i++) {
                if(obj.brac[i] == "[x]") {
                    timeTotal += obj.diff[i]; //add list that has done
                    counter++;
                    console.log((i+1)+". Completed time: "+milliConvert(obj.diff[i])); //display all completion time
                }
            }
            averageTime = timeTotal/counter;
            averageTime = milliConvert(averageTime);  //convert average time to 0:16:11
            console.log("Average completion time for "+counter+" items, "+averageTime)
        }
        //---------------------------------------add time
        if(process.argv[3] == 'add-time') {
            console.log(obj)
            console.log(obj.addTime)
            let list = obj.addTime;

            const keyValue = (input) => Object.entries(input).forEach(([key,value]) => {
              console.log("On the "+key+", there is "+value+" items added.");
            })
            keyValue(list)

        }
        //---------------------------------------bestworst
        if(process.argv[3] == 'best-worst') {
            console.log(obj.todoItems);
            console.log(obj.diff);
            for (let i=0 ; i<obj.todoItems.length ; i++) {
                bestWorst[obj.todoItems[i]] = obj.diff[i];
            }
            console.log(bestWorst);
            let sorted = Object.keys(bestWorst).sort((a,b) => bestWorst[a]-bestWorst[b])
            console.log(sorted)

        }
    }

    jsonfile.writeFile(file, obj, (err) => {
        console.log(err)
    });
});

// let dateCounter = function () {
//     if(obj[nDay] == undefined) {
//         obj[nDay] = 1;
//         newDate += 1;
//     }
//     if(obj[nDay] != undefined) {
//         obj[nDay] += 1;
//     }
// }

let createDate = function () {
    dt = DateTime.local();
    var f = {month: 'long', day: 'numeric'};
    nDate = dt.toLocaleString(DateTime.DATETIME_MED);
    nMilli = dt.toMillis();
    nDay = dt.toFormat('dd LLL');
}

let milliConvert = function (x) {
    ms = parseInt(x);
    ms = 1000*Math.round(ms/1000); // round to nearest second
    let d = new Date(ms);
    newMs = d.getUTCHours()+':'+d.getUTCMinutes()+':'+d.getUTCSeconds(); // "4:59"
    return newMs;
}

function sortNumber(a, b) {
  return a - b;
}