import WebSocket from "ws";

export type PeerPayload = {
  type: 'join' | 'connected' | 'disconnected'
  roomId?: string, 
  peerId?: string,
}

export interface ExtendedWebSocket extends WebSocket {
	isAlive?: boolean
  roomId?: string
  peerId?: string
}

function broadcast(clients: Set<ExtendedWebSocket>, data: string) {
  Array.from(clients)
    .filter((client) => client.roomId === this.roomId)
    .forEach((client) => {
      if (client !== this && client.readyState === WebSocket.OPEN) {
          client.send(data)
      }
	  })
}

export function handleWebSocketConnected(this: WebSocket.Server, socket: ExtendedWebSocket) {
  const clients: Set<WebSocket> = this.clients

  socket.isAlive = true;

  socket.on('pong', () => {
    socket.isAlive = true;
  })

  socket.on('message', (data: string) => {
    try {    
      const { type, roomId, peerId } = JSON.parse(data)

      if (type === 'join') {
        Object.assign(socket, { roomId, peerId })

        broadcast.call(socket, clients, JSON.stringify({ type: 'connected', roomId, peerId }))
      }
    } catch (e) {
      console.error(e);
    }
  })

  socket.on('close', () => {
    const { roomId, peerId } = socket

    broadcast.call(socket, clients, JSON.stringify({ type: 'disconnected', roomId, peerId }))
  })
}

export const handleWebSocketPing = (server: WebSocket.Server) => {
  const key: NodeJS.Timeout = setInterval(() => {
    server.clients.forEach((client: ExtendedWebSocket) => {
      if (client.isAlive === false) {
        return client.terminate()
      }

      client.isAlive = false
      client.ping(JSON.stringify({}))
    })
  }, 30000)

  server.on('close', function close() {
    clearInterval(key)
  })
}
