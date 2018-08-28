
/*
Server Info:
Dieser Server soll die API der Mensa simulieren, da wir auf diese keinen Zugriff bekommen.
Da dies nicht der Hauptteil unseres Projektes sein soll haben wir uns dazu entschlossen nur die für uns relevanten
GET Abfragen zu implementieren. Der Hauptfokus unseres Projektes soll auf dem Kalorien-Tracker-Server liegen und
auf dem Microservice, welcher die Kilokalorien der Unigerichte berechnet! Dieser Server dient als Informationslieferant!
*/

// Unsere Module:
const express = require('express');
var fs = require("fs");
const app = express();
app.use(express.json());

// Das Jason-File mit unseren Informationen zu den Gerichten wird ausgelesen und vorgespeichert.
var x = fs.readFileSync('Gerichte.json', 'utf8');
var jsonContent = JSON.parse(x);


// Unsere Routen:
const gerichte = '/api/gerichte';
const beilagen = '/api/beilagen';
const kalnderwochen = '/api/kalenderwochen';
const beilagen_id = '/api/beilagen/:beilage';
const gerichte_id = '/api/gerichte/:gericht';
const kalenderwochen_id_wochentage = '/api/kalenderwochen/:kalenderwoche/wochentage';
const kalenderwochen_id_wochentage_id_gerichte = '/api/kalenderwochen/:kalenderwoche/wochentage/:wochentag/gerichte';
const kalenderwochen_id_wochentage_id_beilagen = '/api/kalenderwochen/:kalenderwoche/wochentage/:wochentag/beilagen';
const kalenderwochen_id_wochentage_id = '/api/kalenderwochen/:kalenderwoche/wochentage/:wochentag';

// Funktion welche einem ein Object mit den Kalnderwochen zurückruft
function getKalenderwochen(obj) {
  let size = obj.Kalenderwoche.length;
  let kalenderwochenObj = {
    Kalenderwochen: []
  };

  for (let i = 1; i < size + 1; ++i) {
    kalenderwochenObj.Kalenderwochen.push(i);
  }
  kalenderwochenObj = JSON.stringify(kalenderwochenObj, null, 4);
  return kalenderwochenObj;
}

// Funktion, welche die "Länge" des Objects zurückliefert.
Object.size = function(obj) {
  let size = 0,
    key;
  for (key in obj) {
    if (obj.hasOwnProperty(key)) size++;
  }
  return size;
};

// Funktion, welche doppelte Elemente aus einem Array entfernt.
function uniq(a) {
  let seen = {};
  return a.filter(function(item) {
    return seen.hasOwnProperty(item) ? false : (seen[item] = true);
  });
}

