/* Dienstnutzer, welcher als GUI fungiert und ein basic PubSub System enthält. */

const request = require('request');
const http = require('http');
const faye = require('faye');
const express = require('express');
const menu = require('node-menu');
var app = express();
var dHost = 'https://wba2-heroku-tracker-service.herokuapp.com';


menu.addDelimiter('*', 40, 'Health Tracker')
  .addItem(
    '\tBenutzer erstellen',
    function(username, usergender, userage, userheigt, userweight) {
      // Code here

    }, null, [{
      'name': 'username',
      'type': 'string'
    }, {
      'name': 'usergender',
      'type': 'string'
    }, {
      'name': 'userage',
      'type': 'numeric'
    }, {
      'name': 'userheigt',
      'type': 'numeric'
    }, {
      'name': 'userweight',
      'type': 'numeric'
    }]).addItem(
    '\tBenutzer abfragen',
    function(benutzerId) {
      var url = dHost + '/User/' + benutzerId;
      request.get(url, function(err, res, body) {
        body = JSON.parse(body);
        console.log(body);
      });

    }, null, [{
      'name': 'benutzerId',
      'type': 'numeric'
    }]).addItem(
    '\tBenutzer ändern',
    function(userId, username, usergender, userage, userheigt, userweight) {

      // Code here

    }, null, [{
      'name': 'userId',
      'type': 'numeric'
    }, {
      'name': 'username',
      'type': 'string'
    }, {
      'name': 'usergender',
      'type': 'string'
    }, {
      'name': 'userage',
      'type': 'numeric'
    }, {
      'name': 'userheigt',
      'type': 'numeric'
    }, {
      'name': 'userweight',
      'type': 'numeric'
    }]).addItem(
    '\tBenutzer löschen',
    function(userId) {

      // Code here

    }, null, [{
      'name': 'benutzerId',
      'type': 'numeric'
    }]).addItem(
    '\tEintrag erstellen',
    function(userId, name, menge, kcal) {

      // Code here

    }, null, [{
      'name': 'userId',
      'type': 'numeric'
    }, {
      'name': 'name',
      'type': 'string'
    }, {
      'name': 'menge',
      'type': 'numeric'
    }, {
      'name': 'kcal',
      'type': 'numeric'
    }]).addItem(
    '\tEinträg abfragen',
    function(benutzerId, eintragId) {
      // Code here
    }, null, [{
      'name': 'benutzerId',
      'type': 'numeric'
    }, {
      'name': 'eintragId',
      'type': 'numeric'
    }]).addItem(
    '\tEintrag löschen',
    function(userId, eintragId) {

      // Code here

    }, null, [{
      'name': 'benutzerId',
      'type': 'numeric'
    }, {
      'name': 'eintragId',
      'type': 'numeric'
    }]).addItem(
    '\tÜbrige Kcal abfragen',
    function(benutzerId) {
      // Code here

    }, null, [{
      'name': 'benutzerId',
      'type': 'numeric'
    }]).addItem(
    '\tMensa Speiseplan abfragen',
    function(monat, tag) {

      var url = dHost + '/MensaGm/Speiseplan/' + monat + '/' + tag;
      request.get(url, function(err, res, body) {
        body = JSON.parse(body);
        console.log(body);
      });

    }, null, [{
      'name': 'monat',
      'type': 'numeric'
    }, {
      'name': 'tag',
      'type': 'string'
    }]).addItem(
    '\tMensagericht eintragen',
    function(gericht, userId) {

      var url = dHost + '/User/MensaGm/Gerichte/' + gericht + '/' + userId;

      var options = {
        uri: url,
        method: 'POST'
      }

      request(options, function(err, res, body) {
        console.log(body);
      });

    }, null, [{
      'name': 'gericht',
      'type': 'string'
    }, {
      'name': 'userId',
      'type': 'numeric'
    }]).addItem(
    '\tMensabeilage eintragen',
    function(beilage, userId) {
      // Code here

    }, null, [{
      'name': 'beilage',
      'type': 'string'
    }, {
      'name': 'userId',
      'type': 'numeric'
    }]).addItem(
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
