import image from './images/dmitry-ratushny-unsplash.jpg';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={image} className="landing-image" alt="logo" />
      </header>
    </div>
  );
}

export default App;
