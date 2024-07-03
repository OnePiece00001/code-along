const express = require('express');
const {Server} = require('socket.io')
const http = require('http');
const ACTIONS = require('./constants.js')
require('dotenv').config()
const app = express();
const PORT = process.env.PORT || 5000;
const server = http.createServer(app);
const io = new Server(server);

const userSocketMap = {};

function getConnectedClients(roomId) {
    return Array.from(io.sockets.adapter.rooms.get(roomId) || []).map(
        (socketId) => {
            return {
                socketId,
                userName: userSocketMap[socketId],
            }
        }
    )
}


io.on('connection', (socket) => {
    console.log('socket id', socket.id);
    socket.on(ACTIONS.JOIN, ({roomId, userName}) => {
        userSocketMap[socket.id] = userName;
        socket.join(roomId);
        const clients = getConnectedClients(roomId);
        clients.forEach(({socketId}) => {
            io.to(socketId).emit(ACTIONS.JOINED, {
                clients,
                userName,
                socketId: socket.id,
            })
        })
    })

    socket.on(ACTIONS.CODE_CHANGE, ({ roomId, code }) => {
        // io.to(roomId).emit(ACTIONS.CODE_CHANGE, {code})
        socket.in(roomId).emit(ACTIONS.CODE_CHANGE, {code})
    })
    socket.on(ACTIONS.SYNC_CODE, ({ socketId, code }) => {
        io.to(socketId).emit(ACTIONS.CODE_CHANGE, {code}) 
        // socket.in(roomId).emit(ACTIONS.CODE_CHANGE, {code}) // 
    })

    socket.on('disconnecting', () => {
        const rooms = [...socket.rooms];
        rooms.forEach((roomId) => {
            socket.in(roomId).emit(ACTIONS.DISCONNECTED, {
                socketId: socket.id,
                userName: userSocketMap[socket.id],
            })
        })
        delete userSocketMap[socket.id]
        socket.leave()
    })
})


server.listen(PORT, () => console.log(`Listening on port ${PORT}`))