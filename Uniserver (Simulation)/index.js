/*
Server Info:
Dieser Server soll die API der Mensa simulieren, da wir auf diese keinen Zugriff bekommen.
Da dies nicht der Hauptteil unseres Projektes sein soll haben wir uns dazu entschlossen nur die für uns relevanten
GET Abfragen zu implementieren. Der Hauptfokus unseres Projektes soll auf dem Kalorien-Tracker-Server liegen und
auf dem Microservice, welcher die Kilokalorien der Unigerichte berechnet!
*/

// Unsere Module:
const express = require('express');
var fs = require("fs");
const app = express();
app.use(express.json());

// Das Jason-File mit unseren Informationen zu den Gerichten wird ausgelesen und vorgespeichert.
var x = fs.readFileSync('Gerichte.json', 'utf8');
var jsonContent = JSON.parse(x);

var a = fs.readFileSync('AlleGerichte.json', 'utf8');
var alleGerichte = JSON.parse(a);


// Unsere Routen:
const gerichte = '/api/gerichte';
const beilagen = '/api/beilagen';
const kalnderwochen = '/api/kalenderwochen';
const wochentage = '/api/wochentage'
const beilagen_id = '/api/beilagen/:beilage';
const gerichte_id = '/api/gerichte/:gericht';
const kalenderwochen_id_wochentage = '/api/kalenderwochen/:id/wochentage';
const kalenderwochen_id_wochentage_id_gerichte = '/api/kalenderwochen/:kalenderwoche/wochentage/:wochentag/gerichte';
const kalenderwochen_id_wochentage_id_gerichte_id = '/api/kalenderwochen/:kalenderwoche/wochentage/:wochentag/gerichte/:gericht';
const kalenderwochen_id_wochentage_id_beilagen = '/api/kalenderwochen/:kalenderwoche/wochentage/:wochentag/beilagen';
const kalenderwochen_id_wochentage_id_beilagen_id = '/api/kalenderwochen/:kalenderwoche/wochentage/:wochentag/beilagen/:beilage';


// Alle Server Anfragen:

app.get(gerichte, (req, res) => {
  // Alle Gerichte zurückgeben.
});

app.get(gerichte_id, (req, res) => {
  // Konkrete Gerichte ausgeben.
  const reqGericht = req.params.gericht;
});

app.get(beilagen, (req, res) => {
  // Alle Beilagen zurückgeben.
});

app.get(beilagen_id, (req, res) => {
  // Konkrete Beilagen zurückgeben.
  const reqBeilage = req.params.beilage;
});

app.get(kalnderwochen, (req, res) => {
  // Alle Kalenderwochen zurückgeben.
});

app.get(wochentage, (req, res) => {
  // Alle Wochentage zurückgeben.
});

app.get(kalenderwochen_id_wochentage, (req, res) => {
  // Alle Wochentage der Kalnderwoche die verfügbar sind.
  const reqKalenderwoche = req.params.kalenderwoche;
});

app.get(kalenderwochen_id_wochentage_id_gerichte, (req, res) => {
  // Alle Gerichte einer konkreten Kalenderwoche und eines Wochentags zurückgeben.
  const reqKalenderwoche = req.params.kalenderwoche;
  const reqWochentag = req.params.wochentag;
});

app.get(kalenderwochen_id_wochentage_id_gerichte_id, (req, res) => {
  // Konkretes Gericht einer konkreten Kalenderwoche und eines Wochentags zurückgeben.
  const reqKalenderwoche = req.params.kalenderwoche;
  const reqWochentag = req.params.wochentag;
  const reqGericht = req.params.gericht;
});

app.get(kalenderwochen_id_wochentage_id_beilagen, (req, res) => {
  // Alle Beilagen einer konkreten Kalenderwoche und eines Wochentags zurückgeben.
  const reqKalenderwoche = req.params.kalenderwoche;
  const reqWochentag = req.params.wochentag;

});

app.get(kalenderwochen_id_wochentage_id_beilagen_id, (req, res) => {
  // Konkrete einer konkreten Kalenderwoche und eines Wochentags zurückgeben.
  const reqKalenderwoche = req.params.kalenderwoche;
  const reqWochentag = req.params.wochentag;
  const reqBeilage = req.params.beilage;
});



//  if (req.params.Wochentag === "Montag") {
//    res.send(jsonContent.Montag);


// Alles durchsuchen
/*
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

*/
// Get the Port which is set by environment or 3000 by default
const port = process.env.PORT || 3000;
app.listen(port, () => console.log("Listening on port " + port + "..."));
