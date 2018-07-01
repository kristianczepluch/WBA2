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
const beilagen_id = '/api/beilagen/:beilage';
const gerichte_id = '/api/gerichte/:gericht';
const kalenderwochen_id_wochentage = '/api/kalenderwochen/:kalenderwoche/wochentage';
const kalenderwochen_id_wochentage_id_gerichte = '/api/kalenderwochen/:kalenderwoche/wochentage/:wochentag/gerichte';
const kalenderwochen_id_wochentage_id_gerichte_id = '/api/kalenderwochen/:kalenderwoche/wochentage/:wochentag/gerichte/:gericht';
const kalenderwochen_id_wochentage_id_beilagen = '/api/kalenderwochen/:kalenderwoche/wochentage/:wochentag/beilagen';
const kalenderwochen_id_wochentage_id_beilagen_id = '/api/kalenderwochen/:kalenderwoche/wochentage/:wochentag/beilagen/:beilage';

// Funktion, welche die "Länge" des Objects zurückliefert, welche semantisch der Anzahl der vorhandenen Kalenderwoche ist.
Object.size = function(obj) {
  var size = 0,
    key;
  for (key in obj) {
    if (obj.hasOwnProperty(key)) size++;
  }
  return size;
};

// Funktion, welche doppelte Elemente aus einem Array entfernt.
function uniq(a) {
  var seen = {};
  return a.filter(function(item) {
    return seen.hasOwnProperty(item) ? false : (seen[item] = true);
  });
}


function getGerichtInfo(gesGericht, obj) {
  var notFound = {
    result: "Gericht nicht vorhanden"
  }
  var size = Object.size(jsonContent);

  // Schleife, welche alle Kalnderwochen durchgeht und schaut ob das gesuchte object vorkommt. Wenn ja wird es zurückgegeben.
  for (var i = 0; i < size; ++i) {
    for (var j = 0; j < 3; ++j) {
      if ((jsonContent.Kalenderwoche[i].Montag[0].gerichte[j].name) === (gesGericht)) {
        return jsonContent.Kalenderwoche[i].Montag[0].gerichte[j]
      }
      if ((jsonContent.Kalenderwoche[i].Dienstag[0].gerichte[j].name) === (gesGericht)) {
        return jsonContent.Kalenderwoche[i].Dienstag[0].gerichte[j]
      }
      if ((jsonContent.Kalenderwoche[i].Mittwoch[0].gerichte[j].name) === (gesGericht)) {
        return jsonContent.Kalenderwoche[i].Mittwoch[0].gerichte[j]
      }
      if ((jsonContent.Kalenderwoche[i].Donnerstag[0].gerichte[j].name) === (gesGericht)) {
        return jsonContent.Kalenderwoche[i].Donnerstag[0].gerichte[j]
      }
      if ((jsonContent.Kalenderwoche[i].Freitag[0].gerichte[j].name) === (gesGericht)) {
        return jsonContent.Kalenderwoche[i].Freitag[0].gerichte[j]
      }
    }
  }
  return notFound;
}

function getBeilagenInfo(gesBeilage, obj) {
  var notFound = {
    result: "Beilage nicht vorhanden"
  }
  var size = Object.size(jsonContent);

  // Schleife, welche alle Kalnderwochen durchgeht und schaut ob das gesuchte object vorkommt. Wenn ja wird es zurückgegeben.
  for (var i = 0; i < size; ++i) {
    for (var j = 0; j < 4; ++j) {
      if ((jsonContent.Kalenderwoche[i].Montag[1].beilagen[j].name) === (gesBeilage)) {
        return jsonContent.Kalenderwoche[i].Montag[1].beilagen[j]
      }
      if ((jsonContent.Kalenderwoche[i].Dienstag[1].beilagen[j].name) === (gesBeilage)) {
        return jsonContent.Kalenderwoche[i].Dienstag[1].beilagen[j]
      }
      if ((jsonContent.Kalenderwoche[i].Mittwoch[1].beilagen[j].name) === (gesBeilage)) {
        return jsonContent.Kalenderwoche[i].Mittwoch[1].beilagen[j]
      }
      if ((jsonContent.Kalenderwoche[i].Donnerstag[1].beilagen[j].name) === (gesBeilage)) {
        return jsonContent.Kalenderwoche[i].Donnerstag[1].beilagen[j]
      }
      if ((jsonContent.Kalenderwoche[i].Freitag[1].beilagen[j].name) === (gesBeilage)) {
        return jsonContent.Kalenderwoche[i].Freitag[1].beilagen[j]
      }
    }
  }
  return notFound;
}


