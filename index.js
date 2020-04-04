const jsonfile = require('jsonfile');
const { DateTime } = require("luxon");
DateTime.local();
const { Interval } = require("luxon");
const { Duration }= require("luxon");


const file = 'data.json'

let newKey = process.argv[2]
let newValue = process.argv[3]
let nDate;
let dt;
let nMilli = 0;
let timeTotal = 0;
let averageTime = 0;
let counter = 0;

jsonfile.readFile(file, (err, obj) => {
    //----------------------------------show
    if( process.argv[2] == "show") {

        console.log(obj)

        for (let i=0 ; i<obj.todoItems.length ; i++){

            let x = i+1;
            console.log(x+". "+obj.brac[i]+" - "+obj.todoItems[i]+" - "+obj.date[i]);
        }
    }
    //------------------------------------clear
    if (process.argv[2] == "clear") {

        obj.brac = [];
        obj.todoItems = [];
        obj.date = [];
        obj.diff = [];
        console.log(obj)
    }
    //-------------------------------------add
    if (process.argv[2] == "add") {
        if (obj.todoItems == undefined) {
            obj.brac = [];
            obj.todoItems = [];
            obj.date = [];
            obj.diff = [];

            createDate();
            obj.brac.push("[ ]");
            obj.todoItems.push(process.argv[3]);
            obj.date.push(nDate);
            obj.diff.push(nMilli);
        }
        else {

            createDate();
            obj.brac.push("[ ]");
            obj.todoItems.push(process.argv[3]);
            obj.date.push(nDate);
            obj.diff.push(nMilli);
        }
    }
    //---------------------------------------done
    if(process.argv[2] == 'done') {
        let i = process.argv[3] - 1;
        obj.brac[i] = "[x]"; //mark X

        createDate();
        let timeDiff = (nMilli - parseInt(obj.diff[i])); //calculate difference
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
                if(obj.brac[i]="[x]") {
                    timeTotal += obj.diff[i]; //add list that has done
                    counter++;
                    console.log(milliConvert(obj.diff[i])); //display all completion time
                }
            }
            averageTime = timeTotal/counter;
            averageTime = milliConvert(averageTime);  //convert average time to 0:16:11
            console.log("Average completion time for "+counter+" items, "+averageTime)
        }

    }

    jsonfile.writeFile(file, obj, (err) => {
        console.log(err)
    });
});

let createDate = function () {
    dt = DateTime.local();
    var f = {month: 'long', day: 'numeric'};
    nDate = dt.toLocaleString(DateTime.DATETIME_MED);
    nMilli = dt.toMillis();
    //console.log(nMilli)
}
//createDate();

let test = function () {
    let i1 = DateTime.fromISO('1982-05-25T09:45');
    let i2 = DateTime.fromISO('1983-10-14T10:30');
    console.log(i1)
    // console.log(typeof i1)
    // console.log(typeof i2)
    // console.log(i2.diff(i1).toObject()) //=> { milliseconds: 43807500000 }
    // console.log(i2.diff(i1, 'hours').toObject()) //=> { hours: 12168.75 }
    // console.log(i2.diff(i1, ['months', 'days']).toObject()) //=> { months: 16, days: 19.03125 }
    // console.log(i2.diff(i1, ['months', 'days', 'hours']).toObject()) //=> { months: 16, days: 19, hours: 0.75 }

}
//test();

let milliConvert = function (x) {
    ms = parseInt(x);
    ms = 1000*Math.round(ms/1000); // round to nearest second
    let d = new Date(ms);
    newMs = d.getUTCHours()+':'+d.getUTCMinutes()+':'+d.getUTCSeconds(); // "4:59"
    return newMs;
}