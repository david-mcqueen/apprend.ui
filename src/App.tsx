import image from './images/dmitry-ratushny-unsplash.jpg';
import './App.css';
import Deck from './pages/deck';

import { Route, Routes } from 'react-router-dom';
import AuthBar from './components/NavBar';
import ListDecks from './Apprend';
import Apprend from './Apprend';
import { Component } from 'react';

function App() {

  return (
    <div className="App">
      <AuthBar />
      <Apprend />

      <Routes>
        <Route path="/deck/:deck" element={<Deck />} />
      </Routes>
    </div>
  );
}

export default App;
