TRUNCATE TABLE orden_detalles, ordenes, productos RESTART IDENTITY CASCADE;

INSERT INTO Productos (nombre, descripcion, precio, stock, imagen_url, categoria_id, talla, color) VALUES ('Polo Slim Fit Blanco', 'Camiseta de algodon organico premium.', 45, 50, '/api/products/images/440b6a01-86de-41d3-b69b-486b3df77aa4_img.jpg', 1, 'M', 'Blanco');
INSERT INTO Productos (nombre, descripcion, precio, stock, imagen_url, categoria_id, talla, color) VALUES ('Jean Skinny Azul', 'Jean denim con acabado gastado moderno.', 89, 30, '/api/products/images/cc8fc8c2-8706-4fe9-b40c-7856fa1d8c57_img.jpg', 1, '32', 'Azul');
INSERT INTO Productos (nombre, descripcion, precio, stock, imagen_url, categoria_id, talla, color) VALUES ('Casaca Cuero Black', 'Chaqueta de cuero sintetico con forro termico.', 189, 15, '/api/products/images/7d7ca6ad-69f0-4cff-a4bc-b62b129060cc_img.jpg', 1, 'L', 'Negro');
INSERT INTO Productos (nombre, descripcion, precio, stock, imagen_url, categoria_id, talla, color) VALUES ('Blusa Seda Roja', 'Diseno elegante con caida premium.', 65, 25, '/api/products/images/a90f0b51-9269-47ca-a1a7-a8b7bdd76dd1_img.jpg', 2, 'M', 'Rojo');

