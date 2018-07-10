const express = require("express");
const app = express ();
const http=require('http');
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
  body = JSON.parse(body);   //Falls Fehler evtl. -> res.end(body);
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



app.get('MensaGm/gerichte/:gericht', bodyParser.json(), function (req,res){ //Festlegen des Eintrags
var gericht = req.params.gericht;
var url = 'xyxyxy/gerichte/'+ gericht;

request(url, function (err,response,body){
 res.send('Ausgewähltes Gericht übermittelt');
  });
});

app.get('MensaGm/beilagen/:beilage', bodyParser.json(), function (req,res){ //Festlegen des Eintrags
var beilage = req.params.beilage;
var url = 'xyxyxy/gerichte/'+ beilage;

request(url, function (err,response,body){
 res.send('Ausgewählte Beilage übermittelt');
}); // wenn Promise da, Post mit result...
});






app.listen(settings.port, function(){
console.log("Tracker App läuft auf Port " + settings.port);
})
