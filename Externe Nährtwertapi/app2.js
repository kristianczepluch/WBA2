const https = require('https');
const fs = require('fs');

// Viel einfachere API die nur 1 Request erfodert
// Als Parameter einfach bei ingr= Nahrungsmittel einsetzen
// getKcal beispielhaft für chicken aufgerufen, statt console.log kann auch returned werden


getkcal("chicken");

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
      console.log(newData.hints[0].food.nutrients.ENERC_KCAL);
    });

  }).on("error", (err) => {
      console.log("Error: " + err.message);
  });
}
