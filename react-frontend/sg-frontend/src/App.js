import React, { useState, useEffect } from 'react';
import { io } from 'socket.io-client';

const socket = io('http://localhost:3004'); // Connect to backend server

function App() {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [receiver, setReceiver] = useState('');
    const [clientId, setClientId] = useState('');

    useEffect(() => {
        // Listen for messages from the server
        socket.on('message', (message) => {
            setMessages((prev) => [...prev, message]);
        });

        socket.on('assign', (id) => {
          setClientId(id);
      });

        // Cleanup on component unmount
        return () => {
            socket.off('message');
        };
    }, []);

    const sendMessage = () => {
      let payload = {
        message: input,
        receiver: receiver
      }
      socket.emit('message', payload); // Send message to server
      setInput(''); // Clear input field
    };

    return (
        <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
            <h1>Socket.IO Chat -  Client Id {clientId}</h1>
            <div style={{ border: '1px solid #ccc', padding: '10px', height: '300px', overflowY: 'scroll', marginBottom: '10px' }}>
                {messages.map((msg, index) => (
                    <div key={index} style={{ margin: '5px 0' }}>
                        {msg}
                    </div>
                ))}
            </div>
            <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type a message..."
                style={{ padding: '10px', width: '80%', marginRight: '10px' }}
            />
            <input
                type="text"
                value={receiver}
                onChange={(e) => setReceiver(e.target.value)}
                placeholder="Receiver..."
                style={{ padding: '10px', width: '80%', marginRight: '10px' }}
            />
            <button onClick={sendMessage} style={{ padding: '10px 20px' }}>
                Send
            </button>
        </div>
    );
}

export default App;
