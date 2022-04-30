import image from './images/dmitry-ratushny-unsplash.jpg';
import './App.css';
import Query from './pages/query';
import Login, { LoginConfig } from './pages/Login';
import { Route, Routes } from 'react-router-dom';

function App() {

  const loginConfig: LoginConfig = {
    client_id: "5s4n5nkmqrh88a05s1c8der32c",
    domain: "apprend",
    region: "eu-west-2",
    redirect_uri: "http://localhost:3000/callback",
    response_type: "code",
    scope: ["email", "openid", "profile"]
  }

  return (
    <div className="App">
      <header className="App-header">
        <img src={image} className="landing-image" alt="logo" />
      </header>
      <Login 
        {...loginConfig}/>
        <Routes>
          <Route path="/query" element={<Query />} />
          
        </Routes>
    </div>
  );
}

export default App;
