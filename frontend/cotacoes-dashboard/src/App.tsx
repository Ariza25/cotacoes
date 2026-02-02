import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { Navbar } from './components/navbar';
import { Footer } from './components/footer';
import CotacoesList from './components/cotacoesList';
import StockDetails from './components/stockDetails';

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<CotacoesList />} />
        <Route path="/stock/:symbol" element={<StockDetails />} />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
