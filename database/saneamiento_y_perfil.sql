-- 1. Ampliar tabla de Usuarios para guardar datos de envío
ALTER TABLE Usuarios
ADD COLUMN IF NOT EXISTS dni VARCHAR(20),
ADD COLUMN IF NOT EXISTS direccion TEXT;

-- 2. Limpieza de Catálogo: Quitar sufijos como "v1", "#1", "Mod. 1" de los nombres
-- Buscamos patrones comunes de los seeders anteriores
UPDATE Productos SET nombre = REGEXP_REPLACE(nombre, ' v\d+$', '');
UPDATE Productos SET nombre = REGEXP_REPLACE(nombre, ' #\d+$', '');
UPDATE Productos SET nombre = REGEXP_REPLACE(nombre, ' Mod\. \d+$', '');

-- Eliminar posibles espacios en blanco sobrantes tras la limpieza
UPDATE Productos SET nombre = TRIM(nombre);
