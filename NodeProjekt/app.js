// define required modules
const http = require('http');
const express = require('express');

// create express object
const app = express();




app.get('/', (req,res)=>{
  res.send('Hallo Node.js');
});


// create server which listens on port 3000
const server = http.createServer(app);
server.listen(3000, () => {
  console.log('Server listening on Port 3000');
});
