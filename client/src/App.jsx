import React from 'react'

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

// pages
import Home from "./components/pages/Home.jsx"
import UserLoginRegister from './components/pages/UserLoginRegister.jsx'

// context
import { UserProvider } from './context/userContext.jsx'
import { MessageProvider } from './context/messageContext.jsx'
import Message from './components/sections/actions/Message.jsx'
import UserDashboard from './components/pages/UserDashboard/UserDashboard.jsx'

const App = () => {

  return (
    <>
      <UserProvider>
        <MessageProvider>
          <Message />
          <Router>
            <Routes>
              <Route path='/' element={<Home />} />
              <Route path='/user-login-register' element={<UserLoginRegister />} />
              <Route path='/user/dashboard' element={<UserDashboard />} />
            </Routes>
          </Router>
        </MessageProvider>
      </UserProvider>
    </>
  )
}

export default App

{/*import React, { useState } from 'react';
import axios from 'axios';

const App = () => {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState('');

  // Handle file selection
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file) {
      setMessage('Please select a file first.');
      return;
    }
    const formData = new FormData();
    formData.append('file', file);
    try {
      const response = await axios.post(
        'http://localhost:5011/user/upload-file/resume',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': "token"
          }
        }
      );
      setMessage('File uploaded successfully!');
      console.log(response.data);
    } catch (error) {
      console.error(error);
      setMessage('Error uploading file.');
    }
  };

  return (
    <div style={{ width: '400px', margin: '50px auto', textAlign: 'center' }}>
      <form onSubmit={handleSubmit}>
        <h2>Upload Resume</h2>
        <input type="file" name="file" onChange={handleFileChange} />
        <br /><br />
        <button type="submit">Upload</button>
      </form>

      {message && <p style={{ marginTop: '20px' }}>{message}</p>}
    </div>
  );
};

export default App;*/}