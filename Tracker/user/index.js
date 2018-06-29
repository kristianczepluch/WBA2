const express = require("express");
const router = express.Router();
const bodyParser = require('body-parser');

const ressourceName = "users";

//user ROUTEN

/*const eintrag = {
eintragId;
gerichtName;
gerichtKcal;
counter;
}

const user = {
  userId;
  userName;
  userAge;
  userHeight;
  userWeight;
  userKcal: 2000;
  var einträge = new Array();
}
*/

router.get('/', function(req,res){
res.send("Repräsentation aller User")
});

router.get("/:userId", function(req,res){
  res.send("Rreprä. user mit id: " + req.params.userId)
});

router.get("/:userId/:eintragId",function(req,res){
  res.send("Rreprä. eintrag mit id: " + req.params.eintragId)
});

router.post('/:userId/:eintragId', bodyParser.json(), function (req, res) {
    einträge[counter]=req.body;
    counter++;
});








module.exports = router;
