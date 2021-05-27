const express = require('express');
const app = express();
const server = require('http').Server(app);
const WebSocket = require('ws');
const wss = new WebSocket.Server({ server })

function broadcast(data) {
  Array.from(wss.clients)
    .filter((client) => client.roomId === this.roomId)
    .forEach((client) => {
      if (client !== this && client.readyState === WebSocket.OPEN) {
        client.send(data)
      }
    })
}

wss.on('connection', (socket) => {
  socket.isAlive = true;

  socket.on('pong', () => {
    socket.isAlive = true;
  })

  socket.on('message', (data) => {
    const { type, roomId, peerId } = JSON.parse(data)

    if (type === 'join') {
      Object.assign(socket, { roomId, peerId })

      broadcast.call(socket, JSON.stringify({ type: 'connected', roomId, peerId }))
    }
  })

  socket.on('close', () => {
    const { roomId, peerId } = socket

    broadcast.call(socket, JSON.stringify({ type: 'disconnected', roomId, peerId }))
  })
})

const interval = setInterval(() => {
  wss.clients.forEach((client) => {
    if (client.isAlive === false) {
      return client.terminate()
    }

    client.isAlive = false
    client.ping(JSON.stringify({}))
  })
}, 30000)

wss.on('close', function close() {
  clearInterval(interval)
})