/*
Created on 14.04.2018 
Reading out asynchornious data from a JSON file and printing it out formatted */


var fs = require("fs");

fs.readFile('staedte.json','utf8', function (err, data) {
  if (err)throw err;
  var jsonContent = JSON.parse(data);

for(var a=0;a<18;a++){
    var s = JSON.stringify(jsonContent.cities[a]);
    ausgabe(s);
    console.log("\n----------------------\n");}
});


// functions that erases '{'  ,  '}'  ','  and adds linebreaks after every '",'
function ausgabe(s){
   for(i=0;i<s.length;i++){
    if(s[i]=="{" || s[i]=="}" ) { }
    else if(s[i]+s[i-1]==("\",")) {
        process.stdout.write("\n");}
    else if(s[i]=="\"") { }
    else process.stdout.write(s[i]);
     } 
}