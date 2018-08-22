const express = require("express");
const router = express.Router();
const bodyParser = require('body-parser');
const http = require('http');
const https = require('https');
const fs = require('fs');
const request = require('request');

const ressourceName = "users";


var listeUser = [];
var userAnzahl = 0;


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


//user ROUTEN


router.get('/', bodyParser.json(), function(req, res) {
  res.status(200).send(listeUser);
});


router.post('/', bodyParser.json(), function(req, res) {

  if (req.body.username == null || req.body.usergender == null || req.body.userage == null || req.body.userheight == null || req.body.userweight == null) {
    res.status(500).send("Fehlende Angaben, um User erstellen zu können");
    return;
  }

  var neueId = userAnzahl;
  var user = {
    id: neueId,
    username: req.body.username,
    usergender: req.body.usergender,
    userage: req.body.userage,
    userheight: req.body.userheight,
    userweight: req.body.userweight,
    userkcal: 0,
    eintraege: [],
    eintragId: 0
  };

  if (req.body.usergender == "Female") {
    user.userkcal = 655.1 + (9.6 * user.userweight) + (1.8 * user.userheight) - (4.7 * user.userage);
  } else {
    user.userkcal = 66.47 + (13.7 * user.userweight) + (5.0 * user.userheight) - (6.8 * user.userage);
  }

  listeUser[userAnzahl] = user;
  userAnzahl++;

  var ergebnis = JSON.stringify(user);
  res.status(201).send("User " + req.body.username + " hinzugefügt: " + ergebnis);
});

router.put('/:userId', bodyParser.json(), function(req, res) {

  if (req.body.username == null || req.body.usergender == null || req.body.userage == null || req.body.userheight == null || req.body.userweight == null) {
    res.status(500).send("Fehlende Angaben, um User ändern zu können");
    return;
  }

  for (let i = 0; i < listeUser.length; i++) {
    if (listeUser[i].id == req.params.userId) {
      listeUser[i].username = req.body.username;
      listeUser[i].usergender = req.body.usergender;
      listeUser[i].userage = req.body.userage;
      listeUser[i].userheight = req.body.userheight;
      listeUser[i].userweight = req.body.userweight;
      if (req.body.usergender == "Female") {
        listeUser[i].userkcal = 655.1 + (9.6 * listeUser[i].userweight) + (1.8 * listeUser[i].userheight) - (4.7 * listeUser[i].userage);
      } else {
        listeUser[i].userkcal = 66.47 + (13.7 * listeUser[i].userweight) + (5.0 * listeUser[i].userheight) - (6.8 * listeUser[i].userage);
      }
      res.status(200).type('text').send('Die Daten des Users wurden angepasst');
      return;
    }
  }
  res.status(404).type('text').send('Dieser User ist nicht vorhanden');


});

router.delete('/:userId', bodyParser.json(), function(req, res) {

  var löschNotiz = {
    id: "Dieser User wurde gelöscht"
  }

  for (let i = 0; i < listeUser.length; i++) {
    if (listeUser[i].id == req.params.userId) {
      listeUser[i] = löschNotiz;
      res.status(200).send("User wurde erfolgreich gelöscht!");
      return;
    }
  }
  res.status(404).type('text').send('Dieser User ist nicht vorhanden');

});

router.get('/:userId', bodyParser.json(), function(req, res) {

  for (let i = 0; i < listeUser.length; i++) {
    if (listeUser[i].id == req.params.userId) {
      res.status(200).send(listeUser[i]);
      return;
    }
  }
  res.status(404).type('text').send('Dieser User ist nicht vorhanden');
});



router.post('/:userId/Eintraege', bodyParser.json(), function(req, res) {

  if (req.body.name == null || req.body.menge == null || req.body.kcal == null) {
    res.status(500).send("Fehlende Angaben, um Eintrag erstellen zu können");
    return;
  }

  for (let i = 0; i < listeUser.length; i++) {
    if (listeUser[i].id == req.params.userId) {

      var eintrag = {
        id: listeUser[i].eintragId,
        name: req.body.name,
        menge: req.body.menge,
        kcal: req.body.kcal
      }

      listeUser[i].userkcal = listeUser[i].userkcal - eintrag.kcal;

      if (req.body.kcal == 0) {
        var mengeMultiplier = (req.body.menge / 100);
        var kcalGericht = getkcal(req.body.name);
        kcalGericht.then(function(result) {
          eintrag.kcal = result * mengeMultiplier;
          listeUser[i].userkcal = listeUser[i].userkcal - result;
        });
      }
      listeUser[i].eintraege[listeUser[i].eintragId] = eintrag;
      listeUser[i].eintragId++;

      var ergebnis = JSON.stringify(eintrag);
      res.status(201).send("Eintrag hinzugefügt: " + ergebnis);
      return;
    }
  }
  res.status(404).type('text').send('Dieser User ist nicht vorhanden')

});


router.get('/:userId/Eintraege', bodyParser.json(), function(req, res) {


  for (let i = 0; i < listeUser.length; i++) {
    if (listeUser[i].id == req.params.userId) {
      res.status(200).send(listeUser[i].eintraege);
      return;
    }
  }
  res.status(404).type('text').send('Dieser User ist nicht vorhanden');
});




