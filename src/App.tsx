import image from './images/dmitry-ratushny-unsplash.jpg';
import './App.css';
import Deck from './pages/deck';

import { Route, Routes } from 'react-router-dom';
import AuthBar from './components/NavBar';

function App() {

  return (
    <div className="App">
      <AuthBar />
      <header className="App-header">
        <img src={image} className="landing-image" alt="logo" />
      </header>
        <Routes>
          <Route path="/deck/:deck" element={<Deck />} />
          
        </Routes>
    </div>
  );
}

export default App;
