import { Link } from 'react-router-dom';

const Cancel = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-red-100">
      <div className="bg-white p-8 rounded-lg shadow-lg text-center">
        <h2 className="text-2xl font-bold text-red-700">Pago cancelado ❌</h2>
        <p className="text-gray-700 mt-2">Tu compra no se ha completado.</p>
        
        <Link to="/" className="mt-4 inline-block px-6 py-2 text-white bg-red-600 rounded hover:bg-red-700">
          Volver a la tienda
        </Link>
      </div>
    </div>
  );
};

export default Cancel;
