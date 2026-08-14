import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Welcome } from './pages/Welcome';
import { Menu } from './pages/Menu';
import { Checkout } from './pages/Checkout';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Welcome />} />
        <Route path="/menu" element={<Menu />} />
        <Route path="/checkout" element={<Checkout />} />
      </Routes>
    </Router>
  );
}

export default App;
