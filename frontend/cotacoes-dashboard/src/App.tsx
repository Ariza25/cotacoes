import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Navbar } from './components/navbar';
import { Footer} from './components/footer';
import CotacoesList from './components/cotacoesList';
import StockDetails from './components/stockDetails';

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route
          path="/"
          element={
            <div className="min-h-screen bg-gray-100">
              <main className="max-w-7xl mx-auto px-6 py-8">
                <CotacoesList />
              </main>
            </div>
          }
        />
        <Route path="/stock/:symbol" element={<StockDetails />} />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
