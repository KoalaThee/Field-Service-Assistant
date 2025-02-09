const express = require('express');
const { z } = require('zod');
const { OpenAI } = require('openai');
const router = express.Router();

// retrive OpenAI Key from .env
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// The system prompt for the AI
function defaultPrompt() {
  return ` [VERY IMPORTANT: FOLLOW THIS PROMPT CAREFULLY]
  You are an AI assistant dedicated to helping Field Service Engineers (FSEs) with technical queries related to field operations.
  Your main goal is to:
  - Provide accurate and concise responses.
  - Focus exclusively on Field Service topics such as troubleshooting, maintenance, and operational procedures or information on query related with Field Service Areas.
  - Reject unrelated queries by stating: "I'm only trained to assist with Field Service-related questions."
  - Avoid personal, general AI tasks, or non-technical topics.

For every response, include these mandatory attributes in the returned JSON:
  1. reply: Your direct, structured answer.
  2. questionAnalysis:
     - @VALID if the question is relevant to Field Service operations, information or statistics
     - @INVALID if the question is not related,
     - @INCOMPLETE if the question lacks sufficient context.

Remember: Your response must be concise, informative, and structured clearly while addressing both technical details and any general or statistical information requested.
Keep the total responses within 5000 characters
  `;
}

async function getAIResponse(message) {

  try {
    // specify model parameters
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      temperature: 0.7,
      messages: [
        {
          role: 'system',
          content: defaultPrompt(),
        },
        {
          role: 'user',
          content: `
            Please respond in a valid JSON with "reply" and "questionAnalysis".
            The user's query is: "${message}"
          `,
        }
      ]
    });

    // get AI response
    const rawText = response.choices[0].message.content.trim();

    // parse into JSON
    try {
      parsed = JSON.parse(rawText);
    } catch (err) {
      console.log("JSON parse failed, fallback to default");
      parsed = {
        reply: rawText,
        questionAnalysis: "@VALID",
      };
    }

    return parsed;
  } catch (error) {
    console.error("Error calling OpenAI API:", error.response ? error.response.data : error.message);
    throw new Error("OpenAI API error");
  }
}

// validate response with zod before returning AI reply to LINE
router.post('/', async (req, res) => {
  try {
    const { message } = req.body;
    if (!message || typeof message !== 'string') {
      throw new Error("Missing or invalid 'message' field");
    }

    // Call the AI function
    const aiOutput = await getAIResponse(message);

    // Define zod schema
    const replySchema = z.object({
      reply: z.string(),
      questionAnalysis: z.string(),
    });

    // Validate or throw an error
    const output = replySchema.parse(aiOutput);

    // Decide final user-facing text
    let finalReply;
    if (output.questionAnalysis === "@VALID") {
      finalReply = output.reply;
    } else if (output.questionAnalysis === "@INVALID") {
      finalReply = "It appears your question is not related to field service topics. Please ask a relevant question.";
    } else if (output.questionAnalysis === "@INCOMPLETE") {
      finalReply = "Could you please provide more details about your query?";
    } else {
      finalReply = "I'm not sure how to process your question. Please try rephrasing it.";
    }

    // Return final reply as JSON
    res.json({ reply: finalReply });
  } catch (error) {
    console.error("Error in /middleware route:", error);
    res.status(400).json({ error: error.message });
  }
});

module.exports = { getAIResponse, router };
