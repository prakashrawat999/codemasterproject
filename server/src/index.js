const dotenv = require('dotenv');
const cors =  require('cors');
const mongoose = require('mongoose');
const chalk = require('chalk');
const http = require('http');
const express = require('express');
const cookieParser = require('cookie-parser');
const app = express();
const httpServer = new http.Server(app);
const axios = require("axios");

const CLIENT_URL = "http://localhost:3000";

app.use(
    cors({
      origin: CLIENT_URL,
      methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
      credentials: true, // allow session cookies from browser to pass throught
    })
);

app.use(cookieParser());

dotenv.config({path:'./config.env'});

app.use(express.json());

require('./db/connec');

app.use(require('./router/auth'));

const User = require('./models/userSchema');

const PORT = process.env.PORT;

var rooms = []
var removeRooms = []

const io = require("socket.io")(httpServer, {
  cors: {
    origin: CLIENT_URL,
    methods: ["GET", "POST"],
  },
})

function removingRooms() {

  console.log("ROOMS: " + rooms)
  if (removeRooms.length != 0) {
      for (let i = 0; i < removeRooms.length; i++) {
          if (io.sockets.adapter.rooms[removeRooms[i]] === undefined) {
              rooms = rooms.filter(function (item) {
                  return item !== removeRooms[i]
              })
          }
      }
  }
  removeRooms.splice(0,removeRooms.length)

  setTimeout(removingRooms, 60 * 60 * 1000);
}

function getLastValue(set){
  let value;
  for(value of set);
  return value;
}

io.on("connection", socket => {
  console.log(chalk.green.inverse("Connected Successfully 👍 "));
  const { id } = socket.client
  console.log(chalk.blue.inverse(`User connected ${id}`))

  // Check if room exists
  socket.on('room-id', msg => {
      let exists = rooms.includes(msg)
      socket.emit('room-check', exists)

  })

  // If code changes, broadcast to sockets
  socket.on('code-change', msg => {
      socket.broadcast.to(socket.room).emit('code-update', msg)

  })

  // Send initial data to last person who joined
  socket.on('user-join', msg => {
      let room = io.sockets.adapter.rooms.get(socket.room);
      let lastPerson = getLastValue(room);
      console.log("lastPerson-->" + lastPerson);
      io.to(lastPerson).emit('accept-info', msg);
  })

  // Add room to socket
  socket.on('join-room', msg => {
      console.log("JOINING " + msg.id)
      socket.room = msg.id
      socket.join(msg.id);
      console.log(io.sockets.adapter.rooms);
      console.log(io.sockets.adapter.rooms.get(msg.id));
    
      let room = io.sockets.adapter.rooms.get(socket.room);
      console.log(room);
      if (room.size > 1) {
          var it = room.values();

          var first = it.next();
          let user = first.value;
          console.log("first-->" + user);
          // let user = Object.keys(room.sockets)[0]
          io.to(user).emit('request-info', "");
      }
      console.log("-----> "+ Object.values(msg));
      socket.emit('receive-message', { sender: 'admin', text: `${msg.nameOfUser}, welcome to CodeMaster Room😄`});
      socket.broadcast.to(socket.room).emit('receive-message', { sender: 'admin', text: `${msg.nameOfUser} has joined😃` });
      io.sockets.in(socket.room).emit('joined-users', room.size)
  })

  socket.on('created-room', msg => {
      console.log(chalk.green.inverse("Created Room 😸" + msg))
      rooms.push(msg)
      console.log(rooms);
  })


  // If language changes, broadcast to sockets
  socket.on('language-change', msg => {
      io.sockets.in(socket.room).emit('language-update', msg)
  })


  socket.on('sendMessage', ({message, sender}) => {
    io.to(socket.room).emit('receive-message', { sender: sender, text: message });
  });

  // If connection is lost
  socket.on('disconnect', () => {
      console.log(`User ${id} disconnected`)
  })

  socket.on('leaving', (msg)=>{
    try {
        let room = io.sockets.adapter.rooms.get(socket.room)
        io.sockets.in(socket.room).emit('joined-users', room.size - 1)
        socket.broadcast.to(socket.room).emit('receive-message', { sender: 'admin', text: `${msg.nameOfUser} has left😢` });
        if (room.size === 1) {
            console.log("Leaving Room " + socket.room)
            socket.leave(socket.room)
            removeRooms.push(socket.room)
        }
    }
    catch (error) {
        console.log("Leaving error")
    }
  })

  // Check if there is no one in the room, remove the room if true
  socket.on('disconnecting', () => {
      try {
          let room = io.sockets.adapter.rooms.get(socket.room)
          io.sockets.in(socket.room).emit('joined-users', room.size - 1)
          if (room.size === 1) {
              console.log("Leaving Room " + socket.room)
              socket.leave(socket.room)
              removeRooms.push(socket.room)
          }
      }
      catch (error) {
          console.log("Disconnect error")
      }
  })
})
/*
app.get('/', (req, res) => {
    res.send(`Welcome`);
});
*/
/*
if(process.env.NODE_ENV === "production"){
    app.use(express.static("client/build"))
}
*/

if (process.env.NODE_ENV === 'production') {
    // Exprees will serve up production assets
    app.use(express.static('client/build'));
  
    // Express serve up index.html file if it doesn't recognize route
    const path = require('path');
    app.get('*', (req, res) => {
      res.sendFile(path.join(__dirname, 'client', 'build', 'index.html'));
    });
}

app.post('/execute', async (req, res)=>{
    console.log(req.body);
    const { script, language, stdin, versionIndex } = req.body;

    const response = await axios({
        method: "POST",
        url: "https://api.jdoodle.com/execute",
        data: {
          script: script,
          stdin: stdin,
          language: language,
          versionIndex: versionIndex,
          clientId: "dd5379c4e35d493220df470d351cd1bc",
          clientSecret: "b37234a63574b0f3adfe2117bcf9e483cb0d612b3e4a6de4c3dfce4917c9ca85"
        },
        responseType: "json",
      });

    console.log(chalk.green.inverse("RESPONSE from jdoodle " + response.data));
    res.json(response.data);
})

console.log(chalk.green.inverse(' Server Side 👍 '));
removingRooms();


httpServer.listen(PORT, () => {
    console.log(chalk.green.inverse(`port ${PORT}`));
});


//npm i chalk@4.1.2