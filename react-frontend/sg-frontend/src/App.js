import React, { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
let userId = Math.floor(Math.random() * 100) + 1;
let room = Math.floor(Math.random() * 10) % 2;
const socket = io('http://localhost:3004',
    {
        query: {
        userId: userId,
        room: room
    }
    }
); // Connect to backend server

function App() {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [receiver, setReceiver] = useState('');

    useEffect(() => {
        // Listen for messages from the server
        socket.on('message', (message) => {
            setMessages((prev) => [...prev, message]);
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

    const groupSend = () => {
      let payload = {
        room: room,
        message: input
      }
      socket.emit('group-message', payload); // Send message to server
      setInput(''); // Clear input field
    };

    return (
        <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
            <h1>Socket.IO Chat -  Client Id {userId} - room {room}</h1>
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
            <button onClick={groupSend} style={{ padding: '10px 20px' }}>
                Group Send
            </button>
        </div>
    );
}

export default App;
