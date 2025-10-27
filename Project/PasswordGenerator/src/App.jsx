import { useCallback, useEffect, useRef, useState } from "react";
import "./App.css";

function App() {
  const [length, setLength] = useState(8);
  const [numberAllowed, setNumberAllowed] = useState(false);
  const [charAllowed, setCharAllowed] = useState(false);
  const [password, setPassword] = useState("");
  const [copied, setCopied] = useState(false);
  const [ripples, setRipples] = useState([]);

  const passwordRef = useRef(null);

  const copyPasswordToClipboard = useCallback(() => {
    passwordRef.current?.select();
    passwordRef.current?.setSelectionRange(0, 999);
    navigator.clipboard.writeText(password);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [password]);

  const passwordGenerator = useCallback(() => {
    let pass = "";
    let str = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
    if (numberAllowed) {
      str += "0123456789";
    }
    if (charAllowed) {
      str += "!@#$%^&*?~`";
    }

    for (let i = 1; i <= length; i++) {
      let char = Math.floor(Math.random() * str.length + 1);
      pass += str.charAt(char);
    }

    setPassword(pass);
  }, [length, numberAllowed, charAllowed, setPassword]);

  useEffect(() => {
    passwordGenerator();
  }, [length, numberAllowed, charAllowed, passwordGenerator]);

  const handleGenerateClick = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setRipples([...ripples, { x, y, id: Date.now() }]);
    setTimeout(() => setRipples([]), 600);
  };

  return (
    <div className="app-container">
      {/* Animated background particles */}
      <div className="particles">
        {[...Array(20)].map((_, i) => (
          <div key={i} className="particle" style={{ '--delay': `${i * 0.2}s` }}></div>
        ))}
      </div>

      {/* Main container */}
      <div className="main-wrapper">
        <h1 className="app-title">Password Generator</h1>
        
        {/* 3D Card with Glassmorphism */}
        <div className="card-3d">
          <div className="card-content">
            {/* Password Display */}
            <div className="password-display">
              <div className="password-wrapper">
                <input
                  type="text"
                  value={password}
                  className="password-input"
                  placeholder="Your secure password will appear here"
                  readOnly
                  ref={passwordRef}
                />
                <button 
                  className={`copy-btn ${copied ? 'copied' : ''}`}
                  onClick={copyPasswordToClipboard}
                >
                  {copied ? (
                    <span className="check-icon">✓</span>
                  ) : (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M20 9h-9a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h9a2 2 0 0 0 2-2v-9a2 2 0 0 0-2-2z"></path>
                      <path d="M4 9h9a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-9a2 2 0 0 1 2-2z"></path>
                      <path d="M8 3v6"></path>
                      <path d="M12 3v6"></path>
                      <path d="M16 3v6"></path>
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* Settings Panel */}
            <div className="settings-panel">
              <div className="setting-item">
                <label className="setting-label">Length: {length}</label>
                <div className="slider-wrapper">
                  <input
                    type="range"
                    min={8}
                    max={50}
                    value={length}
                    className="modern-slider"
                    onChange={(e) => setLength(e.target.value)}
                  />
                </div>
              </div>

              <div className="checkbox-group">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={numberAllowed}
                    onChange={() => setNumberAllowed((prev) => !prev)}
                    className="modern-checkbox"
                  />
                  <span className="checkbox-custom"></span>
                  <span className="checkbox-text">Numbers</span>
                </label>

                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={charAllowed}
                    onChange={() => setCharAllowed((prev) => !prev)}
                    className="modern-checkbox"
                  />
                  <span className="checkbox-custom"></span>
                  <span className="checkbox-text">Special Characters</span>
                </label>
              </div>
            </div>

            {/* Generate Button with Ripple Effect */}
            <button
              className="generate-btn"
              onClick={handleGenerateClick}
            >
              {ripples.map(ripple => (
                <span
                  key={ripple.id}
                  className="ripple"
                  style={{ left: `${ripple.x}px`, top: `${ripple.y}px` }}
                ></span>
              ))}
              <span className="btn-text">Generate Password</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;