// Funktion, welche das gesamte JSON Dokument durchläuft und alle vorhandenen Gerichte herausschreibt.
function getAlleGerichte(obj) {
  var alleGerichteListe = [];
  var size = Object.size(jsonContent);

  // Schleife, welche alle Kalnderwochen durchgeht und die Gerichte jedes Wochentages in ein Array schreibt.
  for (var i = 0; i < size; ++i) {
    for (var j = 0; j < 3; ++j) {
      alleGerichteListe.push((jsonContent.Kalenderwoche[i].Montag[0].gerichte[j].name));
      alleGerichteListe.push((jsonContent.Kalenderwoche[i].Dienstag[0].gerichte[j].name));
      alleGerichteListe.push((jsonContent.Kalenderwoche[i].Mittwoch[0].gerichte[j].name));
      alleGerichteListe.push((jsonContent.Kalenderwoche[i].Donnerstag[0].gerichte[j].name));
      alleGerichteListe.push((jsonContent.Kalenderwoche[i].Freitag[0].gerichte[j].name));
    }
  }
  // Doppelte Elemente werden rausgestrichen.
  alleGerichteListe = uniq(alleGerichteListe);

  var alleGerichteObject = {
    Gerichte: []
  };
  for (var i = 0; i < alleGerichteListe.length; ++i) {
    alleGerichteObject.Gerichte.push(alleGerichteListe[i]);
  }
  return alleGerichteObject;


}

// Funktion, welche das gesamte JSON Dokument durchläuft und alle vorhandenen B herausschreibt.
function getAlleBeilagen(obj) {
  var alleBeilagenListe = [];
  var size = Object.size(jsonContent);

  // Schleife, welche alle Kalnderwochen durchgeht und die Beilagen jedes Wochentages in ein Array schreibt.
  for (var i = 0; i < size; ++i) {
    for (var j = 0; j < 4; ++j) {
      alleBeilagenListe.push((jsonContent.Kalenderwoche[i].Montag[1].beilagen[j].name));
      alleBeilagenListe.push((jsonContent.Kalenderwoche[i].Dienstag[1].beilagen[j].name));
      alleBeilagenListe.push((jsonContent.Kalenderwoche[i].Mittwoch[1].beilagen[j].name));
      alleBeilagenListe.push((jsonContent.Kalenderwoche[i].Donnerstag[1].beilagen[j].name));
      alleBeilagenListe.push((jsonContent.Kalenderwoche[i].Freitag[1].beilagen[j].name));
    }
  }
  // Doppelte Elemente werden rausgestrichen.
  alleBeilagenListe = uniq(alleBeilagenListe);

  var alleBeilagenObject = {
    Beilagen: []
  };
  for (var i = 0; i < alleBeilagenListe.length; ++i) {
    alleBeilagenObject.Beilagen.push(alleBeilagenListe[i]);
  }
  return alleBeilagenObject;
}

// Alle Server Anfragen:

app.get(gerichte, (req, res) => {
  // Alle Gerichte zurückgeben.
  const alleGerichte = getAlleGerichte(jsonContent);
  res.send(JSON.stringify(alleGerichte, null, 4));
});

app.get(gerichte_id, (req, res) => {
  // Konkrete Gerichte ausgeben.
  const reqGericht = req.params.gericht;
  var gerichtInfo = getGerichtInfo(reqGericht, jsonContent);
  gerichtInfo = JSON.stringify(gerichtInfo, null, 4);
  res.send(gerichtInfo);
});

app.get(beilagen, (req, res) => {
  // Alle Beilagen zurückgeben.
  const alleBeilagen = getAlleBeilagen(jsonContent);
  res.send(JSON.stringify(alleBeilagen, null, 4));
});

