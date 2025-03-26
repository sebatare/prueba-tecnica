import { useEffect, useState } from 'react';
import { useCart } from '../context/CartContext';
import { ShoppingCart, Plus, Minus } from 'lucide-react';

const Home = () => {
  const [products, setProducts] = useState<{ 
    id: number; name: string; description: string; price: number; stock: number; imageUrl: string;
  }[]>([]);
  
  const { cart, addToCart, removeFromCart } = useCart();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/products');
        const data = await response.json();
        
        setProducts(data.map((product: { id: number; name: string; description: string; price: number; stock: number }) => ({
          ...product,
          imageUrl: `https://picsum.photos/seed/${product.id}/300/200`
        })));
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <h1 className="text-4xl font-bold text-center mb-10">🛒 Productos Disponibles</h1>

      {products.length === 0 ? (
        <p className="text-center text-gray-500">Cargando productos...</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => {
            const cartItem = cart.find((item) => item.id === product.id);
            return (
              <div 
                key={product.id} 
                className="bg-white rounded-lg shadow-lg overflow-hidden transition transform hover:scale-105"
              >
                <img src={product.imageUrl} alt={product.name} className="w-full h-48 object-cover" />
                
                <div className="p-4">
                  <h2 className="text-xl font-semibold">{product.name}</h2>
                  <p className="text-gray-600 text-sm mb-3">{product.description}</p>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-bold text-blue-600">${product.price}</span>
                    
                    {product.stock > 0 ? (
                      cartItem ? (
                        <div className="flex items-center gap-2">
                          <button 
                            onClick={() => removeFromCart(product.id)}
                            className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-full transition cursor-pointer"
                          >
                            <Minus size={16} />
                          </button>
                          <span className="text-lg font-bold">{cartItem.stock}</span>
                          <button 
                            onClick={() => addToCart(product)}
                            className="bg-green-500 hover:bg-green-600 text-white p-2 rounded-full transition cursor-pointer"
                          >
                            <Plus size={16} />
                          </button>
                        </div>
                      ) : (
                        <button 
                          onClick={() => addToCart(product)}
                          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition cursor-pointer"
                        >
                          <ShoppingCart size={18} /> Agregar
                        </button>
                      )
                    ) : (
                      <span className="text-red-500 font-semibold">Agotado</span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Home;
