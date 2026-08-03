-- Script para añadir campos realistas a la tabla de Órdenes
-- Asegúrate de estar en la base de datos TiendaRopaDB

ALTER TABLE Ordenes
ADD COLUMN dni VARCHAR(20),
ADD COLUMN nombre_cliente VARCHAR(100),
ADD COLUMN email_cliente VARCHAR(100);

-- Actualizar registros existentes con datos por defecto si fuera necesario
-- UPDATE Ordenes SET dni = '00000000', nombre_cliente = 'Cliente Antiguo', email_cliente = 'admin@technova.com' WHERE dni IS NULL;
