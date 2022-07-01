import './App.css';
import Deck from './pages/deck';

import { Route, Routes } from 'react-router-dom';
import AuthBar from './components/NavBar';
import Apprend from './Apprend';

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
