-- Script de Unificación de Precios (TechNova Zero Cents)
-- Redondea todos los precios de productos y órdenes al entero más cercano

-- 1. Redondear precios de productos
UPDATE Productos SET precio = ROUND(precio);

-- 2. Redondear precios unitarios en los detalles de compra
UPDATE Orden_Detalles SET precio_unitario = ROUND(precio_unitario);

-- 3. Redondear totales y costos de envío en las órdenes
UPDATE Ordenes SET
    total = ROUND(total),
    costo_envio = ROUND(costo_envio);
