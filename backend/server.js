require('dotenv').config();
const express = require('express');
const cors = require('cors');
const Groq = require('groq-sdk');
const axios = require('axios');

const app = express();
app.use(express.json());
app.use(cors());


const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });


app.post('/generate-code', async (req, res) => {
    try {
        const { userPrompt } = req.body;
        
        const modelsToTry = [
            "llama-3.3-70b-versatile",
            "llama-3.1-8b-instant"
        ];

        let text = "";
        let success = false;

        const prompt = `You are an expert AI coding assistant. 
        User Request: "${userPrompt}"
        
        STRICT INSTRUCTIONS:
        1. CRITICAL: Understand and respond strictly in standard English only.
        2. Solve EXACTLY what the user asks.
        3. Write the exact, working code for the requested logic.
        4. Provide the exact expected console output.
        5. Explain the code in a short 2-line sentence in clear English.
        6. Escape all newlines (\\n) and double quotes (\\") inside string values so the JSON remains valid.
        
        Respond ONLY with this valid JSON structure:
        {
          "language": "Language Name",
          "code": "Complete working algorithmic code",
          "explanation": "Short clear explanation in English",
          "output": "Exact console output"
        }`;

        for (const modelName of modelsToTry) {
            try {
                console.log(`\n⏳ Fetching code from Groq... Trying: ${modelName}`);
                
                const chatCompletion = await groq.chat.completions.create({
                    messages: [
                        { role: "system", content: "You are a rigid bot that outputs strictly raw, perfectly valid JSON. No exceptions." },
                        { role: "user", content: prompt }
                    ],
                    model: modelName,
                    temperature: 0.1,
                    response_format: { type: "json_object" } 
                });

                text = chatCompletion.choices[0]?.message?.content || "";
                success = true;
                console.log(`✅ Success! Code generated using ${modelName}`);
                break; 

            } catch (e) {
                console.log(`⚠️ Model ${modelName} failed. Reason: ${e.message}`);
            }
        }

        if (!success) {
            throw new Error("All fallback models failed boss!");
        }
        
        const parsedData = JSON.parse(text); 
        res.json(parsedData);

    } catch (error) {
        console.error("\n❌ Final Error:", error.message);
        res.status(500).json({ error: "Server Error boss! Check backend terminal." });
    }
});

app.post('/execute-code', async (req, res) => {
  try {
    console.log(`\n⏳ Executing code via Judge0 API...`);
    const { compiler, code } = req.body;

    const judge0Map = {
        'cpython-3.10.6': 71, 
        'nodejs-16.14.0': 63, 
        'openjdk-jdk-17.0.3+7': 62, 
        'gcc-12.1.0': 54,     
        'gcc-12.1.0-c': 50    
    };

    const languageId = judge0Map[compiler] || 71;

    const response = await axios.post('https://ce.judge0.com/submissions?base64_encoded=false&wait=true', {
        source_code: code,
        language_id: languageId
    });

    const outputData = response.data;

    if (outputData.stderr || outputData.compile_output) {
        res.json({
            status: '1',
            compiler_error: outputData.compile_output || outputData.stderr
        });
    } else {
        res.json({
            status: '0',
            program_message: outputData.stdout || 'Program executed successfully (No output)'
        });
    }
    
    console.log(`✅ Execution complete!`);

  } catch (error) {
    console.error("Compiler Backend Error:", error.message);
    res.status(500).json({ error: "Compiler API failed" });
  }
});

const PORT = 5000;
app.listen(PORT, () => console.log(`🚀 EchoSyntax Backend Server running on port ${PORT}`));