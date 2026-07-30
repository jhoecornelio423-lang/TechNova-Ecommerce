-- Script para habilitar Ventas y Pedidos en PostgreSQL
-- Asegúrate de estar en la base de datos TiendaRopaDB

-- 1. Tabla de Órdenes (Cabecera)
CREATE TABLE Ordenes (
    id SERIAL PRIMARY KEY,
    usuario_id INT NOT NULL,
    fecha_pedido TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    total DECIMAL(10, 2) NOT NULL,
    estado VARCHAR(20) DEFAULT 'PENDIENTE', -- PENDIENTE, ENVIADO, ENTREGADO, CANCELADO
    direccion_envio TEXT,
    FOREIGN KEY (usuario_id) REFERENCES Usuarios(id)
);

-- 2. Tabla de Detalles de Orden (Cuerpo)
CREATE TABLE Orden_Detalles (
    id SERIAL PRIMARY KEY,
    orden_id INT NOT NULL,
    producto_id INT NOT NULL,
    cantidad INT NOT NULL,
    precio_unitario DECIMAL(10, 2) NOT NULL, -- Guardamos el precio del momento de la compra
    FOREIGN KEY (orden_id) REFERENCES Ordenes(id),
    FOREIGN KEY (producto_id) REFERENCES Productos(id)
);

-- Datos de prueba para ver el Dashboard con vida
INSERT INTO Ordenes (usuario_id, total, estado, direccion_envio) VALUES
(1, 150.00, 'ENTREGADO', 'Calle Lima 123, Miraflores'),
(1, 89.90, 'PENDIENTE', 'Av. Larco 456, Trujillo');

INSERT INTO Orden_Detalles (orden_id, producto_id, cantidad, precio_unitario) VALUES
(1, 1, 2, 19.99),
(1, 4, 1, 89.99),
(2, 6, 1, 39.90);
