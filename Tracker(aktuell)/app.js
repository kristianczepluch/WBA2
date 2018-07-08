const express = require("express");
const app = express ();
const https = require('https');
const fs = require('fs');
const request = require('request');
const bodyParser = require('body-parser');

const settings = {
  port: 3000
};



app.use(bodyParser.json());

// Errorhandler
app.use(function(err,req,res,next){
  console.error(err.stack);
  res.end(err.status + ' ' + err.messages);
});



//ROUTING

//Einbinden modul user-index / eintrag-index
const user = require ('./user');

//binden der Routen an App
app.use("/user", user);


// REQUESTS an den Microservice


app.get('/gerichte', bodyParser.json(), function (req, res){ // Anfrage alle Gerichte an Microservice
var url = 'xyxyxy/gerichte';

request(url, function (err,response,body){
  body = JSON.parse(body);
  res.json(body);
  });
});


app.get('/beilagen', bodyParser.json(), function (req,res){ // Beilagen
  var url = 'xyxyxy/gerichte';

  request(url, function (err,response,body){
    body = JSON.parse(body);
    res.json(body);
    });
});



app.get('/gerichte/:gerichtId/:userId', bodyParser.json(), function (req,res){ //Festlegen des Eintrags
var gerichtId = req.params.gerichtId;
var url = 'xyxyxy/gerichte/'+ gerichtId;

request(url, function (err,response,body){
 res.send('Ausgewähltes Gericht übermittelt');
  });
});

app.get('/beilagen/:beilageId/:userId', bodyParser.json(), function (req,res){ //Festlegen des Eintrags
var beilageId = req.params.beilageId;
var url = 'xyxyxy/gerichte/'+ beilageId;

request(url, function (err,response,body){
 res.send('Ausgewählte Beilage übermittelt');
  });
});




app.listen(settings.port, function(){
console.log("Tracker App läuft auf Port " + settings.port);
})
