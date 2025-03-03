// XmlInput.js
import React from 'react';
import './XmlInput.css';
function XmlInput({ xmlInput, setXmlInput, handleParse }) {
  return (
    <div className="xml-input-container">
      <h1>🌳 Toy XML Tree Builder 🌳</h1>
      <textarea
        rows="10"
        cols="50"
        value={xmlInput}
        onChange={e => setXmlInput(e.target.value)}
        placeholder="Enter XML here"
      />
      <button onClick={handleParse} className="parse-button">
        Parse XML
      </button>
    </div>
  );
}

export default XmlInput;
