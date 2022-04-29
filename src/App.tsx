import image from './images/dmitry-ratushny-unsplash.jpg';
import './App.css';
import Query from './pages/query';
import Login from './pages/Login';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={image} className="landing-image" alt="logo" />
      </header>
      <Login/>
      <Query/>
    </div>
  );
}

export default App;
