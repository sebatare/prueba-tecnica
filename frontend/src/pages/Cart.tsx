//import { useNavigate } from 'react-router-dom';  // Cambiado de useHistory a useNavigate
import { useCart } from '../context/CartContext';
const Cart = () => {
  const { cart, removeFromCart, clearCart, getCartTotal } = useCart();
  //const navigate = useNavigate();  // Usamos useNavigate en lugar de useHistory

  const handleRemoveItem = (id: number) => {
    removeFromCart(id);
  };

  const handleClearCart = () => {
    clearCart();
  };

  const handleCheckout = async () => {
    // Aquí puedes realizar la lógica para la orden, como la creación de la orden en tu backend
    // Ejemplo de llamada API para crear una orden:
    try {
      const response = await fetch('http://localhost:3000/api/orders/create-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          products: cart.map(item => ({
            id: item.id,
            quantity: item.stock,  // En este caso, usamos el stock como cantidad
            price: item.price,
          })),
        }),
      });

      const data = await response.json();
      if (data.url) {
        window.location.href = data.url; // Redirige al usuario a Stripe
      }
    } catch (error) {
      console.error('Error al crear la orden:', error);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Tu Carrito</h1>
      {cart.length === 0 ? (
        <div className="text-center text-xl text-gray-500">
          <p>No tienes productos en el carrito.</p>
        </div>
      ) : (
        <div>
          <div className="space-y-4">
            {cart.map((item) => (
              <div key={item.id} className="flex items-center justify-between border-b py-4">
                <div className="flex items-center space-x-4">
                  <img src={item.imageUrl || '/placeholder-image.png'} alt={item.name} className="w-20 h-20 object-cover rounded-md" />
                  <div>
                    <h2 className="text-lg font-semibold">{item.name}</h2>
                    <p className="text-sm text-gray-500">{item.description}</p>
                    <span className="text-gray-700">Stock: {item.stock}</span>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-xl font-bold">${item.price * item.stock}</span>
                  <button
                    onClick={() => handleRemoveItem(item.id)}
                    className="bg-red-500 text-white px-4 py-2 rounded-lg text-sm"
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-between items-center mt-6">
            <button
              onClick={handleClearCart}
              className="bg-gray-500 text-white px-6 py-3 rounded-lg text-sm"
            >
              Vaciar carrito
            </button>
            <div className="text-xl font-semibold">
              Total: ${getCartTotal()}
            </div>
            <button
              onClick={handleCheckout}
              className="bg-blue-500 text-white px-6 py-3 rounded-lg text-sm"
            >
              Proceder al pago
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
