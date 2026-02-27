# 🚀 EchoSyntax | Speak Logic, Get Code 

![EchoSyntax Banner](https://img.shields.io/badge/EchoSyntax-Voice_to_Code-00f2fe?style=for-the-badge&logo=react)
![Built By](https://img.shields.io/badge/Built_By-EchoMind_Duo-d834ff?style=for-the-badge)

**EchoSyntax** is a next-generation Voice-to-Code IDE that bridges the gap between human thought and machine logic. Coding shouldn't be limited by how fast your fingers can type. Just speak your algorithm in natural language, and watch our AI translate, explain, and execute it in real-time.

Built with passion for the Hackathon by **EchoMind Duo**.

---

## ✨ Key Features

* 🎙️ **Voice-to-Code Generation:** Speak your logic, and let AI generate the exact working code.
* 💻 **Dual-Mode IDE:** Features a built-in terminal for backend languages (Python, C++, Java, C) and a live Web Preview for HTML.
* ⚡ **Instant Execution:** Run your generated code instantly via the integrated Judge0 CE Cloud Compiler.
* 📱 **Fully Responsive:** Beautiful glassmorphism UI that works flawlessly on desktop and mobile.
* 🌍 **Global Standard:** Powered by Llama 3.3, trained to understand pure English prompts and deliver highly accurate algorithms.

---

## 🛠️ The Tech Stack

**Frontend:**
* React.js (Vite)
* Web Speech API (Native browser voice recognition)
* Custom CSS (Glassmorphism & Cyberpunk UI)

**Backend & APIs:**
* Node.js & Express.js
* Groq Cloud API (Llama-3.3-70b-versatile for AI logic generation)
* Judge0 CE Community API (For code compilation and execution)

---

## 🚀 How to Run Locally

### 1. Clone the Repository
\`\`\`bash
git clone https://github.com/NiranjanKumar-J/EchoSyntax.git
cd EchoSyntax
\`\`\`

### 2. Setup the Backend
\`\`\`bash
cd backend
npm install
\`\`\`
*Create a `.env` file in the backend folder and add your Groq API Key:*
\`\`\`env
GROQ_API_KEY=your_api_key_here
\`\`\`
*Start the backend server:*
\`\`\`bash
node server.js
\`\`\`

### 3. Setup the Frontend
Open a new terminal window:
\`\`\`bash
cd frontend
npm install
npm run dev
\`\`\`

---

## 👥 The Creators (EchoMind Duo)
* 👑 **Niranjan Kumar J** - Visionary & Developer
* 💡 **Pradeepa K R** - Co-creator & Developer
