const express = require("express");
const router = express.Router();
const bodyParser = require('body-parser');

const ressourceName = "eintrag";

//Eintrag ROUTEN

var speicherEinträge = new Array();
var counter=0;
var kcal=2000;

/*const eintraege = [{
gerichtId: 0
gerichtName: 'test'
gerichtKcal: 'test'
}];*/

router.get('/', function(req,res){
res.send(speicherEinträge);
});

router.get('/:eintragId', function(req,res){
  res.send(speicherEinträge(req.params.eintraId));
});

router.post('/', bodyParser.json(), function (req, res) {
    speicherEinträge[counter]=req.body;
    counter++;
    res.write("Eintrag wurde Hinzugefügt. Restliche Kcal für den Tag: " +kcal-req.body.kcal);
  });

  /*router.post('/', bodyParser.json(), function(req,res){
    const eintrag = {
      gerichtId: eintrag.length + 1,
      gerichtName: req.body.name;
      gerichtKcal: req.body.kcal;
    }; */


module.exports = router;
