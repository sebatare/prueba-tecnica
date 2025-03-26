import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';

const PartialRefund = () => {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const [products, setProducts] = useState<{ id: number; name: string; quantity: number; price: number }[]>([]);
  const [selectedProducts, setSelectedProducts] = useState<{ [key: number]: number }>({});
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (sessionId) {
      fetch('http://localhost:3000/api/products/refund-products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ session_id: sessionId }),
      })
        .then((response) => response.json())
        .then((data) => {
          setProducts(data);
          setLoading(false);
        })
        .catch((error) => {
          console.error('Error al obtener los productos:', error);
          setLoading(false);
        });
    }
  }, [sessionId]);

  const handleProductSelection = (productId: number, action: 'add' | 'remove') => {
    setSelectedProducts((prevSelected) => {
      const currentQuantity = prevSelected[productId] || 0;
      let newQuantity = currentQuantity;

      if (action === 'add' && currentQuantity < (products.find((p) => p.id === productId)?.quantity ?? 0)) {
        newQuantity += 1;
      } else if (action === 'remove' && currentQuantity > 0) {
        newQuantity -= 1;
      }

      if (newQuantity !== currentQuantity) {
        return { ...prevSelected, [productId]: newQuantity };
      }
      return prevSelected;
    });
  };

  const calculateTotal = () => {
    let total = 0;
    Object.keys(selectedProducts).forEach((productId) => {
      const id = parseInt(productId);
      const quantity = selectedProducts[id];
      const product = products.find((p) => p.id === id);
      if (product) {
        total += (product.price / 100) * quantity;
      }
    });
    return total.toFixed(2);
  };

  const handleRefundPartial = () => {
    if (Object.keys(selectedProducts).length === 0) {
      alert('Por favor, seleccione al menos un producto para el reembolso parcial.');
      return;
    }

    let subtotal = 0;
    Object.keys(selectedProducts).forEach((productId) => {
      const id = parseInt(productId);
      const quantity = selectedProducts[id];
      const product = products.find((p) => p.id === id);
      if (product) {
        subtotal += (product.price / 100) * quantity;
      }
    });

    if (subtotal <= 0) {
      alert('El subtotal no es válido.');
      return;
    }

    const productIds = Object.keys(selectedProducts).map(Number);

    fetch('http://localhost:3000/api/orders/partial-refund', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        session_id: sessionId,
        product_ids: productIds,
        subtotal: subtotal.toFixed(2),
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.message === 'Reembolso parcial procesado con éxito') {
          alert('Reembolso parcial procesado correctamente');
          navigate(`/refund-details?session_id=${sessionId}`);
        } else {
            console.log("acaaaaaa", data.message)
          alert('Hubo un error al procesar el reembolso parcial.');
        }
      })
      .catch((error) => {
        console.log("aklsdjlaksdsa", error)
        console.error('Error en el reembolso parcial:', error);
        alert('Hubo un error al procesar el reembolso parcial.');
      });
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-blue-50 px-4">
      <div className="bg-white p-8 rounded-lg shadow-lg text-center w-full max-w-md">
        <h2 className="text-3xl font-bold text-blue-700 mb-4">Reembolso Parcial</h2>

        {loading ? (
          <p>Cargando productos...</p>
        ) : (
          <>
            <p className="text-lg text-gray-700 mt-2">Selecciona los productos que deseas devolver:</p>
            <div className="mt-4">
              {products.map((product) => {
                const selectedQuantity = selectedProducts[product.id] || 0;

                return (
                  <div key={product.id} className="flex items-center mb-4">
                    <div className="flex items-center">
                      <button
                        onClick={() => handleProductSelection(product.id, 'remove')}
                        className="text-gray-700 mr-2 px-2 py-1 bg-gray-200 rounded-md"
                        disabled={selectedQuantity === 0}
                      >
                        -
                      </button>
                      <span className="text-gray-700">{selectedQuantity}</span>
                      <button
                        onClick={() => handleProductSelection(product.id, 'add')}
                        className="text-gray-700 ml-2 px-2 py-1 bg-gray-200 rounded-md"
                        disabled={selectedQuantity >= product.quantity}
                      >
                        +
                      </button>
                    </div>
                    <label htmlFor={`product-${product.id}`} className="text-gray-700 ml-2">
                      {product.name} - {product.quantity} x ${(product.price / 100).toFixed(2)}
                    </label>
                  </div>
                );
              })}
            </div>

            <div className="mt-4 text-xl font-bold text-gray-700">
              Total: ${(calculateTotal())}
            </div>

            <button
              onClick={handleRefundPartial}
              className="w-full px-6 py-3 text-white bg-green-600 rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-400 mt-6"
            >
              Solicitar Reembolso Parcial
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default PartialRefund;
