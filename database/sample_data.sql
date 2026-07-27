-- Script para insertar datos de prueba (Ropa)
-- Asegúrate de estar usando la base de datos correcta: USE TiendaRopaDB;

-- 1. Asegurar que existan categorías (por si no se insertaron antes)
IF NOT EXISTS (SELECT 1 FROM Categorias WHERE nombre = 'Hombre')
    INSERT INTO Categorias (nombre, descripcion) VALUES ('Hombre', 'Ropa y calzado para caballeros');
IF NOT EXISTS (SELECT 1 FROM Categorias WHERE nombre = 'Mujer')
    INSERT INTO Categorias (nombre, descripcion) VALUES ('Mujer', 'Moda y tendencia para damas');
IF NOT EXISTS (SELECT 1 FROM Categorias WHERE nombre = 'Niños')
    INSERT INTO Categorias (nombre, descripcion) VALUES ('Niños', 'Ropa cómoda para los más pequeños');

-- 2. Insertar Productos de Prueba
DECLARE @IdHombre INT = (SELECT id FROM Categorias WHERE nombre = 'Hombre');
DECLARE @IdMujer INT = (SELECT id FROM Categorias WHERE nombre = 'Mujer');

INSERT INTO Productos (nombre, descripcion, precio, stock, imagen_url, categoria_id, talla, color) VALUES
('Camiseta Básica Blanca', 'Camiseta de algodón 100% premium, ideal para uso diario.', 19.99, 50, 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=800', @IdHombre, 'M', 'Blanco'),
('Jean Slim Fit Azul', 'Pantalón vaquero de corte ajustado y tela elástica.', 45.50, 30, 'https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&w=800', @IdHombre, '32', 'Azul Índigo'),
('Vestido Floral Verano', 'Vestido ligero con estampado de flores, perfecto para clima cálido.', 35.00, 20, 'https://images.unsplash.com/photo-1572804013307-5977a1391507?auto=format&fit=crop&w=800', @IdMujer, 'S', 'Multicolor'),
('Chaqueta de Cuero Negra', 'Chaqueta sintética de alta calidad con cierre de cremallera.', 89.99, 15, 'https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=800', @IdHombre, 'L', 'Negro'),
('Blusa de Seda Roja', 'Elegante blusa de seda ideal para eventos formales.', 28.00, 25, 'https://images.unsplash.com/photo-1485462537746-965f33f7f6a7?auto=format&fit=crop&w=800', @IdMujer, 'M', 'Rojo'),
('Sudadera Hoodie Gris', 'Sudadera con capucha y bolsillo tipo canguro.', 39.90, 40, 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&w=800', @IdHombre, 'XL', 'Gris');

PRINT 'Datos de prueba insertados correctamente.';
