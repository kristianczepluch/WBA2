const express = require('express');
const http = require('http');
const app = express();


// Funktion, welche einem die Kcal über unserern externen Dienstgeber zurückliefert. Es wird ein Promise zurückgeliefert, da die Anfrage etwas länger dauern kann.
function getkcal(nahrungsmittel) {
  return new Promise(function(resolve, reject) {
    const URL = "http://api.edamam.com/api";
    const path = "/food-database/parser?ingr=" + nahrungsmittel + "&app_id=0931d8e1&app_key=d5bc406aaecb8b39cb511c6dd792bc39&";
    var ReqURL = URL + path;

    http.get(ReqURL, (resp) => {
      let data = '';

      // A chunk of data has been recieved.
      resp.on('data', (chunk) => {
        data += chunk;
      });

      // The whole response has been received. Print out the result.
      resp.on('end', () => {
        var newData = JSON.parse(data);
        var kcal = newData.hints[0].food.nutrients.ENERC_KCAL;
        if (kcal) {
          resolve(kcal);
        } else reject("kcal ist leer!");
      });
    });
  });
}
// Funktion, welche Anfragen an unseren Mensaserver schickt, welcher die Informationen über die Gericht besitzt.
function getInformationApi(URL) {
  // Neuen Promise erstellen da diese Anfrage dauert.
  return new Promise(function(resolve, reject) {
    // Asynchrone Aufgaben hier:
    http.get(URL, res => {
      res.setEncoding("utf8");
      let body = "";
      res.on("data", data => {
        body += data;
      });
      res.on("end", () => {
        // Wenn fertig ausgelesen und geparst dann wird body überprüft und entsprechend resolved oder reject.
        body = JSON.parse(body);
        console.log("Body wurde geparsed");
        if (body) {
          resolve(body);
        } else reject("body ist leer!");
      });
    });
  });
};



/*  Wie läuft das eintragen von Mensagerichen ab?
1.) Man kriegt einen Namen von einem Gericht und erstellt die URL,
    um das Gericht abzufragen.
2.) Man schickt an den Uniserver den Namen und wartet dann auf eine Antwort.
3.) Man kriegt eine Datei heraus und schickt dann eine Kcal abfrage für das Gericht.
4.) Man rechnet die Grammzahlen um und erstellt ein neues JS Object in dem man zusätzlich die Kcal speichert und Kcalgesamt.
5.) Man ruft POST bei dem Trackerserver auf mit den Informationen*/

// Funktion für das Gericht
app.get("/Mensaessen/Gerichte/:gericht", (req, res) => {

  //Parameter abfragen
  var gericht = req.params.gericht;
  console.log("Gericht nach dem gesucht wird: " + gericht);

  // URL für API Abfragen erzeugen
  const UniserverUrl = "http://localhost:3000";
  var pfadGerichte = "/api/gerichte/";
  var pfadBeilagen = "/api/beilagen/";
  var abfrage1 = UniserverUrl + pfadGerichte + gericht;
  console.log("Verwendete URL: " + abfrage1);

  // API Abfragen stellen, man erhält als Rückgabe einen Promise.
  const a = getInformationApi(abfrage1);
  a.then(function(result) {
    const abzufragendeZutaten = [];
    const mengen = [];
    (result.zutaten).forEach(function(item) {
      abzufragendeZutaten.push(item.name);
      mengen.push(item.menge);
    })
    console.log("Inhalte, welche abgefragt werden: " + abzufragendeZutaten);
    console.log("Mengen die abgefragt werden: " + mengen);

    var mengen_counter = 0;
    var success = true;

    // Nachdem die Zutaten und die Mengen vorliegen können diese durch unsere Externe API abgefragt werden.
    abzufragendeZutaten.forEach(function(item) {
      var a = getkcal(item);
      a.then(function(result) {
        var resultobject = {};
        resultobject.name = item;
        console.log("Result pro 100: " + result);

        // Das Ergebnis der Kcal bezieht sich pro 100 Gramm
        var result_per_1g = result/100;
        result = result_per_1g * mengen[mengen_counter];
        resultobject.kcal = result;
        mengen_counter++;

        var dataForTrackerPost = JSON.stringify(resultobject);
        // An dieser Stelle POST bei Tracker
        // ....

        console.log("JSON für Tracker: " + dataForTrackerPost);
      }).catch(function(reject) {
        console.log('Reject', reject);
      });
    });
  }).catch(function(reject){ console.log('Reject', reject);
          res.status(404).send("Gericht wurde nicht gefunden!")});
});

// Funktion f¸r eine Beilage
app.get("/Mensaessen/Beilagen/:beilage", (req, res) => {

  //Parameter abfragen
  var gericht = req.params.beilage;
  console.log("Gericht nach dem gesucht wird: " + gericht);

  // URL f¸r API Abfragen erzeugen
  const UniserverUrl = "http://localhost:3000";
  var pfadBeilagen = "/api/beilagen/";
  var abfrage1 = UniserverUrl + pfadBeilagen + gericht;
  console.log("Verwendete URL: " + abfrage1);

  // API Abfragen stellen a erh‰lt als R¸ckgabe einen Promise.
  const a = getInformationApi(abfrage1);
  a.then(function(result) {
    const abzufragendeZutaten = result.name;
    const menge = result.menge;

    console.log("Inhalte, welche abgefragt werden: " + abzufragendeZutaten);

    //console.log("Menge, welche abgefragt wird: " + menge);
    // Nachdem die Zutaten vorliegen kˆnnen diese durch unsere Externe API abgefragt werden.
    var a = getkcal(abzufragendeZutaten);
    a.then(function(result) {
      var resultobject = {};
      resultobject.name = abzufragendeZutaten;
      console.log("Result pro 100: " + result);
      var result_per_1g = result/100;
      result = result_per_1g * menge;
      resultobject.kcal = result;

      var dataForTrackerPost = JSON.stringify(resultobject);

      console.log("JSON f¸r Tracker: " + dataForTrackerPost);
    }).catch(function(reject) {
      console.log('Reject', reject);
    });
  }).catch(reject => console.log('Reject', reject));
});


// Get the Port which is set by environment or 3000 by default
const port = process.env.PORT || 3001;
app.listen(port, () => console.log("Listening on port " + port + "..."));
