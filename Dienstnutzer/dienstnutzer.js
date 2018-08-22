/* Dienstnutzer, welcher ein PubSub System implementiert, welches
   Benutzern ermöglicht Tagesziele zu subscriben. Diese erhält der Benutzer
   dann jeden Tag */


const http = require('http');
const faye = require('faye');
const express = require('express');
const menu = require('node-menu');
var app = express();

menu.addDelimiter('*', 40, 'Health Tracker')
  .addItem(
    '\tBenutzer erstellen',
    function() {
      // Hier den Benutzer erstellen
      // ...
      console.log('Benutzer wurde erstellt!');
    }).addItem(
    '\tBenutzer abfragen',
    function() {
      // Hier den Benutzer abfragen
      // ...
      console.log('Benutzer wurde abgefragt');
    }).addItem(
    '\tBenutzer ändern',
    function() {
      // Hier den Benutzer ändern
      // ...
      console.log('Benutzer wurde geändert!');
    }).addItem(
    '\tBenutzer löschen',
    function() {
      // Hier den Benutzer löschen
      // ...
      console.log('Benutzer wurde gelöscht!');
    }).addItem(
    '\tEintrag erstellen',
    function() {
      // Hier den Eintrag erstellen
      // ...
      console.log('Eintrag wurde erstellt.');
    }).addItem(
    '\tEinträg abfragen',
    function() {
      // Hier die Einträge abfragen
      // ...
      console.log('Einträge wurden abgefragt.');
    }).addItem(
    '\tEintrag ändern',
    function() {
      // Hier den Eintrag verändern
      // ...
      console.log('Eintrag wurde verändert.');
    }).addItem(
    '\tEintrag löschen',
    function() {
      // Hier den Eintrag löschen
      // ...
      console.log('Eintrag wurde gelöscht.');
    }).addItem(
    '\tMaximale Kcal abfragen',
    function() {
      // Hier das maximale an Kcal abfragen
      // ...
      console.log('Maximale Kcal wurden abgefragt.');
    }).addItem(
    '\tÜbrige Kcal abfragen',
    function() {
      // Hier die Übrigen Kcal ausgeben
      // ...
      console.log('Übrige Kcal wurden abgefragt.');
    }).addItem(
    '\tMensa Speiseplan abfragen',
    function() {
      // Hier den Speiseplan abfragen
      // ...
      console.log('Der Speiseplan wurde abgefragt.');
    }).addItem(
    '\tMensagericht eintragen',
    function() {
      // Hier ein Mensagericht eintragen
      // ...
      console.log('Der Speiseplan wurde abgefragt.');
    }).addItem(
    '\tTopic abonnieren',
    function(topic) {
      client.subscribe(topic, function(message) {
        console.log(message.text);
      });
      console.log('Das Topic ' + topic + ' wurde abonniert!');
    }, null, [{
      'name': 'topic',
      'type': 'string'
    }])
  .addItem(
    '\tUnter einem Topic publishen',
    function(topic, textvalue) {
      console.log(textvalue);
      client.publish((topic), {
        text: JSON.stringify(textvalue)
      });
      console.log('Es wurde unter dem Topic ' + topic + ' gepublished.');
    }, null, [{
      'name': 'topic',
      'type': 'string'
    }, {
      'name': 'textvalue',
      'type': 'string'
    }]).start();

var server = http.createServer(app);
var fayeservice = new faye.NodeAdapter({
  mount: '/faye',
  timeout: 45
});
fayeservice.attach(server);
server.listen(3000, () => {
  console.log("Server is Listening on port 3000");
});
var client = fayeservice.getClient();
/*
      setInterval(function(){
        client.publish('/vitamins', { text: "Hello World!" } );
      }, 3000);
*/
