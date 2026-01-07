import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import mongoose from 'mongoose';
import cors from 'cors';

const app = express();
app.use(cors());
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: '*' } });

app.get('/', (req, res) => {
    res.send('Backend corriendo OK')
})

// Conectar a MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/chat-mvp')
    .then(() => console.log('MongoDB conectado'))
    .catch(err => console.log(err));

// Lista de usuarios conectados
let users = [];

io.on('connection', (socket) => {
    console.log('Usuario conectado:', socket.id);

    // Cuando el usuario envía su nombre
    socket.on('join', (username) => {
        socket.username = username;
        users.push({ id: socket.id, user: username });
        io.emit('users', users);
    });

    // Manejar mensajes
    socket.on('sendMessage', (msg) => {
        io.emit('receiveMessage', msg);
    });

    // Usuario desconectado
    socket.on('disconnect', () => {
        users = users.filter(u => u.id !== socket.id);
        io.emit('users', users);
        console.log('Usuario desconectado:', socket.id);
    });
});

server.listen(5000, () => console.log('Servidor corriendo en puerto 5000'));