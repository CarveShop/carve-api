/* eslint-disable no-console */
const express = require('express');

const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);

app.use(express.json());
/*
* Simple html front end to connect to websocket
*/
app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
    <script src="/socket.io/socket.io.js"></script>
    <script>
      var socket = io();
      socket.on('data', (msg) => console.log(msg));
    </script>
    </html>
  `);
});

/*
* Handle connection, disconnection.
*/
let client;
io.on('connection', (socket) => {
  console.log(`New user connected ${socket.id}`);
  client = socket;

  socket.emit('data', 'connected');
  socket.on('disconnect', () => console.log('user disconnected'));
});

/*
* Wait for webhook post and send it to the last client
*/
app.post('/', (req, res) => {
  console.log(req.body);
  client.emit('data', req.body);
  return res.send(req.body);
});


/*
* Start listening on port 3001
*/
http.listen(3001, () => console.log('listening on *:3001'));
