const express = require("express");
const router = express.Router();
const bodyParser = require('body-parser');

const https = require('https');
const fs = require('fs');

const ressourceName = "users";


var listeUser = [];
var userAnzahl = 0;


function getkcal(nahrungsmittel){
  const URL = "https://api.edamam.com/api";
  const path = "/food-database/parser?ingr="+ nahrungsmittel + "&app_id=0931d8e1&app_key=d5bc406aaecb8b39cb511c6dd792bc39&";
  var ApiURL = URL + path;

  https.get(ApiURL, (resp) => {
    let data = '';
    // A chunk of data has been recieved.
    resp.on('data', (chunk) => {
      data += chunk;
    });
    // The whole response has been received. Print out the result.
    resp.on('end', () => {
      var newData = JSON.parse(data);
      //console.log(newData.hints[0].food.nutrients.ENERC_KCAL); // ANPASSEN! EInrag.kcal = newData.hints[0].food.nutrients.ENERC_KCAL;
      return newData.hints[0].food.nutrients.ENERC_KCAL;
    });

  }).on("error", (err) => {
      console.log("Error: " + err.message);
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
        userkcal: 2000,
        eintraege: [],
        eintragId: 0
  };

  listeUser[userAnzahl]=user;
  userAnzahl++;

  if (req.body.usergender == "Female") {
      userkcal = 655,1 + (9,6*req.body.userweight)+(1,8*req.body.userheight)-(4,7*req.body.userage);
    } else {
      userkcal = 66,47 + (13,7*req.body.userweight)+(5*req.body.userheight)-(6,8*req.body.userage);
    }

  res.status(200).send("User " +req.body.username+ " hinzugefügt.");
});

router.put('/:userId', bodyParser.json(), function (req, res){

if (listeUser[req.params.userId] == null){res.status(404).type('text').send('Dieser User ist nicht vorhanden');}
listeUser[req.params.userId].username= req.body.username;
listeUser[req.params.userId].userage= req.body.userage;
listeUser[req.params.userId].userheight= req.body.userheight;
listeUser[req.params.userId].userweight= req.body.userweight;
res.status(200).type('text').send('Die Daten des Useres wurden angepasst');


});


router.delete('/:userId', bodyParser.json(), function(req, res){
  listeUser = listeUser.filter(function(del) {
  return del.id != req.params.userId;
  });
res.status(204).send('Der User mit der ID wurde geloescht ' + req.params.userId );
userAnzahl--;
});




router.get('/:userId',bodyParser.json(), function(req,res){

if (listeUser[req.params.userId] == null){res.status(404).type('text').send('Dieser User ist nicht vorhanden');}
res.status(200).send(listeUser[req.params.userId]);


});



router.post('/:userId/eintraege/eintrag', bodyParser.json(), function (req, res) {

if (listeUser[req.params.userId] == null){res.status(404).type('text').send('Dieser User ist nicht vorhanden');}
listeUser[req.params.userId].eintraege[listeUser[req.params.userId].eintragId]=req.body;
listeUser[req.params.userId].eintragId++;
if (req.body.kcal == null) {
    var kcalGericht = getkcal(req.body.name);
    listeUser[req.params.userId].eintraege[listeUser[req.params.userId].eintragId].kcal = kcalGericht;
}
listeUser[req.params.userId].userkcal = listeUser[req.params.userId].userkcal - listeUser[req.params.userId].eintraege[listeUser[req.params.userId].eintragId].kcal;
res.status(200).send("Eintrag hinzugefügt. Restliche Kcal: "+ listeUser[req.params.userId].userkcal);

  });


  router.get('/:userId/eintraege', bodyParser.json(), function(req,res){

  if (listeUser[req.params.userId] == null){res.status(404).type('text').send('Dieser User ist nicht vorhanden');}
      res.status(200).send(listeUser[req.params.userId].eintraege);
  });




router.get('/:userId/eintraege/:eintragId', bodyParser.json(), function(req,res){

if (listeUser[req.params.userId] == null){res.status(404).type('text').send('Dieser User ist nicht vorhanden');}
  if (listeUser[req.params.userId].eintragId >= req.params.eintragId){
    res.status(200).send(listeUser[req.params.userId].eintraege[req.params.eintragId]);
  }
    res.status(404).send("Eintrag nicht vorhanden");

});

// EXTERNE API TEST

router.get('/testapi', bodyParser.json(), function (req, res){

var kcal = getkcal("apple");
consolge.log( "TEST: " +kcal);

})



// TODO:



        // Testen! (Debuggen) [ Zugriff auf Kcal und userkcal fragen!!!]

        // Callback bei Requests beachten!

        // Externe Api abfrage testen! 

        // (CHECK) -> Deploy




module.exports = router;
