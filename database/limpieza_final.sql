-- Limpieza definitiva de nombres de productos
-- Quita cualquier sufijo de versión o modelo que hayamos puesto antes

UPDATE Productos SET nombre = split_part(nombre, ' #', 1) WHERE nombre LIKE '% #%';
UPDATE Productos SET nombre = split_part(nombre, ' v', 1) WHERE nombre LIKE '% v%';
UPDATE Productos SET nombre = split_part(nombre, ' Mod.', 1) WHERE nombre LIKE '% Mod.%';

-- Eliminar espacios en blanco sobrantes
UPDATE Productos SET nombre = TRIM(nombre);
