import image from './images/dmitry-ratushny-unsplash.jpg';
import './App.css';
import Query from './pages/query';

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
          <Route path="/query" element={<Query />} />
          
        </Routes>
    </div>
  );
}

export default App;
