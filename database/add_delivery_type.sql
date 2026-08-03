-- Script para añadir tipo de entrega a las órdenes
-- Asegúrate de estar en la base de datos TiendaRopaDB

ALTER TABLE Ordenes
ADD COLUMN IF NOT EXISTS tipo_entrega VARCHAR(20) DEFAULT 'DELIVERY';

-- Actualizar registros existentes
-- UPDATE Ordenes SET tipo_entrega = 'DELIVERY' WHERE tipo_entrega IS NULL;
