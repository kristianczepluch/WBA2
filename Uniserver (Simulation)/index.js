const express = require('express');
var fs = require("fs");
const app = express();
app.use(express.json());

// json file auslesen und zu einem js Object umwandeln
// mit allen Gerichten
var x = fs.readFileSync('Gerichte.json', 'utf8');
var jsonContent = JSON.parse(x);

var a = fs.readFileSync('AlleGerichte.json', 'utf8');
var alleGerichte = JSON.parse(a);


// Our routes
const gerichte_alle = '/api/gerichte';
const gerichte_spez = '/api/gerichte/:Wochentag';
const gerichte_inhalt = '/api/inhalte';
const gerichte_inhalt_byid = '/api/inhalte/:id';


console.log(jsonContent.Dienstag[0].name);

app.get('/', (req, res) => {
  res.send("Hello World");
});

app.get(gerichte_alle, (req, res) => {
  res.send(alleGerichte);
});

app.get(gerichte_spez, (req, res) => {
  if (req.params.Wochentag === "Montag") {
    res.send(jsonContent.Montag);
  }

  if (req.params.Wochentag === "Dienstag") {
    res.send(jsonContent.Dienstag);
  }

  if (req.params.Wochentag === "Mittwoch") {
    res.send(jsonContent.Mittwoch);
  }

  if (req.params.Wochentag === "Donnerstag") {
    res.send(jsonContent.Donnerstag);
  }

  if (req.params.Wochentag === "Freitag") {
    res.send(jsonContent.Freitag);
  }
});

app.get(gerichte_inhalt, (req, res) => {
  res.send(jsonContent);
});

app.get(gerichte_inhalt_byid, (req, res) => {
  for (var i = 0; i < 3; i++) {
    if (jsonContent.Montag[i].name === req.params.id) {
      res.send(jsonContent.Montag[i]);
      return;
    }
    if (jsonContent.Dienstag[i].name === req.params.id) {
      res.send(jsonContent.Dienstag[i]);
      return;
    }
    if (jsonContent.Mittwoch[i].name === req.params.id) {
      res.send(jsonContent.Mitwoch[i]);
      return;
    }
    if (jsonContent.Donnerstag[i].name === req.params.id) {
      res.send(jsonContent.Donnerstag[i]);
      return;
    }
    if (jsonContent.Freitag[i].name === req.params.id) {
      res.send(jsonContent.Freitag[i]);
      return;
    }
  }
});


// Get the Port which is set by environment or 3000 by default
const port = process.env.PORT || 3000;
app.listen(port, () => console.log("Listening on port " + port + "..."));
