import { useEffect, useState } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';

const Success = () => {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const [orderStatus, setOrderStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();  // Hook de navegación para redirigir a otra página



  useEffect(() => {
    console.log('sessionId:', sessionId);
    if (sessionId) {
      fetch('http://localhost:3000/api/orders/update-order-status', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ session_id: sessionId }),
      })
        .then((res) => res.json())
        .then((data) => {
          setOrderStatus(data.message);
          setLoading(false);
        })
        .catch((error) => {
          console.error('Error al actualizar la orden:', error);
          setOrderStatus('Error al actualizar la orden.');
          setLoading(false);
        });
        
    }
  }, [sessionId]);

  const handleRefundSuccess = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/orders/refund-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ session_id: sessionId }),
      });
  
      if (response.ok) {
        console.log('Reembolso procesado con éxito');
        navigate(`/refund-details?session_id=${sessionId}`);
      } else {
        console.error('Error en el reembolso');
        alert('Hubo un error al procesar el reembol222so.');
      }
    } catch (error) {
      console.error('Error en la solicitud de reembolso:', error);
      alert('Hubo un error al procesar el reembolso.');
    }
  };
  
  
  

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-green-50 px-4">
      <div className="bg-white p-8 rounded-lg shadow-lg text-center w-full max-w-md">
        <h2 className="text-3xl font-bold text-green-700 mb-4">¡Pago exitoso! 🎉</h2>
        <p className="text-lg text-gray-700 mt-2">Tu compra ha sido procesada correctamente.</p>

        {/* {sessionId && <p className="text-sm text-gray-500 mt-2">ID de sesión: <span className="text-gray-700 font-semibold">{sessionId}</span></p>} */}

        {loading ? (
          <p className="text-md text-gray-700 mt-2">Verificando pago...</p>
        ) : (
          <p className="text-md text-gray-700 mt-2">{orderStatus}</p>
        )}

        {/* Si no está procesado aún, mostrar el botón de reembolso */}
        
          <div className="mt-6 space-y-4">
            <button
              onClick={handleRefundSuccess}
              className="w-full px-6 py-3 text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              Solicitar Reembolso Total
            </button>

            <button
              onClick={() => navigate(`/partial-refund?session_id=${sessionId}`)}
              className="w-full px-6 py-3 text-white bg-yellow-600 rounded-lg hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-yellow-400"
            >
              Solicitar Reembolso Parcial
            </button>
          </div>
        

        {/* Volver al Home */}
        <div className="mt-6">
          <Link
            to="/"
            className="w-full px-6 py-3 text-white bg-green-600 rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-400"
          >
            Volver a la tienda
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Success;
