const { instrument } = require('@socket.io/admin-ui')

const io = require('socket.io')(4000, {
    cors: {
        origin: ['http://localhost:3000', 
        'https://admin.socket.io']
    }
})

io.on('connection', socket => {
    // listen to event
    socket.on('send-message', (message, room) => {
        if (room === '') {
            // send exclude the user who creates message
            socket.broadcast.emit('recieve-message', message)
        } else {
            // send message to client with specified room
            socket.to(room).emit('recieve-message', message)
        }
    })

    socket.on('join-room', (room, callback) => {
        socket.join(room)
        callback('Joined')
    })
})

instrument(io, { auth: false })