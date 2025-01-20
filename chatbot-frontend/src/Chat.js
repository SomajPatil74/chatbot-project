import React, { useState, useEffect } from "react";
import axios from "axios";

const Chat = () => {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");

    useEffect(() => {
        fetchMessages();
    }, []);

    const fetchMessages = async () => {
        try {
            const response = await axios.get("http://localhost:8090/messages");
            setMessages(response.data);
        } catch (error) {
            console.error("Error fetching messages:", error);
        }
    };

    const sendMessage = async () => {
        if (!input.trim()) return;
        try {
            const response = await axios.post("http://localhost:8090/messages", {
                user_message: input,
            });
            setMessages([response.data, ...messages]);
            setInput("");
        } catch (error) {
            console.error("Error sending message:", error);
        }
    };

    return (
        <div style={{ padding: "20px", maxWidth: "600px", margin: "0 auto" }}>
            <h1>Chatbot</h1>
            <div style={{ border: "1px solid #ccc", padding: "10px", marginBottom: "10px" }}>
                {messages.map((msg, index) => (
                    <div key={index}>
                        <p><strong>You:</strong> {msg.user_message}</p>
                        <p><strong>Bot:</strong> {msg.bot_response}</p>
                    </div>
                ))}
            </div>
            <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type your message..."
                style={{ width: "80%", padding: "10px" }}
            />
            <button onClick={sendMessage} style={{ padding: "10px" }}>Send</button>
        </div>
    );
};

export default Chat;
