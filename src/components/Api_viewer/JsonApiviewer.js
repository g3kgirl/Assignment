import React, { useState } from 'react';
import './styles.css';
const TextApp = () => {
  const [url, setUrl] = useState('');
  const [jsonData, setJsonData] = useState(null);
  const [error, setError] = useState('');
  const [editableJson, setEditableJson] = useState('');
  const [format, setFormat] = useState('html');
  const [isManualInput, setIsManualInput] = useState(false);

  const isValidUrl = (string) => {
    try {
      new URL(string);
      return true;
    } catch {
      return false;
    }
  };

  const fetchData = async () => {
    if (!isValidUrl(url)) {
      setError('Invalid URL');
      return;
    }

    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error('Failed to fetch data');

      const data = await response.json();
      setJsonData(data);
      setEditableJson(JSON.stringify(data, null, 2));
      setError('');
      setIsManualInput(false);
    } catch (err) {
      const errorMessage = err.message.includes('Unexpected token <')
        ? 'The response is not valid JSON. Please check the API URL.'
        : err.message;
      setError(errorMessage);
      setJsonData(null);
    }
  };

  const handleJsonChange = (e) => {
    setEditableJson(e.target.value);
    setIsManualInput(true);
    try {
      const parsed = JSON.parse(e.target.value);
      setJsonData(parsed);
      setError('');
    } catch {
      setError('Invalid JSON format');
    }
  };

  const renderContent = () => {
    if (format === 'html') {
      return <div dangerouslySetInnerHTML={{ __html: jsonToHtml(jsonData) }} />;
    } else if (format === 'markdown') {
      return <div>{jsonToMarkdown(jsonData)}</div>;
    }
  };

  const jsonToHtml = (data) => {
    return `<pre>${JSON.stringify(data, null, 2)}</pre>`;
  };

  const jsonToMarkdown = (data) => {
    return JSON.stringify(data, null, 2);
  };

  return (
    <div className="app">
      <h1>Assignment of Terafac Technologies</h1>
      <input
        type="text"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        placeholder="Enter API URL"
      />
      <button onClick={fetchData}>GET</button>
      {error && <p className="error">{error}</p>}

      <div className="json-display">
        <h2>JSON Response</h2>
        <pre>{JSON.stringify(jsonData, null, 2)}</pre>
      </div>
<div>

<h3>Edit your json below</h3>
 <textarea
    className={error ? 'invalid' : 'valid'}
    value={editableJson}
    onChange={handleJsonChange}
    rows="10"
    cols="50"
    placeholder="Edit JSON here"
  />
</div>
     

      <div>
        <label>
          <input
            type="checkbox"
            checked={isManualInput}
            onChange={() => setIsManualInput(!isManualInput)}
          />
          Enable Manual JSON Input
        </label>
      </div>

      <select onChange={(e) => setFormat(e.target.value)}>
        <option value="html">HTML</option>
        <option value="markdown">Markdown</option>
      </select>

      <div className="output">
        <h2>Output</h2>
        {renderContent()}
      </div>
    </div>
  );
};

export default TextApp ;
