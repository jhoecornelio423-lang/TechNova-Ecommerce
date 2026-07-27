-- Script de creación de base de datos inicial para SQL Server
-- Temática: Tienda de Ropa

-- 1. Crear tablas de Seguridad
CREATE TABLE Roles (
    id INT PRIMARY KEY IDENTITY(1,1),
    nombre VARCHAR(20) NOT NULL UNIQUE -- Ejemplo: 'ROLE_USER', 'ROLE_ADMIN'
);

CREATE TABLE Usuarios (
    id INT PRIMARY KEY IDENTITY(1,1),
    nombre_usuario VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    nombre_completo VARCHAR(100),
    fecha_creacion DATETIME DEFAULT GETDATE()
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
    id INT PRIMARY KEY IDENTITY(1,1),
    nombre VARCHAR(50) NOT NULL UNIQUE,
    descripcion VARCHAR(255)
);

CREATE TABLE Productos (
    id INT PRIMARY KEY IDENTITY(1,1),
    nombre VARCHAR(100) NOT NULL,
    descripcion TEXT,
    precio DECIMAL(10, 2) NOT NULL,
    stock INT NOT NULL DEFAULT 0,
    imagen_url VARCHAR(255),
    categoria_id INT,
    talla VARCHAR(10), -- XS, S, M, L, XL
    color VARCHAR(30),
    fecha_creacion DATETIME DEFAULT GETDATE(),
    FOREIGN KEY (categoria_id) REFERENCES Categorias(id)
);

-- Insertar datos iniciales de prueba
INSERT INTO Roles (nombre) VALUES ('ROLE_ADMIN'), ('ROLE_USER');
INSERT INTO Categorias (nombre, descripcion) VALUES
('Hombre', 'Ropa para caballeros'),
('Mujer', 'Ropa para damas'),
('Accesorios', 'Complementos y más');
