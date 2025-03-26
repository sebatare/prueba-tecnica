import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { ShoppingCart, Home, Menu, X } from 'lucide-react';
import { useState } from 'react';

const Navbar = () => {
  const { cartCount } = useCart();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-blue-600 p-4 shadow-lg">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="text-2xl font-bold text-white flex items-center gap-2">
          🛍️ Tienda
        </Link>

        {/* Menú en pantallas grandes */}
        <div className="hidden md:flex gap-6 text-white">
          <Link to="/" className="flex items-center gap-1 hover:text-gray-200 transition">
            <Home size={20} /> Inicio
          </Link>
          <Link to="/cart" className="relative flex items-center gap-1 hover:text-gray-200 transition">
            <ShoppingCart size={20} />
            <span>Carrito</span>
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-3 bg-red-500 text-white text-xs rounded-full px-2">
                {cartCount}
              </span>
            )}
          </Link>
        </div>

        {/* Botón menú hamburguesa en móviles */}
        <button onClick={() => setIsOpen(!isOpen)} className="md:hidden text-white focus:outline-none">
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Menú desplegable en móviles */}
      {isOpen && (
        <div className="md:hidden mt-2 space-y-2 bg-blue-700 p-4 rounded-lg text-white">
          <Link to="/" className="block hover:text-gray-200 transition flex items-center gap-2">
            <Home size={20} /> Inicio
          </Link>
          <Link to="/cart" className="block relative hover:text-gray-200 transition flex items-center gap-2">
            <ShoppingCart size={20} /> Carrito
            {cartCount > 0 && (
              <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full px-2">
                {cartCount}
              </span>
            )}
          </Link>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
