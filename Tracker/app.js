const express = require("express");
var app = express ();

const settings = {
  port: 3000
  //datafile: "./eintragInfo.json"
};

// Errorhandler
app.use(function(err,req,res,next){
  console.error(err.stack);
  res.end(err.status + ' ' + err.messages);
});

//app.use(function(req,res,next){=

//ROUTING

//Einbinden modul user-index / eintrag-index
const user = require ('./user');
const eintrag = require('./eintrag');
//binden der Routen an App
app.use("/user", user);
app.use("/eintrag", eintrag);

app.get("/", function(req,res){
  res.send("Willkommen im Tracker")
});

app.listen(settings.port, function(){
console.log("Tracker App läuft auf Port " + settings.port);
})