router.get('/:userId/Eintraege/:eintragId', bodyParser.json(), function(req, res) {


  for (let i = 0; i < listeUser.length; i++) {
    if (listeUser[i].id == req.params.userId) {
      for (let j = 0; j < listeUser[i].eintraege.length; j++) {
        if (listeUser[i].eintraege[j].id == req.params.eintragId) {
          res.status(200).send(listeUser[i].eintraege[j])
          return;
        }
      }
      res.status(404).send("Eintrag nicht vorhanden");
      return;
    }
  }
  res.status(404).type('text').send('Dieser User ist nicht vorhanden');

});


router.delete('/:userId/Eintraege/:eintragId', bodyParser.json(), function(req, res) {

  var löschNotiz = {
    id: "Dieser Eintrag wurde gelöscht"
  }

  for (let i = 0; i < listeUser.length; i++) {
    if (listeUser[i].id == req.params.userId) {
      for (let j = 0; j < listeUser[i].eintraege.length; j++) {
        if (listeUser[i].eintraege[j].id == req.params.eintragId) {
          listeUser[i].userkcal = listeUser[i].userkcal + listeUser[i].eintraege[j].kcal;
          listeUser[i].eintraege[j] = löschNotiz;
          res.status(200).send("Eintrag wurde erfolgreich gelöscht!");
          return;
        }
      }
      res.status(404).send("Eintrag nicht vorhanden");
      return
    }
  }
  res.status(404).type('text').send('Dieser User ist nicht vorhanden');

});



router.get('/:userId/userkcal', bodyParser.json(), function(req, res) {

  for (let i = 0; i < listeUser.length; i++) {
    if (listeUser[i].id == req.params.userId) {
      if (listeUser[i].userkcal <= 0) {
        res.status(200).send("Tagesmaximum überschritten!");
        return;
      } else {
        res.status(200).send("Verfügbare Kcal für den Tag: " + listeUser[i].userkcal);
        return;
      }
    }
  }
  res.status(404).type('text').send('Dieser User ist nicht vorhanden');
});




// Anfragen an den Microservice
// Anfrage für Zusammenstellen der Infos für Gericht und Beilage + Erstellen neuen Eintrags auf Basis dieser


function getNahrungsmittelEintrag(url) {

  return new Promise(function(resolve, reject) {
    request.get(url, function(err, response, body) {
      body = JSON.parse(body);
      var eintrag = {
        name: body.name,
        menge: body.menge,
        kcal: body.kcal
      }
      if (eintrag) {
        resolve(eintrag);
      } else reject("Keine Angaben erhalten");
    });
  });
}


router.post('/MensaGm/Gerichte/:gericht/:userId', function(req, res) {
  var nahrungsmittel = req.params.gericht;
  var url = 'https://microserviceserver.herokuapp.com/MensaGm/Gerichte/' + nahrungsmittel;

  var eintragGericht = getNahrungsmittelEintrag(url);


  eintragGericht.then(function(result) {

    if (result.name == null || result.menge == null || result.kcal == null) {
      res.status(500).send("Fehlende Angaben, um Eintrag erstellen zu können");
      return;
    }

    for (let i = 0; i < listeUser.length; i++) {
      if (listeUser[i].id == req.params.userId) {

        var eintrag = {
          id: listeUser[i].eintragId,
          name: result.name,
          menge: result.menge,
          kcal: result.kcal
        }
        listeUser[i].userkcal = listeUser[i].userkcal - result.kcal;
        listeUser[i].eintraege[listeUser[i].eintragId] = eintrag;
        listeUser[i].eintragId++;

        var ergebnis = JSON.stringify(eintrag);
        res.status(201).send('Ausgewähltes Gericht eingetragen: ' + ergebnis);
        return;
      }
    }
    res.status(404).send('User nicht vorhanden');
  });


});



router.post('/MensaGm/Beilagen/:beilage/:userId', function(req, res) {
  var nahrungsmittel = req.params.beilage;
  var url = 'https://microserviceserver.herokuapp.com/MensaGm/Beilagen/' + nahrungsmittel;

  var eintragBeilage = getNahrungsmittelEintrag(url);


  eintragBeilage.then(function(result) {

    if (result.name == null || result.menge == null || result.kcal == null) {
      res.status(500).send("Fehlende Angaben, um Eintrag erstellen zu können");
      return;
    }

    for (let i = 0; i < listeUser.length; i++) {
      if (listeUser[i].id == req.params.userId) {

        var eintrag = {
          id: listeUser[i].eintragId,
          name: result.name,
          menge: result.menge,
          kcal: result.kcal
        }
        listeUser[i].userkcal = listeUser[i].userkcal - result.kcal;
        listeUser[i].eintraege[listeUser[i].eintragId] = eintrag;
        listeUser[i].eintragId++;

        var ergebnis = JSON.stringify(eintrag);
        res.status(201).send('Ausgewählte Beilage eingetragen: ' + ergebnis);
        return;
      }
    }
    res.status(404).send('User nicht vorhanden');
  });

});



module.exports = router;
