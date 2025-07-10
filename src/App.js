import './App.css';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import Home from './Home';
import Login from './Login';
import Main from './Main';

function App() {
  return (
    <BrowserRouter>
      <nav id='titlebar'>
        <p id='tilt'>Blood Banking System</p>
        <Link to="/">Home</Link>
        <Link to="/login">Login</Link>
      </nav>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/main" element={<Main />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

