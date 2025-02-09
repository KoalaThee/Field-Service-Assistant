const express = require('express');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');

// Load environment variables from .env file
dotenv.config();

const app = express();

// setup Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Import LINE webhook router
const line = require('./middleware/line');
app.use('/webhook', line);

// Import AI router
const { getAIResponse } = require('./middleware/openAI');
app.post('/ai/converse', async (req, res) => {
    try {
        const { message } = req.body;
        if (!message) {
            return res.status(400).json({ error: "Message is required" });
        }

        const aiResponse = await getAIResponse(message);
        res.json({ reply: aiResponse.reply });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Global Error Handling of all middleware
app.use((err, req, res, next) => {
  console.error('Global Error Handler:', err.stack);
  res.status(500).json({ error: 'Internal Server Error' });
});

// Start the server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
