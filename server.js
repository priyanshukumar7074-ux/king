const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');
const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const users = {};
const messages = [];

io.on('connection', (socket) => {
    console.log('New user connected:', socket.id);

    socket.on('login', (username) => {
        users[socket.id] = username;
        socket.emit('login_success', { username, users: Object.values(users), messages });
        socket.broadcast.emit('user_joined', { username, users: Object.values(users) });
    });

    socket.on('send_message', (data) => {
        const message = { from: users[socket.id], to: data.to, text: data.text, timestamp: new Date() };
        messages.push(message);
        io.emit('receive_message', message);
    });

    socket.on('disconnect', () => {
        const username = users[socket.id];
        delete users[socket.id];
        io.emit('user_left', { username, users: Object.values(users) });
        console.log('User disconnected:', username);
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
