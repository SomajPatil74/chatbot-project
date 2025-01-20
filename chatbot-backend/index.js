const express = require("express");
const mysql = require("mysql2");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
const PORT = 8090;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// MySQL connection
const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "root",
    database: "chatbot"
});

db.connect((err) => {
    if (err) {
        console.error("Database connection error:", err);
        return;
    }
    console.log("Connected to MySQL database");
});

// Predefined users queries and chatbots responses
const predefinedResponses = [
    { query: "hello", response: "Hi there! How can I help you?" },
    { query: "time", response: `The current time is ${new Date().toLocaleTimeString()}.` },
    { query: "help", response: "How can I assist you today?" },
    { query: "what is your name?", response: "I am a chatbot!"},
    { query: "how are you?", response: "I'm doing great, thank you for asking!"},
    { query: "what can you do?", response: "I can answer your questions!"},
    
    // We can add more queries and responses here as needed
];

// Route1 : Get messages
app.get("/messages", (req, res) => {
    db.query("select * from messages order by created_at desc", (err, results) => {
        if (err) {
            console.error(err);
            res.status(500).send("Error fetching messages");
        } else {
            res.json(results);
        }
    });
});

// Route2 : Add message
app.post("/messages", (req, res) => {
    const { user_message } = req.body;
    let bot_response = "I'm not sure how to respond to that."; // Default response if no match is found

    // Loop through the predefined responses and match the user message
    for (const { query, response } of predefinedResponses) {
        if (user_message.toLowerCase().includes(query)) {
            bot_response = response;
            break; // Stop the loop once a match is found
        }
    }

    const query = "insert into messages (user_message, bot_response) values (?, ?)";
    db.query(query, [user_message, bot_response], (err) => {
        if (err) {
            console.error(err);
            res.status(500).send("Error saving message");
        } else {
            res.status(201).json({ user_message, bot_response });
        }
    });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
