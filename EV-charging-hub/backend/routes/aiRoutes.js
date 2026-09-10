const express = require('express');
const router = express.Router();
const groqService = require('../utils/groqService');
const { protect } = require('../middleware/authMiddleware');

router.post('/chat', protect, async (req, res) => {
    const { prompt, message } = req.body;
    const finalPrompt = prompt || message;

    if (!finalPrompt) {
        return res.status(400).json({ message: 'Prompt or message is required' });
    }

    try {
        const { GROQ_API_KEY, GROQ_MODEL, GROQ_ENDPOINT } = process.env;

        if (!GROQ_API_KEY) {
            return res.status(500).json({ message: 'GROQ_API_KEY not configured' });
        }

        const axios = require('axios');
        const response = await axios.post(
            GROQ_ENDPOINT,
            {
                model: GROQ_MODEL,
                messages: [{ role: 'user', content: finalPrompt }],
            },
            {
                headers: {
                    'Authorization': `Bearer ${GROQ_API_KEY}`,
                    'Content-Type': 'application/json'
                }
            }
        );
        res.json({ response: response.data.choices[0].message.content });
    } catch (error) {
        console.error("Groq API Error:", error.response?.data || error.message);
        res.status(500).json({ message: 'AI Service Error' });
    }
});

module.exports = router;
