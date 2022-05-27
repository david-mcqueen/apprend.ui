import image from './images/dmitry-ratushny-unsplash.jpg';
import './App.css';
import Query from './pages/query';
import Login, { AuthConfig } from './pages/Login';
import { Route, Routes } from 'react-router-dom';
import Auth from './auth/auth';

function App() {

  const loginConfig: AuthConfig = {
    client_id: "5mvm8k5aedv1erv99nn6g203d3",
    domain: "apprend",
    region: "eu-west-2",
    redirect_uri: "http://localhost:3000/callback",
    response_type: "code",
    scope: ["email", "openid", "profile"]
  }

  const auth = new Auth(loginConfig);

  return (
    <div className="App">
      <header className="App-header">
        <img src={image} className="landing-image" alt="logo" />
      </header>
      <Login 
        {...auth}/>
        <Routes>
          <Route path="/query" element={<Query />} />
          
        </Routes>
    </div>
  );
}

export default App;