// Funktion,welche alle Kalenderwochen durchgeht und schaut ob das gesuchte Objekt vorkommt. Wenn eins gefunden wird, wird es zurückgegeben ansonsten der Wert 0.
function getGerichtInfo(gesGericht, obj) {
  let notFound = 0;
  let size = jsonContent.Kalenderwoche.length;

  // Schleife, welche alle Kalenderwochen durchgeht und schaut ob das gesuchte object vorkommt. Wenn ja wird es zurückgegeben.
  for (let i = 0; i < size; ++i) {
    for (let j = 0; j < 3; ++j) {
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

// Funktion,welche alle Kalenderwochen durchgeht und schaut ob das gesuchte Objekt vorkommt. Wenn eins gefunden wird, wird es zurückgegeben ansonsten der Wert 0.
function getBeilagenInfo(gesBeilage, obj) {
  let notFound = 0;
  let size = obj.Kalenderwoche.length;

  // Schleife, welche alle Kalnderwochen durchgeht und schaut ob das gesuchte object vorkommt. Wenn ja wird es zurückgegeben.
  for (let i = 0; i < size; ++i) {
    for (let j = 0; j < 4; ++j) {
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

// Funktion, welche einem einen Speiseplan für eine konkorete Kalenderwoche und einen Wochentag zurückliefert.
function getSpeiseplan(reqKalenderwoche, reqWochentag) {
  let notFound = 0;
  if (reqWochentag == "Montag") {
    let resultObject = {}
    resultObject.Gerichte = (jsonContent.Kalenderwoche[reqKalenderwoche].Montag[0].gerichte);
    resultObject.Beilagen = (jsonContent.Kalenderwoche[reqKalenderwoche].Montag[1].beilagen);
    return resultObject;

  } else if (reqWochentag == "Dienstag") {
    let resultObject = {}
    resultObject.Gerichte = (jsonContent.Kalenderwoche[reqKalenderwoche].Dienstag[0].gerichte);
    resultObject.Beilagen = (jsonContent.Kalenderwoche[reqKalenderwoche].Dienstag[1].beilagen);
    return resultObject;

  } else if (reqWochentag == "Mittwoch") {
    let resultObject = {}
    resultObject.Gerichte = (jsonContent.Kalenderwoche[reqKalenderwoche].Mittwoch[0].gerichte);
    resultObject.Beilagen = (jsonContent.Kalenderwoche[reqKalenderwoche].Mittwoch[1].beilagen);
    return resultObject;

  } else if (reqWochentag == "Donnerstag") {
    let resultObject = {}
    resultObject.Gerichte = (jsonContent.Kalenderwoche[reqKalenderwoche].Donnerstag[0].gerichte);
    resultObject.Beilagen = (jsonContent.Kalenderwoche[reqKalenderwoche].Donnerstag[1].beilagen);
    return resultObject;

  } else if (reqWochentag == "Freitag") {
    let resultObject = {}
    resultObject.Gerichte = (jsonContent.Kalenderwoche[reqKalenderwoche].Freitag[0].gerichte);
    resultObject.Beilagen = (jsonContent.Kalenderwoche[reqKalenderwoche].Freitag[1].beilagen);
    return resultObject;
  } else return notFound;
}

// Funktion, welche einem die Gerichte für eine konkorete Kalenderwoche und einen Wochentag zurückliefert.
function getSpeiseplanGerichte(reqKalenderwoche, reqWochentag) {
  let notFound = 0;
  if (reqWochentag == "Montag") {
    return (jsonContent.Kalenderwoche[reqKalenderwoche].Montag[0].gerichte);

  } else if (reqWochentag == "Dienstag") {
    return (jsonContent.Kalenderwoche[reqKalenderwoche].Dienstag[0].gerichte);

  } else if (reqWochentag == "Mittwoch") {
    return (jsonContent.Kalenderwoche[reqKalenderwoche].Mittwoch[0].gerichte);

  } else if (reqWochentag == "Donnerstag") {
    return (jsonContent.Kalenderwoche[reqKalenderwoche].Donnerstag[0].gerichte);

  } else if (reqWochentag == "Freitag") {
    return (jsonContent.Kalenderwoche[reqKalenderwoche].Freitag[0].gerichte);

  } else return notFound;
}

// Funktion, welche einem die Beilagen für eine konkorete Kalenderwoche und einen Wochentag zurückliefert.
function getSpeiseplanBeilagen(reqKalenderwoche, reqWochentag) {
  let notFound = 0;
  if (reqWochentag == "Montag") {
    return (jsonContent.Kalenderwoche[reqKalenderwoche].Montag[1].beilagen);

  } else if (reqWochentag == "Dienstag") {
    return (jsonContent.Kalenderwoche[reqKalenderwoche].Dienstag[1].beilagen);

  } else if (reqWochentag == "Mittwoch") {
    return (jsonContent.Kalenderwoche[reqKalenderwoche].Mittwoch[1].beilagen);

  } else if (reqWochentag == "Donnerstag") {
    return (jsonContent.Kalenderwoche[reqKalenderwoche].Donnerstag[1].beilagen);

  } else if (reqWochentag == "Freitag") {
    return (jsonContent.Kalenderwoche[reqKalenderwoche].Freitag[1].beilagen);

  } else return notFound;
}


// Funktion, welche das gesamte JSON Dokument durchläuft und alle vorhandenen Gerichte herausschreibt.
function getAlleGerichte(obj) {
  let alleGerichteListe = [];
  let size = Object.size(jsonContent);

  // Schleife, welche alle Kalnderwochen durchgeht und die Gerichte jedes Wochentages in ein Array schreibt.
  for (let i = 0; i < size; ++i) {
    for (let j = 0; j < 3; ++j) {
      alleGerichteListe.push((jsonContent.Kalenderwoche[i].Montag[0].gerichte[j].name));
      alleGerichteListe.push((jsonContent.Kalenderwoche[i].Dienstag[0].gerichte[j].name));
      alleGerichteListe.push((jsonContent.Kalenderwoche[i].Mittwoch[0].gerichte[j].name));
      alleGerichteListe.push((jsonContent.Kalenderwoche[i].Donnerstag[0].gerichte[j].name));
      alleGerichteListe.push((jsonContent.Kalenderwoche[i].Freitag[0].gerichte[j].name));
    }
  }
  // Doppelte Elemente werden rausgestrichen.
  alleGerichteListe = uniq(alleGerichteListe);

  let alleGerichteObject = {
    Gerichte: []
  };
  for (let i = 0; i < alleGerichteListe.length; ++i) {
    alleGerichteObject.Gerichte.push(alleGerichteListe[i]);
  }

  let basicURL = "http://localhost:3000/api/Gerichte/";
  let finalObj = { AlleGerichte: [] };

  for(let i=0; i<alleGerichteObject.Gerichte.length; i++){
  let newObj = {
    name: alleGerichteObject.Gerichte[i],
    Informations: basicURL + (alleGerichteObject.Gerichte[i].replace(/ /g, "%20"))
  }
  finalObj.AlleGerichte.push(newObj);
  }

  return finalObj;

}

// Funktion, welche das gesamte JSON Dokument durchläuft und alle vorhandenen Beilagen herausschreibt.
function getAlleBeilagen(obj) {
  let alleBeilagenListe = [];
  let size = Object.size(jsonContent);

  // Schleife, welche alle Kalnderwochen durchgeht und die Beilagen jedes Wochentages in ein Array schreibt.
  for (let i = 0; i < size; ++i) {
    for (let j = 0; j < 4; ++j) {
      alleBeilagenListe.push((jsonContent.Kalenderwoche[i].Montag[1].beilagen[j].name));
      alleBeilagenListe.push((jsonContent.Kalenderwoche[i].Dienstag[1].beilagen[j].name));
      alleBeilagenListe.push((jsonContent.Kalenderwoche[i].Mittwoch[1].beilagen[j].name));
      alleBeilagenListe.push((jsonContent.Kalenderwoche[i].Donnerstag[1].beilagen[j].name));
      alleBeilagenListe.push((jsonContent.Kalenderwoche[i].Freitag[1].beilagen[j].name));
    }
  }
  // Doppelte Elemente werden rausgestrichen.
  alleBeilagenListe = uniq(alleBeilagenListe);

  let alleBeilagenObject = {
    Beilagen: []
  };
  for (let i = 0; i < alleBeilagenListe.length; ++i) {
    alleBeilagenObject.Beilagen.push(alleBeilagenListe[i]);
  }

  let basicURL = "http://localhost:3000/api/Beilagen/";
  let finalObj = { AlleBeilagen: [] };

  for(let i=0; i<alleBeilagenObject.Beilagen.length; i++){
  let newObj = {
    name: alleBeilagenObject.Beilagen[i],
    Informations: basicURL + (alleBeilagenObject.Beilagen[i].replace(/ /g, "%20"))
  }
  finalObj.AlleBeilagen.push(newObj);
  }


  return finalObj;
}

/* ---------------------------------------------------------------------------------------------------------------------------------------------------------------*/


// Alle Server Anfragen:

app.get(gerichte, (req, res) => {
  // Alle Gerichte zurückgeben.
  let alleGerichte = getAlleGerichte(jsonContent);
  res.status(200).send(JSON.stringify(alleGerichte, null, 4));
});

app.get(gerichte_id, (req, res) => {
  // Konkrete Gerichte ausgeben.
  let reqGericht = req.params.gericht;
  let gerichtInfo = getGerichtInfo(reqGericht, jsonContent);
  if (gerichtInfo != 0) {
    console.log("Gesendet: " + gerichtInfo);
    gerichtInfo.alleGerichte = "http://localhost:3000/api/Gerichte"
    res.status(200).json(gerichtInfo);
  } else res.status(404).send("Gericht nicht gefunden!");
});

app.get(beilagen, (req, res) => {
  // Alle Beilagen zurückgeben.
  let alleBeilagen = getAlleBeilagen(jsonContent);
  res.status(200).send(JSON.stringify(alleBeilagen, null, 4));
});

app.get(beilagen_id, (req, res) => {
  // Konkrete Beilagen zurückgeben.
  let reqBeilage = req.params.beilage;
  let beilageInfo = getBeilagenInfo(reqBeilage, jsonContent);
  if (beilageInfo != 0) {
    beilageInfo.alleBeilagen = "http://localhost:3000/api/Beilagen";
    beilageInfo = JSON.stringify(beilageInfo, null, 4);
    res.status(200).send(beilageInfo);
  } else res.status(404).send("Beilage nicht gefunden!");
});

app.get(kalnderwochen, (req, res) => {
  let kalenderwochen = getKalenderwochen(jsonContent);
  res.status(200).send(kalenderwochen);
});

app.get(kalenderwochen_id_wochentage_id_gerichte, (req, res) => {
  // Alle Gerichte einer konkreten Kalenderwoche und eines Wochentags zurückgeben.
  let reqKalenderwoche = req.params.kalenderwoche;
  let reqWochentag = req.params.wochentag;
  reqKalenderwoche = reqKalenderwoche - 1;
  let KalSize = jsonContent.Kalenderwoche.length;

  if (KalSize >= reqKalenderwoche + 1) {
    let result = getSpeiseplanGerichte(reqKalenderwoche, reqWochentag);
    if (result != 0) {
      res.status(200).json(result);
    } else res.status(404).send("Wochentag ist nicht verfügbar!");
  } else res.status(404).send("Kalenderwoche nicht verfügbar!")
});

app.get(kalenderwochen_id_wochentage_id_beilagen, (req, res) => {
  // Alle Beilagen einer konkreten Kalenderwoche und eines Wochentags zurückgeben.
  let reqKalenderwoche = req.params.kalenderwoche;
  let reqWochentag = req.params.wochentag;
  reqKalenderwoche = reqKalenderwoche - 1;

  let KalSize = jsonContent.Kalenderwoche.length;

  if (KalSize >= reqKalenderwoche + 1) {
    let result = getSpeiseplanBeilagen(reqKalenderwoche, reqWochentag);
    if (result != 0) {
      res.status(200).json(result);
    } else res.status(404).send("Wochentag ist nicht verfügbar!");
  } else res.status(404).send("Kalenderwoche nicht verfügbar!")

});

app.get(kalenderwochen_id_wochentage_id, (req, res) => {
  let reqKalenderwoche = req.params.kalenderwoche;
  let reqWochentag = req.params.wochentag;
  reqKalenderwoche = reqKalenderwoche - 1;
  let KalSize = jsonContent.Kalenderwoche.length;

  if (KalSize >= reqKalenderwoche + 1) {
    let result = getSpeiseplan(reqKalenderwoche, reqWochentag);
    if (result != 0) {
      res.status(200).json(result);
    } else res.status(404).send("Wochentag ist nicht verfügbar!");
  } else {
    res.status(404).send("Kalenderwoche nicht verfügbar!")
  }

});


// Get the Port which is set by environment or 3000 by default
const port = process.env.PORT || 3000;
app.listen(port, () => console.log("Listening on port " + port + "..."));
