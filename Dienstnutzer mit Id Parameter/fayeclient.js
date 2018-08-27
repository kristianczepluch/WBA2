var faye = require('faye');
const http = require('http');
const readline = require('readline');

var client = new faye.Client('http://localhost:3000/faye');
client.subscribe('/vitamins', function(message){
  console.log(message.text);
});
