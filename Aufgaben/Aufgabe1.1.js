/*
Created on 14.04.2018 
Reading out asynchornious data from a JSON file and printing it out formatted */


var fs = require("fs");
var chalk = require("chalk");

fs.readFile('staedte.json','utf8', function (err, data) {
  if (err)throw err;
  var jsonContent = JSON.parse(data);
  
for(var a=0;a<jsonContent.cities.length;a++){
    console.log(chalk.blue(jsonContent.cities[a].name));
    console.log(chalk.red(jsonContent.cities[a].country));
    console.log(chalk.green(jsonContent.cities[a].population));
    console.log(" --------------------------------- "); }    
});