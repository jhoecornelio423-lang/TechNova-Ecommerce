-- Script para añadir costo de envío a las órdenes
-- Asegúrate de estar en la base de datos TiendaRopaDB

ALTER TABLE Ordenes
ADD COLUMN IF NOT EXISTS costo_envio DECIMAL(10, 2) DEFAULT 0.00;

-- Actualizar total de órdenes existentes si fuera necesario
-- UPDATE Ordenes SET total = total + costo_envio;
