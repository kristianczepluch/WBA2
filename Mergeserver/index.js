const express = require('express');
const https = require('https');
var fs = require("fs");
const app = express();
app.use(express.json());

function getkcal(nahrungsmittel) {
  const URL = "https://api.edamam.com/api";
  const path = "/food-database/parser?ingr=" + nahrungsmittel + "&app_id=0931d8e1&app_key=d5bc406aaecb8b39cb511c6dd792bc39&";
  var ReqURL = URL + path;

  https.get(ReqURL, (resp) => {
    let data = '';

    // A chunk of data has been recieved.
    resp.on('data', (chunk) => {
      data += chunk;
    });

    // The whole response has been received. Print out the result.
    resp.on('end', () => {
      var newData = JSON.parse(data);
      var result = newData.hints[0].food.nutrients.ENERC_KCAL;
      return result;
    });

  }).on("error", (err) => {
    console.log("Error: " + err.message);
  });
}

// 1.) Man kriegt einen Namen von einem Gericht
// 2.) Man schickt an den Uniserver /gerichte/ den Namen
// 3.) Man kriegt eine Datei heraus und schickt dann eine Kcal abfrage für das Gericht
// 4.) Man rechnet die Grammzahlen um und erstellt ein neues JS Object in dem man zusätzlich die Kcal speichert und Kcalgesamt
// 5.) Man ruft POST bei dem Trackerserver auf mit den Informationen

app.get("/Mensaessen/:gericht/:beilage1/:beilage2", (req, res) => {
  // 1.)
  var gericht = req.params.gericht;
  var beilage1 = req.params.beilage1;
  var beilage2 = req.params.beilage2;

  const UniserverUrl = "http://localhost:3000";
  var pfadGerichte = "/gerichte/";
  var pfadBeilagen = "/beilagen/";

  var abfrage1 = UniserverUrl + pfadGerichte + gericht;
  var abfrage2 = UniserverUrl + pfadBeilagen + beilage1;
  var abfrage3 = UniserverUrl + pfadBeilagen + beilage2;


});


// Get the Port which is set by environment or 3000 by default
const port = process.env.PORT || 3001;
app.listen(port, () => console.log("Listening on port " + port + "..."));
