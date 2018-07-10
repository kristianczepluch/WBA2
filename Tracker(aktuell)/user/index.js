const express = require("express");
const router = express.Router();
const bodyParser = require('body-parser');
const http=require('http');
const https = require('https');
const fs = require('fs');

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


router.get('/', bodyParser.json(), function(req,res){
res.send(listeUser);
});


router.post('/', bodyParser.json(), function (req, res){

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
      user.userkcal = 655.1 + (9.6*user.userweight)+(1.8*user.userheight)-(4.7*user.userage);
    } else {
      user.userkcal = 66.47 + (13.7*user.userweight)+(5.0*user.userheight)-(6.8*user.userage);
    }

  listeUser[userAnzahl]=user;
  userAnzahl++;

  res.status(200).send("User " +req.body.username+ " hinzugefügt.");
});

router.put('/:userId', bodyParser.json(), function (req, res){


for (let i = 0; i<listeUser.length; i++){
  if (listeUser[i].id == req.params.userId) {
    listeUser[i].username= req.body.username;
    listeUser[i].usergender=req.body.usergender;
    listeUser[i].userage= req.body.userage;
    listeUser[i].userheight= req.body.userheight;
    listeUser[i].userweight= req.body.userweight;
        if (req.body.usergender == "Female") {
            listeUser[i].userkcal = 655.1 + (9.6*listeUser[i].userweight)+(1.8*listeUser[i].userheight)-(4.7*listeUser[i].userage);
            } else {
                listeUser[i].userkcal = 66.47 + (13.7*listeUser[i].userweight)+(5.0*listeUser[i].userheight)-(6.8*listeUser[i].userage);
          }
    res.status(200).type('text').send('Die Daten des Users wurden angepasst');
    return;
  }
}
res.status(404).type('text').send('Dieser User ist nicht vorhanden');


});

router.delete('/:userId', bodyParser.json(), function(req, res){

  for (let i = 0; i<listeUser.length; i++){
    if (listeUser[i].id == req.params.userId) {
      listeUser = listeUser.filter(function(del) {
        return del.id != req.params.userId;
      });
      res.status(200).send("User wurde erfolgreich gelöscht!");
      return;
    }
  }
res.status(404).type('text').send('Dieser User ist nicht vorhanden');

});

router.get('/:userId',bodyParser.json(), function(req,res){

for (let i = 0; i<listeUser.length; i++){
  if (listeUser[i].id == req.params.userId) {
    res.status(200).send(listeUser[i]);
    return;
  }
}   // warum nicht möglich, nach LÖSCHEN!??
  res.status(404).type('text').send('Dieser User ist nicht vorhanden');
});



router.post('/:userId/eintraege', bodyParser.json(), function (req, res) {


for (let i = 0; i<listeUser.length; i++){
  if (listeUser[i].id == req.params.userId) {

    var eintrag = {
      id: listeUser[i].eintragId,
      name: req.body.name,
      menge: req.body.menge,
      kcal: req.body.kcal
    }

    listeUser[i].userkcal = listeUser[i].userkcal - eintrag.kcal;

   if (req.body.kcal == 0) {
       var mengeMultiplier = (req.body.menge/100);
       var kcalGericht = getkcal(req.body.name)
            kcalGericht.then(function(result){
              var resultobject = {};
              resultobject.name = req.body.name;
              eintrag.kcal = result*mengeMultiplier;
              listeUser[i].userkcal = listeUser[i].userkcal - result;
            });
     }
listeUser[i].eintraege[listeUser[i].eintragId]= eintrag ;
listeUser[i].eintragId++;


res.status(200).send("Eintrag hinzugefügt.");
return;
}
}
res.status(404).type('text').send('Dieser User ist nicht vorhanden')

  });


  router.get('/:userId/eintraege', bodyParser.json(), function(req,res){


  for (let i = 0; i<listeUser.length; i++){
    if (listeUser[i].id == req.params.userId) {
      res.status(200).send(listeUser[i].eintraege);
      return;
    }
  }
    res.status(404).type('text').send('Dieser User ist nicht vorhanden');
  });




router.get('/:userId/eintraege/:eintragId', bodyParser.json(), function(req,res){


for (let i = 0; i<listeUser.length; i++){
  if (listeUser[i].id == req.params.userId) {
      for (let j = 0; j<listeUser[i].eintraege.length;j++){
          if (listeUser[i].eintraege[j].id == req.params.eintragId){
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


router.delete('/:userId/eintraege/:eintragId', bodyParser.json(), function(req, res){


  for (let i = 0; i<listeUser.length; i++){
    if (listeUser[i].id == req.params.userId) {
        for (let j = 0; j<listeUser[i].eintraege.length;j++){
            if (listeUser[i].eintraege[j].id == req.params.eintragId){
              listeUser[i].userkcal=listeUser[i].userkcal+listeUser[i].eintraege[j].kcal;
                  listeUser[i].eintraege = listeUser[i].eintraege.filter(function(del) {
                    return del.id != listeUser[i].eintraege[j].id;
                  });
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



router.get('/:userId/userkcal',bodyParser.json(), function(req,res){

  for (let i = 0; i<listeUser.length; i++){
    if (listeUser[i].id == req.params.userId) {
      if (listeUser[i].userkcal <= 0){
        res.status(200).send("Tagesmaximum überschritten!");
        return;
      } else {
      res.status(200).send("Verfügbare Kcal für den Tag: "+listeUser[i].userkcal);
      return;
    }
  }
}
    res.status(404).type('text').send('Dieser User ist nicht vorhanden');
  });




// TODO:



                          //   - POST MensaEintarg - erstellen mit Promises! // Wenn Promise resolvet -> POST EINTRAG 

                          //   - Notizen / Doku [CHECK/ NOCH ERGÄNZEN BEI ÄNDERUNGEN!]

                          //   - Beautyfier

                          //   - FOR Schleifen Fehlerhaft, nach Löschen von Objekten!






        // (CHECK) -> Deploy




module.exports = router;
