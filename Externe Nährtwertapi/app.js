const https = require('https');
const fs = require('fs');

// Wie man die Kcal von der Api bekommt:
// 1. Man braucht die ndbno nummer von den Artikel
// Dazu anfrage an api.nal.usda schicken mid dem Paramter q = Name von dem Nahrungsmittel
// Unter den Daten ist unter .list.item[0].nbdno die nummer hinterlegt

// Mit der Nummer kann man nun die Nährwerte abfragen.
// Dazu muss eine Anfrage an: https://api.nal.usda.gov/ndb/V2/reports?ndbno=01323&type=b&format=json&api_key=fK5sqSNg2AUL1LYq39muCgA4FkacqSsj2yZegp0n
// Geschickt werden wobei als Parameter die Nummer übergeben werden muss

//https.get('https://api.nal.usda.gov/ndb/search/?format=json&q=butter&ds=Standard%20Reference&sort=r&max=25&offset=0&api_key=fK5sqSNg2AUL1LYq39muCgA4FkacqSsj2yZegp0n', (resp) => {
//  let data = '';
  // A chunk of data has been recieved.
//  resp.on('data', (chunk) => {
//    data += chunk;
//  });
  // The whole response has been received. Print out the result.
//  resp.on('end', () => {
  //  var newData = JSON.parse(data);
  //  console.log(newData.list.item[0].ndbno);
//  });

//}).on("error", (err) => {
//  console.log("Error: " + err.message);
//});


https.get('https://api.nal.usda.gov/ndb/V2/reports?ndbno=07074&type=b&format=json&api_key=fK5sqSNg2AUL1LYq39muCgA4FkacqSsj2yZegp0n', (resp) => {
  let data = '';
  // A chunk of data has been recieved.
  resp.on('data', (chunk) => {
    data += chunk;
  });
  // The whole response has been received. Print out the result.
  resp.on('end', () => {
    var newData = JSON.parse(data);
    console.log(newData.foods[0].food.nutrients[1].value);
  });

}).on("error", (err) => {
  console.log("Error: " + err.message);
});
