import image from './images/dmitry-ratushny-unsplash.jpg';
import './App.css';
import Query from './pages/query';
import Login from './pages/Login';
import { Route, Routes } from 'react-router-dom';
import Auth from './auth/auth';

function App() {

  return (
    <div className="App">
      <header className="App-header">
        <img src={image} className="landing-image" alt="logo" />
      </header>
      <Login />
        <Routes>
          <Route path="/query" element={<Query />} />
          
        </Routes>
    </div>
  );
}

export default App;
