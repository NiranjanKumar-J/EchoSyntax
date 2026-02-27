import { useState } from 'react';
import axios from 'axios';
import { FaMicrophone, FaCode, FaPlay, FaTimes } from 'react-icons/fa';
import './App.css';

function App() {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [generatedCode, setGeneratedCode] = useState('');
  const [displayedCode, setDisplayedCode] = useState('');
  const [aiLanguage, setAiLanguage] = useState('');
  const [loading, setLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [copied, setCopied] = useState(false);

  const [showEditorWorkspace, setShowEditorWorkspace] = useState(false);
  const [editorCode, setEditorCode] = useState('');
  const [editorLang, setEditorLang] = useState('python');
  const [editorOutput, setEditorOutput] = useState('');
  const [htmlContent, setHtmlContent] = useState(''); 
  const [isExecuting, setIsExecuting] = useState(false);

  const startListening = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return alert("Browser doesn't support Voice. Use Chrome.");
    
    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US'; 
    recognition.interimResults = false;

    recognition.onstart = () => setIsListening(true);
    recognition.onresult = (event) => {
      setTranscript(event.results[0][0].transcript);
      setIsListening(false);
    };
    recognition.onerror = () => setIsListening(false);
    recognition.start();
  };

  const typeText = async (fullText) => {
    setIsTyping(true);
    setDisplayedCode('');
    for (let i = 0; i <= fullText.length; i++) {
      setDisplayedCode(fullText.slice(0, i));
      await new Promise(r => setTimeout(r, 15));
    }
    setIsTyping(false);
  };

  const fetchCodeFromAI = async () => {
    if (!transcript) return;
    setLoading(true);
    setGeneratedCode('');
    setDisplayedCode('');
    
    try {
      const response = await axios.post('https://echo-syntax.vercel.app/generate-code', {
        userPrompt: transcript
      });
      
      const codeRes = response.data.code;
      setGeneratedCode(codeRes);
      setAiLanguage(response.data.language || 'Code');
      setLoading(false);
      
      speakExplanation(response.data.explanation);
      typeText(codeRes);
    } catch (error) {
      console.error(error);
      alert("Server error boss!");
      setLoading(false);
    }
  };

  
  const speakExplanation = (text) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US'; 
    window.speechSynthesis.speak(utterance);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const executeCodeInEditor = async () => {
    if (!editorCode) return;
    setIsExecuting(true);

    if (editorLang === 'html') {
      setEditorOutput(''); 
      setHtmlContent(editorCode); 
      setIsExecuting(false);
      return;
    }

    setHtmlContent(''); 
    setEditorOutput('Compiling and Running... ⏳\nConnecting to Server...');

    const languageMap = {
      'python': 'cpython-3.10.6',
      'java': 'openjdk-jdk-17.0.3+7',
      'cpp': 'gcc-12.1.0',
      'c': 'gcc-12.1.0-c'
    };

    const compilerName = languageMap[editorLang];

    try {
      const response = await axios.post('https://echo-syntax.vercel.app/execute-code', {
        compiler: compilerName,
        code: editorCode,
        save: false
      });
      
      if (response.data.status === '0') {
        setEditorOutput(response.data.program_message || 'Program executed successfully (No output)');
      } else {
        const errorMsg = response.data.compiler_error || response.data.program_error || response.data.program_message || 'Unknown Error';
        setEditorOutput(`Error:\n${errorMsg}`);
      }
    } catch (error) {
      console.error("Execution error:", error);
      setEditorOutput("Failed to run code. Make sure your server is running!");
    }
    setIsExecuting(false);
  };

  const resetAll = () => {
    setTranscript('');
    setGeneratedCode('');
    setDisplayedCode('');
    setAiLanguage('');
  };

  return (
    <div className="app-container">
      <nav className="navbar">
        <div className="logo-container">
          <img src="/logo.png" alt="EchoSyntax Logo" className="custom-logo" />
          <div className="logo-text">
            <span className="title">EchoSyntax</span>
            <span className="subtitle">Speak Logic, Get Code</span>
          </div>
        </div>
        <div className="nav-links">
          <button className="nav-editor-btn" onClick={() => setShowEditorWorkspace(true)}>
            💻 Editor
          </button>
          <a href="#about">About</a>
          <button className="try-again-btn" onClick={resetAll}>
            <span className="icon">⛶</span> Clear
          </button>
        </div>
      </nav>

      {!showEditorWorkspace ? (
        <main className="main-content">
          <header className="hero">
            <h1>Speak Logic, Get Code</h1>
            <p>Tell the logic, we'll generate the code</p>
          </header>

          <div className="transcript-wrapper">
              <div className={`transcript-box ${transcript ? 'active' : ''}`}>
          
                {transcript ? transcript : "Write a program to print numbers from 1 to 5"} 
              </div>
          </div>

          <div className="interaction-area">
            <div className="mic-section">
              <div className={`mic-glow-wrapper ${isListening ? 'listening' : ''}`}>
                <button className="mic-button" onClick={startListening}>
                  <FaMicrophone className="mic-icon" />
                </button>
              </div>
              <h3 className="mic-title">Click & Speak</h3>
            </div>

            <div className="code-section-wrapper">
              <div className="code-section">
                <div className="window-header">
                  <div className="dots">
                    <span className="dot red"></span>
                    <span className="dot yellow"></span>
                    <span className="dot green"></span>
                  </div>
                  <div className="header-center">
                    <span className="title">Generated Code</span>
                    {aiLanguage && <span className="lang-badge">⚡ {aiLanguage}</span>}
                  </div>
                  <div className="header-actions">
                    {generatedCode && (
                      <button className="copy-btn" onClick={copyToClipboard} disabled={isTyping}>
                        {copied ? "✅ Copied" : "📋 Copy"}
                      </button>
                    )}
                  </div>
                </div>

                <div className="code-content">
                  {loading ? (
                    <p className="loading-text">Generating Magic... ⏳</p>
                  ) : (
                    <pre>
                      <code>{displayedCode || '// Your generated code will appear here...'}</code>
                      {isTyping && <span className="typing-cursor">|</span>}
                    </pre>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="action-area">
            <button className="get-code-btn" onClick={fetchCodeFromAI} disabled={!transcript || loading || isTyping}>
              <FaCode className="btn-icon" /> Get Code
            </button>
          </div>

          <section id="about" className="about-section">
            <h2 className="section-title">✨ The Engine Behind The Magic</h2>
            <div className="about-grid">
              <div className="about-card app-info-card">
                <span className="badge">THE WEB APP</span>
                <h3>EchoSyntax</h3>
                <p>Coding shouldn't be limited by how fast your fingers can type. EchoSyntax is a next-generation Voice-to-Code IDE that bridges the gap between human thought and machine logic. Just speak your algorithm, and watch our AI translate, explain, and execute it in real-time.</p>
              </div>
              <div className="about-card creators-card">
                <span className="badge">THE CREATORS</span>
                <h3>EchoMind Duo</h3>
                <div className="creators-list">
                  <div className="creator-item">👑 Niranjan Kumar J</div>
                  <div className="creator-item">👑 Pradeepa K R</div>
                </div>
              </div>
            </div>
            <div className="about-card tech-stack-card">
  <span className="badge">THE TECH STACK</span>
  <h3>Built With Industry Standards</h3>
  <div className="tech-grid">
    <div className="tech-item">🚀 Groq Cloud API (Llama 3.3)</div>
    <div className="tech-item">⚡ Judge0 CE Compiler</div>
    <div className="tech-item">⚛️ React.js & Node.js</div>
    <div className="tech-item">🎤 Web Speech API</div>
  </div>
</div>
          </section>
        </main>
      ) : (
        <div className="editor-workspace">
          <div className="workspace-header">
            <div className="workspace-title">
              <h2>💻 EchoSyntax Code Editor</h2>
              <p>Paste your generated code here, select language, and hit Run!</p>
              <p><strong>NOTE:</strong> [To run JAVA code, make sure to change the class name as "Main" before execution.]</p>
            </div>
            <button className="close-workspace-btn" onClick={() => setShowEditorWorkspace(false)}>
               Back to AI
            </button>
          </div>

          <div className="editor-layout">
            <div className="editor-pane">
              <div className="pane-header">
                <span className="pane-title">Source Code</span>
                <select 
                  className="lang-selector" 
                  value={editorLang} 
                  onChange={(e) => {
                    setEditorLang(e.target.value);
                    setEditorOutput(''); 
                    setHtmlContent(''); 
                  }}
                >
                  <option value="python">Python</option>
                  <option value="java">Java</option>
                  <option value="cpp">C++</option>
                  <option value="c">C</option>
                  <option value="html">HTML / Web</option>
                </select>
                <button className="real-run-btn" onClick={executeCodeInEditor} disabled={!editorCode || isExecuting}>
                  <FaPlay style={{fontSize: '10px'}}/> {isExecuting ? "RUNNING..." : "RUN CODE"}
                </button>
              </div>
              <textarea
                className="native-textarea"
                value={editorCode}
                onChange={(e) => setEditorCode(e.target.value)}
                placeholder="// Paste or write your code here..."
                spellCheck="false"
              />
            </div>

            <div className="output-pane">
              <div className="pane-header">
                <span className="pane-title">
                  {editorLang === 'html' ? '🌐 Live Web Preview' : 'Terminal Output'}
                </span>
              </div>
              <div className="terminal-screen" style={editorLang === 'html' ? { padding: 0, background: '#fff' } : {}}>
                {editorLang === 'html' ? (
                  <iframe 
                    srcDoc={htmlContent || "<div style='font-family: sans-serif; padding: 20px; color: #666;'><h1>Run your HTML code to see preview...</h1></div>"} 
                    title="HTML Preview" 
                    style={{ width: '100%', height: '100%', border: 'none' }} 
                  />
                ) : (
                  <pre><code>{editorOutput || "Output will be displayed here..."}</code></pre>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      <footer className="app-footer">
        <div className="footer-content">
          <p>© 2026 EchoSyntax. All rights reserved.</p>
          <p className="footer-subtext">Built with 💻 and ❤️ by EchoMind Duo</p>
        </div>
      </footer>
    </div>
  );
}

export default App;