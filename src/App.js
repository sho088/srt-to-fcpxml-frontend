import React, { useState } from 'react';
import './App.css';

function App() {
  const [srtFile, setSrtFile] = useState(null);
  const [fps, setFps] = useState('');
  const [message, setMessage] = useState('');

  const handleFileChange = (e) => {
    setSrtFile(e.target.files[0]);
  };

  const handleFpsChange = (e) => {
    setFps(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!srtFile || !fps) {
      setMessage('Please select a SRT file and enter a valid FPS.');
      return;
    }

    const formData = new FormData();
    formData.append('srtFile', srtFile);
    formData.append('fps', fps);

    try {
      const response = await fetch('https://srt-to-fcpxml-backend.onrender.com/convert', {
        method: 'POST',
        body: formData,
      });
    

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${srtFile.name.split('.')[0]}.fcpxml`;
        document.body.appendChild(a);
        a.click();
        a.remove();
        setMessage('FCPXML file has been generated successfully.');
      } else {
        setMessage('Failed to convert the file.');
      }
    } catch (error) {
      setMessage('An error occurred while converting the file.');
    }
  };

  return (
    <div className="App">
      <h1>SRT to FCPXML Converter</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Select SRT file:</label>
          <input type="file" accept=".srt" onChange={handleFileChange} />
        </div>
        <div>
          <label>Enter FPS:</label>
          <input type="text" value={fps} onChange={handleFpsChange} placeholder="e.g., 29.97" />
        </div>
        <button type="submit">Convert</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}

export default App;
