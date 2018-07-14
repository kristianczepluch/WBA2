const express = require('express');
const http = require('http');
const app = express();

// Funktion, welche einem die Kcal über unserern externen Dienstgeber zurückliefert. Es wird ein Promise zurückgeliefert, da die Anfrage etwas länger dauern kann.
function getkcal(nahrungsmittel, menge) {
  return new Promise(function(resolve, reject) {
    const URL = "http://api.edamam.com/api";
    const path = "/food-database/parser?ingr=" + nahrungsmittel + "&app_id=0931d8e1&app_key=d5bc406aaecb8b39cb511c6dd792bc39&";
    var ReqURL = URL + path;

    http.get(ReqURL, (resp) => {
      let data = '';

      // Die erhaltete Datei wird ausgelesen.
      resp.on('data', (chunk) => {
        data += chunk;
      });
      // Sobald die gesamte Antwort ausgelesen wurde...
      resp.on('end', () => {
        var newData = JSON.parse(data);
        var kcal = newData.hints[0].food.nutrients.ENERC_KCAL;
        kcal = (kcal / 100) * menge;
        if (kcal) {
          resolve(kcal);
        } else reject("kcal ist leer!");
      });
    });
  });
}

// Funktion, welche Anfragen an unseren Mensaserver schickt, welcher die Informationen über die Gericht besitzt.
function getInformationApi(URL) {
  return new Promise(function(resolve, reject) {
    http.get(URL, res => {
      if (res.statusCode == 200) {
        res.setEncoding("utf8");
        let body = "";
        res.on("data", data => {
          body += data;
        });
        res.on("end", () => {
          body = JSON.parse(body);
          if (body) {
            resolve(body);
          } else reject("Debug: body ist leer!");
        });
      } else reject("Gericht nicht vorhanden");
    });
  });
};

// Funktion, welcher eine Anfrage für den Speiseplan, für eine konkrete Kalenderwoche und einen Wochentag sendet.
function getSpeiseplan(URL) {
  return new Promise(function(resolve, reject) {
    http.get(URL, res => {
      if (res.statusCode == 200) {
        res.setEncoding("utf8");
        let body = "";
        res.on("data", data => {
          body += data;
        });
        res.on("end", () => {
          body = JSON.parse(body);
          if (body) {
            resolve(body);
          } else reject("Debug: body ist leer!");
        });
      } else reject("Speiseplan nicht vorhanden");
    });
  });
};



// Funktion für das Gericht
app.get("/MensaGm/Gerichte/:gericht", (req, res) => {

  // URL wird generiert:
   let gericht = req.params.gericht;
   console.log("Debug: Gericht nach dem gesucht wird: " + gericht);
   const UniserverUrl = "http://mensauniserver.herokuapp.com";
   const pfadGerichte = "/api/gerichte/";
   let abfrage = UniserverUrl + pfadGerichte + gericht;
   console.log("Debug: Verwendete URL: " + abfrage);

   // API Abfragen stellen, man erhält als Rückgabe einen Promise.
    const a = getInformationApi(abfrage);
    a.then(function(result) {
      const abzufragendeZutaten = [];
      const mengen = [];
      let mengenSum=0;
      (result.zutaten).forEach(function(item) {
        abzufragendeZutaten.push(item.name);
        mengen.push(item.menge);
        mengenSum = mengenSum+item.menge;
      })

      console.log("Debug: Inhalte, welche abgefragt werden: " + abzufragendeZutaten);
      console.log("Debug: Mengen die abgefragt werden: " + mengen);
      console.log("Debug: Komplette Menge: " + mengenSum);

      // Schleife welche alle Promises erstellt und diese in einem Array speichert
      let mengen_counter = 0;
      let resultobject = {
        results: []
      };
      let allPromises = [];

      abzufragendeZutaten.forEach(function(item) {
       let a = getkcal(item, mengen[0]);
       allPromises.push(a);
       mengen_counter++;
     });


     Promise.all(allPromises).then(function(result) {
       // Alle benötigten Informationen für den Respone liegen vor, jetzt kann das Dokument erstellt werden.
       let finalKcal = 0;
       result.forEach(function(item) {
         finalKcal += item;
       });
       let resultObject = {};
       resultObject.name = gericht;
       resultObject.kcal = finalKcal;
       resultObject.menge = mengenSum;
       res.status(200).json(resultObject);
       console.log("Debug: Alle Promises sind da: Name: " + resultObject.name + " Kcal: " + resultObject.kcal);
     }).catch(console.log("Debug: Hat leider nicht geklappt."));

   }).catch(function(reject) {
     console.log('Reject', reject);
     res.status(404).send("Leider wurde das Gericht nicht gefunden!")
   });
 });

// Funktion für die Beilagen
app.get("/MensaGm/Beilagen/:beilage", (req, res) => {
  console.log("Debug: Mensaessen/Beilagen/:beilage aufgerufen.");
  // Werte aus den Parametern werden ausgelesen.
  let beilage = req.params.beilage;
  console.log("Debug: Beilage nach der gesucht wird: " + beilage);
  // URL für API Abfragen wird erzeugt.
  const UniserverUrl = "http://mensauniserver.herokuapp.com";
  const pfadBeilagen = "/api/beilagen/";
  const abfrage = UniserverUrl + pfadBeilagen + beilage;
  console.log("Debug: Verwendete URL: " + abfrage);

  // API Abfragen stellen a erhält als Rückgabe einen Promise.
  let p = getInformationApi(abfrage);
  p.then(function(result) {
    const abzufragendeZutat = result.name;
    const menge = result.menge;

    console.log("Debug: Inhalte, welche abgefragt werden: " + abzufragendeZutat);

    // Nachdem die Zutaten vorliegen können diese durch unsere Externe API abgefragt werden.
    var a = getkcal(abzufragendeZutat, menge);
    a.then(function(result) {
      var resultobject = {};
      resultobject.name = abzufragendeZutat;
      resultobject.kcal = result;
      resultobject.menge = menge;

      res.status(200).json(resultobject);
    }).catch(function(reject) {
      console.log('Reject', reject);
    });
  }).catch(function(reject) {
    console.log("Debug: Beilage nicht gefunden");
    res.status(404).send("Leider wurde die Beilage nicht gefunden!");
  });
});

// Funktion für den Speiseplan
app.get("/MensaGm/Speiseplan/:kalenderwoche/:wochentag", (req, res) => {

  // Werte aus den Parametern werden ausgelesen.
  const UniserverUrl = "http://mensauniserver.herokuapp.com";
  let kalenderwoche = req.params.kalenderwoche;
  let wochentag = req.params.wochentag;
  // URL für API Abfragen wird erzeugt.
  const path = '/api/kalenderwochen/' + kalenderwoche + '/wochentage/' + wochentag;
  let URL = UniserverUrl + path;

  // Speiseplan wird angefragt und bei einem resolve erfolgreich versendet. Ansonsten gibt es die Kalenderwoche oder den Wochentag nicht.
  let p = getSpeiseplan(URL);
  p.then(function(result){
    res.status(200).json(result);
  }).catch(function(reject){
    res.status(404).send("Kalenderwoche oder Wochentag nicht vorhanden!");
    console.log("Kalenderwoche oder Wochentag nicht vorhanden!");
  });
 });




// Port wird auf Umgebungsvariable gesetzt oder alternativ wenn nicht vorhanden auf 3001
const port = process.env.PORT || 3001;
app.listen(port, () => console.log("Listening on port " + port + "..."));
