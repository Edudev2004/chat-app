import React, { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

const socket = io('https://b666b05caa8a.ngrok-free.app');

function App() {
  const [user, setUser] = useState('');
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState([]);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    socket.on('receiveMessage', (msg) => setMessages(prev => [...prev, msg]));
    socket.on('receiveHistory', (msgs) => setMessages(msgs));
    socket.on('users', (usersList) => setUsers(usersList));

    return () => {
      socket.off('receiveMessage');
      socket.off('receiveHistory');
      socket.off('users');
    }
  }, [user]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = () => {
    if (!user || !message) return;
    socket.emit('sendMessage', { user, text: message });
    setMessage('');
  };

  const joinChat = (username) => {
    setUser(username);
    socket.emit('join', username);
  }

  return (
    <div className="container mt-5">
      {!user ? (
        <input
          type="text"
          placeholder="Ingresa tu nombre"
          className="form-control"
          onKeyDown={e => { if (e.key === 'Enter') joinChat(e.target.value) }}
        />
      ) : (
        <>
          <h3>Chat MVP</h3>
          <div className="mb-2">
            <b>Usuarios online:</b> {users.map(u => u.user).join(', ')}
          </div>
          <div className="border p-3 mb-2" style={{ height: '300px', overflowY: 'scroll' }}>
            {messages.map((m, i) => (
              <div key={i} className={m.user === user ? 'my-message' : ''}>
                <b>{m.user}:</b> {m.text}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
          <input
            type="text"
            value={message}
            onChange={e => setMessage(e.target.value)}
            className="form-control"
            placeholder="Escribe un mensaje"
            onKeyDown={e => { if (e.key === 'Enter') sendMessage() }}
          />
          <button className="btn btn-primary mt-2" onClick={sendMessage}>Enviar</button>
        </>
      )}
    </div>
  );
}

export default App;