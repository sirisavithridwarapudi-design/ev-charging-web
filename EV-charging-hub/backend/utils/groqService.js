const axios = require('axios');

const groqService = {
    getPrediction: async (stationData, userContext = {}) => {
        const { GROQ_API_KEY, GROQ_MODEL, GROQ_ENDPOINT } = process.env;

        const prompt = `
      You are an AI assistant for an EV charging network.
      Station Details:
      Name: ${stationData.name}
      Current Status: ${stationData.isAvailable ? 'Available' : 'Occupied'}
      Capacity: ${stationData.connectorsCount} connectors
      Historical Usage Trend: Randomly generate a realistic pattern for this station.
      Current Time: ${new Date().toLocaleString()}

      Task:
      1. Predict station availability for the next 15, 30, and 60 minutes.
      2. Classify current demand level as High, Medium, or Low.
      3. Provide a brief summary including "Best time to charge" and "Expected waiting time".
      4. Suggest if user should visit now or wait.

      Return the response in JSON format only with these keys: 
      {
        "predictions": {"15m": string, "30m": string, "60m": string},
        "demandLevel": "High" | "Medium" | "Low",
        "summary": string,
        "recommendation": string,
        "waitTime": string
      }
    `;

        try {
            const response = await axios.post(
                GROQ_ENDPOINT,
                {
                    model: GROQ_MODEL,
                    messages: [
                        { role: 'system', content: 'You are a helpful EV charging data analyst.' },
                        { role: 'user', content: prompt }
                    ],
                    response_format: { type: 'json_object' }
                },
                {
                    headers: {
                        'Authorization': `Bearer ${GROQ_API_KEY}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            return JSON.parse(response.data.choices[0].message.content);
        } catch (error) {
            console.error('Groq AI Error:', error.response ? error.response.data : error.message);
            // Fallback logic
            return {
                predictions: { "15m": "Likely Available", "30m": "Likely Available", "60m": "Moderate" },
                demandLevel: "Medium",
                summary: "Unable to generate AI summary at this moment.",
                recommendation: "Please check live status.",
                waitTime: "5-10 mins"
            };
        }
    }
};

module.exports = groqService;
