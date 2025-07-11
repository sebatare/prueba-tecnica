# Prueba Técnica - Aplicación de Comercio Electrónico

Este es un sistema de comercio electrónico que permite a los usuarios ver productos, agregarlos al carrito, realizar pagos a través de Stripe y gestionar órdenes de compra, incluyendo solicitudes de reembolsos totales o parciales.

## Descripción del Sistema

El objetivo de este proyecto es desarrollar una aplicación de comercio electrónico simple. El sistema incluye las siguientes funcionalidades clave:

- **Visualización de productos**: Los usuarios pueden ver una lista de productos disponibles.
- **Carrito de compras**: Los usuarios pueden agregar productos a su carrito.
- **Pagos**: Los usuarios pueden realizar pagos a través de Stripe.
- **Órdenes de compra**: Los usuarios pueden visualizar sus órdenes y solicitar reembolsos totales o parciales.

## Requisitos del Proyecto

### 1. Backend

El backend se desarrolla utilizando **Express.js** y **PostgreSQL** como base de datos.

#### Funcionalidades requeridas:

- **Mostrar lista de productos**: Un endpoint que devuelva una lista de productos disponibles.
- **Carrito de compras**: Permitir agregar productos al carrito.
- **Pago con Stripe**: Implementar la integración con Stripe para procesar pagos.
- **Reembolso y Reembolso Parcial**: Una vez realizada la compra, el usuario tiene la opción de elegir que tipo de reembolso quiere.

### 2. Frontend

El frontend está desarrollado con **React** y tiene las siguientes funcionalidades:

- **Ver productos**: Mostrar los productos disponibles cargados desde el backend.
- **Agregar al carrito**: Permitir a los usuarios agregar productos al carrito.
- **Realizar pago**: Permitir a los usuarios realizar pagos utilizando Stripe.
- **Visualización de órdenes**: Permitir ver las órdenes de compra con los detalles de los productos.
- **Reembolsos**: Los usuarios pueden solicitar un reembolso parcial o total de sus órdenes.

## Endpoints principales

### 1. `/api/products`
- **GET**: Obtiene la lista de productos disponibles.

### 2. `/api/orders/create-order`
- **POST**: Creacion de la orden de compra con Stripe.
  - **Cuerpo de la solicitud**: 
    ```json
    {
    "products": [
        { "id": 4, "quantity": 2, "price": 80 },
        { "id": 3, "quantity": 1, "price": 25 }
    ]
    }

    ```

### 3. `/api/orders/create-checkout-session`
- **POST**: Realizar pago utilizando Stripe.


### 4. `/api/orders`
- **GET**: Obtiene la lista de órdenes de compra del usuario.
  
### 5. `/api/orders/refund-order`
- **POST**: Solicitar un reembolso total.
  - **Cuerpo de la solicitud**: 
    ```json
    {
      "session:id":"xxxx"
    }
    ```
### 6. `/api/orders/partial-refund`
- **POST**: Solicitar un reembolso parcial.
  - **Cuerpo de la solicitud**: 
    ```json
    {
    "session_id":"cs_test_b1BfVmRiSBKfxssxQqADVAFcg8SoToELCUNU8TLuAeIDaBTimqVWnEPvhS",
    "product_ids":[1,2],
    "subtotal":"25.00"
    }
    ```

## Instalación

### Prerequisitos

- Node.js
- PostgreSQL
- Stripe (para la integración de pagos)

### 1. Clonar el repositorio

Primero, clona el repositorio desde GitHub:

```cmd
git clone https://github.com/sebatare/prueba-tecnica.git
cd prueba-tecnica
cd backend && npm install
cd ..
cd frontend && npm install && npx run dev
