import { io } from 'socket.io-client'
import { useEffect, useState } from 'react'

function App() {
  const [messages, setMessages] = useState([])
  const [message, setMessage] = useState('')
  const [room, setRoom] = useState('')
  const [roomId, setRoomId] = useState('')

  const socket = io('http://localhost:4000')
  useEffect(() => {
    socket.on('connect', () => {
      setRoomId(socket.id)
    })
  }, [])

  socket.on('recieve-message', m => {
    setMessages([...messages, m])
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    // send a message to server
    socket.emit('send-message', message, room)
    setMessage('')
  }

  const joinRoom = () => {
    socket.emit('join-room', room, message => {
      setMessages([...messages, message])
    })
  }

  return (
    <div className="App px-24 my-24">
      <p className='p-2 bg-gray-200'>{roomId}</p>
      <form onSubmit={handleSubmit} className="border mx-auto p-4">

        <div className='border border-gray-800 p-3'>
          {messages && messages.map((message, index) => (
            <p className='p-1 bg-gray-200' key={index}>{message}</p>
          ))}
        </div>

        <div className='space-x-3 mt-3 flex'>
          <label>Message</label>
          <input
            onChange={(e) => setMessage(e.target.value)}
            value={message}
            type="text"
            className='border border-gray-900 w-full' />
        </div>

        <div className='space-x-3 mt-3 flex'>
          <label>Room</label>
          <input
            onChange={(e) => setRoom(e.target.value)}
            value={room}
            type="text" className='border border-gray-900 w-full' />
          <button onClick={joinRoom} className='border border-gray-800 mt-3 w-full px-3'>Join</button>
        </div>
        <button className='border border-gray-800 mt-3 w-full px-3'>Send</button>
      </form>
    </div>
  );
}

export default App;
