-- Script para habilitar estrategias de venta (Discounts & Coupons)
-- Asegúrate de estar en la base de datos TiendaRopaDB

-- 1. Añadir precio original para mostrar descuentos
ALTER TABLE Productos
ADD COLUMN IF NOT EXISTS precio_anterior DECIMAL(10, 2);

-- 2. Tabla de Cupones
CREATE TABLE IF NOT EXISTS Cupones (
    id SERIAL PRIMARY KEY,
    codigo VARCHAR(20) NOT NULL UNIQUE,
    descuento_porcentaje INT NOT NULL, -- Ej: 10 para 10%
    fecha_vencimiento TIMESTAMP,
    activo BOOLEAN DEFAULT TRUE
);

-- Insertar cupones de prueba
INSERT INTO Cupones (codigo, descuento_porcentaje, fecha_vencimiento) VALUES
('TECHNOVA10', 10, '2026-12-31 23:59:59'),
('BIENVENIDA', 15, '2026-12-31 23:59:59');
