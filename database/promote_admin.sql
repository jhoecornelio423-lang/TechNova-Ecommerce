-- Script para convertir un usuario existente en ADMINISTRADOR
-- Reemplaza 'tu_usuario' por el nombre de usuario que registraste en la web.

INSERT INTO Usuario_Roles (usuario_id, rol_id)
SELECT u.id, r.id
FROM Usuarios u, Roles r
WHERE u.nombre_usuario = 'tu_usuario'
AND r.nombre = 'ROLE_ADMIN'
AND NOT EXISTS (
    SELECT 1 FROM Usuario_Roles ur
    WHERE ur.usuario_id = u.id AND ur.rol_id = r.id
);

PRINT 'Usuario promovido a ADMIN con éxito.';
