const fs = require("fs");

const csvClasses = fs.readFileSync("./src/data/classes.csv");

const csvClassesArr = csvClasses.toString().split("\n");

let classesResult = [];

let classesHeaders = csvClassesArr[0].split(",");

for (let i = 1; i < csvClassesArr.length; i++) {
  let classObj = {};
  let classRowStr = csvClassesArr[i].split(",");
  for (let j = 0; j < classesHeaders.length; j++) {
    classObj[classesHeaders[j]] = classRowStr[j];
  }
  classesResult.push(classObj);
}

let classesJSON = JSON.stringify(classesResult);
fs.writeFileSync("./data/classes.json", classesJSON);
