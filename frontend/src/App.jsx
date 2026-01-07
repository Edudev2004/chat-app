import { useState, useEffect, useRef } from "react"
import io from "socket.io-client"
import "./App.css"

const socket = io("http://192.168.1.16:5000")

function App() {
  const [user, setUser] = useState("")
  const [message, setMessage] = useState("")
  const [messages, setMessages] = useState([])
  const [users, setUsers] = useState([])
  const messagesEndRef = useRef(null)

  useEffect(() => {
    socket.on('receiveMessage', msg =>
      setMessages(prev => [...prev, msg])
    );

socket.on('receiveHistory', (msgs) => {
  setMessages(Array.isArray(msgs) ? msgs : [msgs]);
});

    socket.on('users', usersList =>
      setUsers(usersList)
    );

    return () => {
      socket.off('receiveMessage');
      socket.off('receiveHistory');
      socket.off('users');
    };
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const sendMessage = () => {
    if (!user || !message.trim()) return
    socket.emit('sendMessage', { user, text: message })
    setMessage('')
  }

  const joinChat = (username) => {
    if (!username.trim()) return
    setUser(username)
    socket.emit('join', username)
  }

  return (
    <div className="app">
      {!user ? (
        <div className="login">
          <h2>Chat MVP</h2>
          <input
            type="text"
            placeholder="Ingresa tu nombre"
            onKeyDown={e => {
              if (e.key === 'Enter') joinChat(e.target.value)
            }}
          />
        </div>
      ) : (
        <div className="chat">
          <header className="chat-header">
            <h3>Estás Dentro del Chat</h3>
            <span>
              <b>Online:</b> {users.map(u => u.user).join(', ')}
            </span>
          </header>

          <div className="messages">
            {messages.map((m, i) => (
              <div
                key={i}
                className={`message ${m.user === user ? 'me' : ''}`}
              >
                <b> {m.user}: </b> {m.text}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          <div className="input-area">
            <input type="text"
              value={message}
              onChange={e => setMessage(e.target.value)}
              place holder="Escribe un mensaje"
              onKeyDown={e => {
                if (e.key === 'Enter') sendMessage()
              }}
            />

            <button onClick={sendMessage}>Enviar</button>

          </div>
        </div>
      )}
    </div>
  )
  }

  export default App