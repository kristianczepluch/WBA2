const express = require ('express');
var fs = require ("fs");
var tracker = express();
var trackerEintraege[];

tracker.use(expree.json());

fs.readFile('./uniEssen.json','utf8', function(err,data){
  if (err){
    throw err;
    }
  var jsonContent=JSON.parse(data);
})

for (var i=0, i< trackerEintraege.length,i++){


}


tracker.get('/', function(req,res){
res.send ("Foodtracker");
})

tracker.get('/')
