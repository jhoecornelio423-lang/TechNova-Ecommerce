-- Script de creación de base de datos para PostgreSQL
-- Temática: Tienda de Ropa

-- 1. Crear tablas de Seguridad
CREATE TABLE Roles (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(20) NOT NULL UNIQUE
);

CREATE TABLE Usuarios (
    id SERIAL PRIMARY KEY,
    nombre_usuario VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    nombre_completo VARCHAR(100),
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE Usuario_Roles (
    usuario_id INT NOT NULL,
    rol_id INT NOT NULL,
    PRIMARY KEY (usuario_id, rol_id),
    FOREIGN KEY (usuario_id) REFERENCES Usuarios(id),
    FOREIGN KEY (rol_id) REFERENCES Roles(id)
);

-- 2. Crear tablas de Catálogo (Ropa)
CREATE TABLE Categorias (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL UNIQUE,
    descripcion VARCHAR(255)
);

CREATE TABLE Productos (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    descripcion TEXT,
    precio DECIMAL(10, 2) NOT NULL,
    stock INT NOT NULL DEFAULT 0,
    imagen_url VARCHAR(255),
    categoria_id INT,
    talla VARCHAR(10),
    color VARCHAR(30),
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (categoria_id) REFERENCES Categorias(id)
);

-- Insertar datos iniciales
INSERT INTO Roles (nombre) VALUES ('ROLE_ADMIN'), ('ROLE_USER');
INSERT INTO Categorias (nombre, descripcion) VALUES
('Hombre', 'Ropa para caballeros'),
('Mujer', 'Ropa para damas'),
('Niños', 'Ropa para los más pequeños'),
('Accesorios', 'Complementos y más');

-- Datos de prueba
INSERT INTO Productos (nombre, descripcion, precio, stock, imagen_url, categoria_id, talla, color) VALUES
('Camiseta Básica Blanca', 'Camiseta de algodón 100% premium.', 19.99, 50, 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=800', 1, 'M', 'Blanco'),
('Jean Slim Fit Azul', 'Pantalón vaquero de corte ajustado.', 45.50, 30, 'https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&w=800', 1, '32', 'Azul'),
('Vestido Floral Verano', 'Vestido ligero con estampado de flores.', 35.00, 20, 'https://images.unsplash.com/photo-1572804013307-5977a1391507?auto=format&fit=crop&w=800', 2, 'S', 'Multicolor'),
('Chaqueta de Cuero Negra', 'Chaqueta sintética de alta calidad.', 89.99, 15, 'https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=800', 1, 'L', 'Negro'),
('Blusa de Seda Roja', 'Elegante blusa de seda.', 28.00, 25, 'https://images.unsplash.com/photo-1485462537746-965f33f7f6a7?auto=format&fit=crop&w=800', 2, 'M', 'Rojo');