app.get(beilagen_id, (req, res) => {
  // Konkrete Beilagen zurückgeben.
  const reqBeilage = req.params.beilage;
  var beilageInfo = getBeilagenInfo(reqBeilage, jsonContent);
  beilageInfo = JSON.stringify(beilageInfo, null, 4);
  res.send(beilageInfo);
});

app.get(kalnderwochen, (req, res) => {
  const kalenderwochen = getKalenderwochen(jsonContent);
  res.send(kalenderwochen);
});

app.get(kalenderwochen_id_wochentage_id_gerichte, (req, res) => {
  // Alle Gerichte einer konkreten Kalenderwoche und eines Wochentags zurückgeben.
  var reqKalenderwoche = req.params.kalenderwoche;
  var reqWochentag = req.params.wochentag;
  reqKalenderwoche = reqKalenderwoche-1;

  if (reqWochentag === "Montag") {
    var jsonObj = JSON.stringify((jsonContent.Kalenderwoche[reqKalenderwoche].Montag[0].gerichte), null, 4);
    res.send(jsonObj);
  } else if (reqWochentag === "Dienstag") {
    var jsonObj = JSON.stringify((jsonContent.Kalenderwoche[reqKalenderwoche].Dienstag[0].gerichte), null, 4);
    res.send(jsonObj);
  } else if (reqWochentag === "Mittwoch") {
    var jsonObj = JSON.stringify((jsonContent.Kalenderwoche[reqKalenderwoche].Mittwoch[0].gerichte), null, 4);
    res.send(jsonObj);
  } else if (reqWochentag === "Donnerstag") {
    var jsonObj = JSON.stringify((jsonContent.Kalenderwoche[reqKalenderwoche].Donnerstag[0].gerichte), null, 4);
    res.send(jsonObj);
  } else if (reqWochentag === "Freitag") {
    var jsonObj = JSON.stringify((jsonContent.Kalenderwoche[reqKalenderwoche].Freitag[0].gerichte), null, 4);
    res.send(jsonObj);
  }
});

app.get(kalenderwochen_id_wochentage_id_beilagen, (req, res) => {
  // Alle Beilagen einer konkreten Kalenderwoche und eines Wochentags zurückgeben.
  var reqKalenderwoche = req.params.kalenderwoche;
  const reqWochentag = req.params.wochentag;
  reqKalenderwoche = reqKalenderwoche-1;
  if (reqWochentag === "Montag") {
    var jsonObj = JSON.stringify((jsonContent.Kalenderwoche[reqKalenderwoch].Montag[1].beilagen), null, 4);
    res.send(jsonObj);
  } else if (reqWochentag === "Dienstag") {
    var jsonObj = JSON.stringify((jsonContent.Kalenderwoche[reqKalenderwoche].Dienstag[1].beilagen), null, 4);
    res.send(jsonObj);
  } else if (reqWochentag === "Mittwoch") {
    var jsonObj = JSON.stringify((jsonContent.Kalenderwoche[reqKalenderwoche].Mittwoch[1].beilagen), null, 4);
    res.send(jsonObj);
  } else if (reqWochentag === "Donnerstag") {
    var jsonObj = JSON.stringify((jsonContent.Kalenderwoche[reqKalenderwoche].Donnerstag[1].beilagen), null, 4);
    res.send(jsonObj);
  } else if (reqWochentag === "Freitag") {
    var jsonObj = JSON.stringify((jsonContent.Kalenderwoche[reqKalenderwoche].Freitag[1].beilagen), null, 4);
    res.send(jsonObj);
}
});



// Get the Port which is set by environment or 3000 by default
const port = process.env.PORT || 3000;
app.listen(port, () => console.log("Listening on port " + port + "..."));



// Funktion welche einem ein Object mit den Kalnderwochen zurückruft
function getKalenderwochen(obj) {
  var size = Object.size(obj);
  var kalenderwochenObj = {
    Kalenderwochen: []
  };

  for (var i = 1; i < size + 1; ++i) {
    kalenderwochenObj.Kalenderwochen.push(i);
  }
  kalenderwochenObj = JSON.stringify(kalenderwochenObj, null, 4);
  return kalenderwochenObj;
}
