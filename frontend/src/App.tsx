import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Cart from './pages/Cart'; 
import Success from './pages/Success';
import Cancel from './pages/Cancel';
import { CartProvider } from './context/CartContext';
import Navbar from './components/Navbar';
import RefundDetails from './pages/RefundDetails';
import PartialRefund from './pages/PartialRefund';

function App() {
  return (
    <CartProvider>
      <Router>
        <Navbar /> {/* Este es el Navbar que contiene el contador */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/success" element={<Success />} />
        <Route path="/cancel" element={<Cancel />} />
        <Route path='/refund-details' element={<RefundDetails/>}/>
        <Route path='/partial-refund' element={<PartialRefund/>}/>
        </Routes>
      </Router>
    </CartProvider>
  );
}

export default App;
