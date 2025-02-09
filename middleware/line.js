const express = require('express');
const axios = require('axios');
const router = express.Router();
const { getAIResponse } = require("./openAI");

async function replyToLine(replyToken, messageText) {
  const LINE_ACCESS_TOKEN = process.env.LINE_ACCESS_TOKEN;
  const url = 'https://api.line.me/v2/bot/message/reply';

  const data = {
    replyToken,
    messages: [{ type: 'text', text: messageText }]
  };

  try {
    await axios.post(url, data, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${LINE_ACCESS_TOKEN}`
      }
    });
    console.log('Reply sent to LINE successfully.');
  } catch (error) {
    console.error('Error sending reply to LINE:', error.response ? error.response.data : error.message);
    throw new Error('Failed to send reply to LINE');
  }
}

// Main LINE Webhook Endpoint
router.post('/', async (req, res) => {
  console.log('Received Webhook Event:', JSON.stringify(req.body, null, 2));
  if (!req.body || !req.body.events) {
    console.error('Invalid request received');
    return res.status(400).json({ error: 'Bad Request' });
  }

  for (const event of req.body.events) {
    if (event.type === 'message' && event.message.type === 'text') {
      const userMessage = event.message.text;
      const replyToken = event.replyToken;
      try {
        const aiResponse = await getAIResponse(userMessage); // Using imported function
        await replyToLine(replyToken, aiResponse.reply); // Send AI response back to LINE
      } catch (error) {
        await replyToLine(replyToken, "The Field Service Assistant is current unavaliable. Please try again later.");
      }
    } else {
      console.log('Received an unsupported event type.');
    }
  }
  res.sendStatus(200);
});

module.exports = router;
