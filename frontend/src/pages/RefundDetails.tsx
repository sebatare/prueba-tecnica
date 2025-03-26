import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

interface RefundDetails {
  id: string;
  amount: number;
  status: string;
  created: number;
  currency: string;
  charge: string;
}

const RefundDetails = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [refundDetails, setRefundDetails] = useState<RefundDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const searchParams = new URLSearchParams(location.search);
  const sessionId = searchParams.get('session_id');

  useEffect(() => {
    if (!sessionId) {
      setError("No se proporcionó el ID de sesión.");
      setLoading(false);
      return;
    }

    // Hacer la solicitud POST al backend para obtener los detalles del reembolso
    fetch('http://localhost:3000/api/orders/refund-details', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ session_id: sessionId }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.refund) {
          setRefundDetails(data.refund);
        } else {
          setError('No se encontraron detalles del reembolso.');
        }
        setLoading(false);
      })
      .catch(() => {
        setError('Error al obtener los detalles del reembolso.');
        setLoading(false);
      });
  }, [sessionId]);

  if (loading) {
    return <div className="text-center text-lg">Cargando...</div>;
  }

  if (error) {
    return <div className="text-center text-lg text-red-500">{error}</div>;
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-3xl">
        <h2 className="text-2xl font-semibold text-center mb-6 text-gray-800">Detalles del Reembolso</h2>
        {refundDetails && (
          <>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="font-semibold text-gray-700">ID del Reembolso:</span>
                <span className="text-gray-600">{refundDetails.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold text-gray-700">Cantidad:</span>
                <span className="text-gray-600">
                  {refundDetails.amount / 100} {refundDetails.currency.toUpperCase()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold text-gray-700">Estado:</span>
                <span className="text-gray-600">{refundDetails.status}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold text-gray-700">Fecha de Creación:</span>
                <span className="text-gray-600">
                  {new Date(refundDetails.created * 1000).toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold text-gray-700">Cargo Relacionado:</span>
                <span className="text-gray-600">{refundDetails.charge}</span>
              </div>
            </div>
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <p className="text-gray-600">
                <strong>Resumen:</strong> El reembolso fue procesado exitosamente y el monto de{' '}
                {refundDetails.amount / 100} {refundDetails.currency.toUpperCase()} ha sido devuelto.
              </p>
            </div>
          </>
        )}
        {/* Botón para regresar al Home */}
        <div className="mt-6 flex justify-center">
          <button
            onClick={() => navigate('/')}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            Regresar al Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default RefundDetails;
