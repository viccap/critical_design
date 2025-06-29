import React, { useState, useRef, useEffect } from 'react';
import './App.css';

const messages = [
  'Analyzing face...',
  'Checking credit score...',
  'Cross-checking your Google search history...',
  'Evaluating meme preferences...',
  'Detecting emotional instability...',
  'Connecting to refrigerator camera...',
  'Comparing with government database...',
];

function App() {
  const [checkedItems, setCheckedItems] = useState({
    policy: false,
    terms: false,
    emails: false,
    cookies: false,
  });
  const [accepted, setAccepted] = useState(false);
  const [selfieTaken, setSelfieTaken] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('');
  const [finalMessage, setFinalMessage] = useState('');
  const [selfieURL, setSelfieURL] = useState(null);

  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  const allChecked = Object.values(checkedItems).every(Boolean);

  useEffect(() => {
    if (accepted && !selfieTaken) {
      navigator.mediaDevices
        .getUserMedia({ video: true })
        .then((stream) => {
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
        })
        .catch((err) => {
          console.error('Camera access denied:', err);
        });
    }
  }, [accepted, selfieTaken]);

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setCheckedItems((prev) => ({ ...prev, [name]: checked }));
  };

  const handleAccept = () => {
    if (allChecked) {
      setAccepted(true);
    }
  };

  const handleTakeSelfie = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (video && canvas) {
      const ctx = canvas.getContext('2d');
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const imageDataURL = canvas.toDataURL('image/png');
      setSelfieURL(imageDataURL);
      setSelfieTaken(true);
      startLoading();
      // Stop webcam stream
      const stream = video.srcObject;
      stream.getTracks().forEach((track) => track.stop());
    }
  };

  const startLoading = () => {
    setLoading(true);
    let i = 0;
    const interval = setInterval(() => {
      setLoadingMessage(messages[i % messages.length]);
      i++;
    }, 1000);

    setTimeout(() => {
      clearInterval(interval);
      setLoading(false);
      const qualified = Math.random() < 0.5;
      setFinalMessage(
        qualified
          ? '✅ Your data has been stored. Here is the code: 3948'
          : '❌ Your data has been stored. However, you do not qualify for the snack.'
      );
    }, 5000);
  };

  return (
    <div className="App">
      <div className="card">
        <h1 className="title">🛡️ Zustimmung erforderlich</h1>
        <p className="subtitle">Bitte stimme allen Richtlinien zu, um fortzufahren.</p>

        {!accepted && (
          <>
            <div className="checkboxes">
              <label><input type="checkbox" name="policy" checked={checkedItems.policy} onChange={handleCheckboxChange} /> Datenschutzrichtlinie</label>
              <label><input type="checkbox" name="terms" checked={checkedItems.terms} onChange={handleCheckboxChange} /> Nutzungsbedingungen</label>
              <label><input type="checkbox" name="emails" checked={checkedItems.emails} onChange={handleCheckboxChange} /> Erhalt von E-Mails</label>
              <label><input type="checkbox" name="cookies" checked={checkedItems.cookies} onChange={handleCheckboxChange} /> Cookies akzeptieren</label>
            </div>

            <button className="accept-button" onClick={handleAccept} disabled={!allChecked}>
              ✅ Accept & Continue
            </button>
          </>
        )}

        {accepted && !selfieTaken && (
          <div className="selfie-section">
            <p>📸 Bitte mache ein Selfie, um fortzufahren:</p>
            <video ref={videoRef} autoPlay playsInline className="video" />
            <button className="accept-button" onClick={handleTakeSelfie}>📷 Take Selfie</button>
            <canvas ref={canvasRef} style={{ display: 'none' }} />
          </div>
        )}

        {selfieTaken && selfieURL && (
          <div className="preview-section">
            <p>📷 Dein Selfie wurde aufgenommen:</p>
            <img src={selfieURL} alt="Selfie Preview" className="selfie-preview" />
          </div>
        )}

        {loading && (
          <div className="loading-section">
            <div className="loader"></div>
            <p>{loadingMessage}</p>
          </div>
        )}

        {!loading && finalMessage && (
          <div className="code">{finalMessage}</div>
        )}
      </div>
    </div>
  );
}

export default App;