-- Script para simular ofertas reales y estilo retail
-- Ejecutar en TiendaRopaDB (pgAdmin 4)

-- 1. Poner precios anteriores aleatorios (descuentos entre 10% y 50%)
UPDATE Productos
SET precio_anterior = precio * (1 + (random() * 0.4 + 0.1))
WHERE id % 3 = 0; -- Aplica al 33% del catálogo

-- 2. Asegurar que los precios anteriores sean enteros (limpieza TechNova)
UPDATE Productos
SET precio_anterior = ROUND(precio_anterior)
WHERE precio_anterior IS NOT NULL;

-- 3. Ver resultados
SELECT id, nombre, precio, precio_anterior FROM Productos WHERE precio_anterior IS NOT NULL LIMIT 10;
