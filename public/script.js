// Client-side Socket.IO communication logic

// Connect to the server
const socket = io('http://localhost:3000');

// Listen for messages
socket.on('message', (data) => {
    console.log(`Message from server: ${data}`);
});

// Send a message to the server
function sendMessage(msg) {
    socket.emit('message', msg);
}