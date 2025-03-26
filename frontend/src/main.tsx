import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";  // Asegúrate de que esta ruta sea correcta
import "./index.css";  // Si tienes estilos globales o Tailwind, importa aquí

// Encuentra el contenedor en el HTML con el id 'root'
const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement);

// Renderiza el componente principal 'App' dentro de 'root'
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
