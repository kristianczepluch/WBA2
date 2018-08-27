const express = require("express");
const app = express();
const http = require('http');
const https = require('https');
const fs = require('fs');
const request = require('request');
const bodyParser = require('body-parser');

const settings = {
  port: 3001
};



app.use(bodyParser.json());



// Errorhandler
app.use(function(err, req, res, next) {
  console.error(err.stack);
  res.end(err.status + ' ' + err.messages);
});



//ROUTING

//Einbinden modul user-index
const User = require('./User');

//binden der Routen an App
app.use("/User", User);


// REQUEST an den Microservice - Speiseplan

function getSpeiseplan(url) {

  return new Promise(function(resolve, reject) {
    request.get(url, function(err, response, body) {
      body = JSON.parse(body);
      var speiseplan = body;
      if (speiseplan) {
        resolve(speiseplan);
      } else reject("Kein Speiseplan erhalten");
    });
  });
}



app.get('/MensaGm/Speiseplan/:kalenderwoche/:wochentag', function(req, res) {
  var kw = req.params.kalenderwoche;
  var wt = req.params.wochentag;
  var url = 'https://microserviceserver.herokuapp.com/MensaGm/Speiseplan/' + kw + '/' + wt;

  var speiseplan = getSpeiseplan(url);

  speiseplan.then(function(result) {
    res.status(200).json(result);
    return;
  });

});








app.listen(settings.port, function() {
  console.log("Tracker App läuft auf Port " + settings.port);
})
