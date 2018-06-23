const express = require('express');
var fs = require("fs");
const app = express();

app.use(express.json());


fs.readFile('./Speiseplan.json', 'utf8', function(err, data) {
  if (err) throw err;
  var jsonContent = JSON.parse(data);

  for (var a = 0; a < 7; a++) {
    var s = JSON.stringify(jsonContent.wochentag[a]);
    ausgabe(s);
    console.log("\n----------------------\n");
  }
});

function ausgabe(s) {
  for (i = 0; i < s.length; i++) {
    if (s[i] == "{" || s[i] == "}") {} else if (s[i] + s[i - 1] == ("\",")) {
      process.stdout.write("\n");
    } else if (s[i] == "\"") { } else process.stdout.write(s[i]);
  }
};
for (var a = 0; a < jsonContent.wochentag.length; a++) {
  console.log(jsonContent.wochentag[a].gerichte);
  console.log(jsonContent.wochentag[a].beilagen);
  //console.log(jsonContent.wochentag[a].);
  console.log(" --------------------------------- ");
};



// Our meals
const gerichte_alle = '/api/gerichte';
const gerichte_spez = '/api/gerichte/:id';

// app is an object that contains a lot of usefull methods like
// .get() / .post() / .put() / .delete()
// these functions correspond to the CRUD verbs

const gerichte = [{
    id: 1,
    name: 'Currywurst'
  },
  {
    id: 2,
    name: 'Suppe'
  }, // Hauptspeise + Beilage -> json
  {
    id: 3,
    name: 'Hähnchengeschnetzeltes'
  },
];


app.get('/', (req, res) => {
  res.send("Hello World");
});

app.get(gerichte_alle, (req, res) => {
  res.send(gerichte);
});

app.get(gerichte_spez, (req, res) => {
  const gericht = gerichte.find(c => c.id === parseInt(req.params.id));
  if (!gericht) res.status(404).send('The meal with the given ID was not found');
  else res.send(gericht);
});

app.post(gerichte_alle, (req, res) => {
  const gericht = {
    id: gerichte.length + 1,
    name: req.body.name
  };

  gerichte.push(gerichte);
  res.send(gerichte);
});

app.put(gerichte_spez, (req, res) => {

  const gericht = gerichte.find(c => c.id === parseInt(req.params.id));
  if (!gerichte) res.status(404).send('The meal with the given ID was not found');
  // 2.) Validate
  // If invalid return 400 - Bad request

  // 3.) Update course
  // Return the uptaded course
  gericht.name = req.body.name;
  res.send(gericht);
  console.log(gerichte);
});

// Get the Port which is set by environment or 3000 by default
const port = process.env.PORT || 3000;
app.listen(port, () => console.log("Listening on port " + port + "..."));
