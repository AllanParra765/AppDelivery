-- Eliminar la tabla si ya existe
DROP DATABASE IF EXISTS Catalogo_Digital;
CREATE DATABASE Catalogo_Digital;
use Catalogo_Digital;


/*CREATE TABLE `_categorias_2025-08-30-10-07-31` ( 
  `id_categoria` INT NOT NULL,
  `fecha_creacion` TIMESTAMP NOT NULL DEFAULT 'current_timestamp()' ,
  `dias_semana` VARCHAR(255) NULL DEFAULT NULL ,
  `categoria` VARCHAR(255) NOT NULL,
  `estado` ENUM('activo','inactivo') NULL DEFAULT '\'activo'' ,
  `eliminar` TINYINT NULL DEFAULT 0 ,
   PRIMARY KEY (`id_categoria`)
)
ENGINE = InnoDB;
INSERT INTO `_categorias_2025-08-30-10-07-31`
(`id_categoria`, `fecha_creacion`, `dias_semana`, `categoria`, `estado`, `eliminar`) 
SELECT `id_categoria`, `fecha_creacion`, `dias_semana`, `categoria`, `estado`, `eliminar` from `categorias`;
*/
-- Eliminar la tabla si ya existe
-- DROP TABLE IF EXISTS Catalogo_Digital.`categorias`; 
CREATE TABLE Catalogo_Digital.`categorias` ( 
  `id_categoria` INT NOT NULL AUTO_INCREMENT,
  `fecha_creacion` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `dias_semana` VARCHAR(255) DEFAULT NULL,
  `categoria` VARCHAR(255) NOT NULL,
  `estado` ENUM('activo','inactivo') NOT NULL DEFAULT 'activo',
  `eliminar` TINYINT(1) NOT NULL DEFAULT 0,
  PRIMARY KEY (`id_categoria`)
) ENGINE=InnoDB;

INSERT INTO Catalogo_Digital.`categorias`
(`categoria`, `dias_semana`, `estado`, `eliminar`)
VALUES
('Desayunos', 'Lunes a Domingo', 'activo', 0),
('Comidas', 'Lunes a Domingo', 'activo', 0),
('Bebidas', 'Lunes a Domingo', 'activo', 0),
('Postres', 'Lunes a Domingo', 'activo', 0),
('Promociones', 'Lunes a Domingo', 'activo', 0);



CREATE TABLE Catalogo_Digital.`promociones` ( 
  `id_promocion` INT NOT NULL AUTO_INCREMENT,
  `nombre` VARCHAR(255) NOT NULL,
  `descripcion` TEXT DEFAULT NULL,
  `precio` DECIMAL(10,2) NOT NULL,
  `imagen` VARCHAR(255) DEFAULT NULL,
  `validez` VARCHAR(255) DEFAULT NULL,
  `fecha_inicio` DATE NOT NULL,
  `fecha_fin` DATE NOT NULL,
  `estado` ENUM('activo','inactivo') NOT NULL DEFAULT 'activo',
  `eliminar` TINYINT(1) NOT NULL DEFAULT 0,
  PRIMARY KEY (`id_promocion`)
) ENGINE=InnoDB;


INSERT INTO Catalogo_Digital.`promociones`
(`nombre`, `descripcion`, `precio`, `imagen`, `validez`, `fecha_inicio`, `fecha_fin`, `estado`, `eliminar`)
VALUES
('Combo Desayuno', 'Omelette de queso + Limonada', 100.00, 'combo_desayuno.jpg', 'Solo mañanas', '2025-09-01', '2025-09-30', 'activo', 0),
('Promo Hamburguesa', 'Hamburguesa Clásica + Papas + Bebida', 150.00, 'promo_hamburguesa.jpg', 'Todo el día', '2025-09-01', '2025-09-15', 'activo', 0);


/*
CREATE TABLE `_promociones_2025-08-30-10-12-33` ( 
  `id_promocion` INT NOT NULL,
  `nombre` VARCHAR(255) NOT NULL,
  `descripcion` TEXT NULL DEFAULT NULL ,
  `precio` DECIMAL(10,2) NOT NULL,
  `imagen` VARCHAR(255) NULL DEFAULT NULL ,
  `validez` TEXT NULL DEFAULT NULL ,
  `fecha_inicio` DATE NOT NULL,
  `fecha_fin` DATE NOT NULL,
  `eliminar` TINYINT NULL DEFAULT 0 ,
  `estado` ENUM('activo','inactivo') NULL DEFAULT '\'activo'' ,
   PRIMARY KEY (`id_promocion`)
)
ENGINE = InnoDB;
INSERT INTO `_promociones_2025-08-30-10-12-33`(`id_promocion`, `nombre`, `descripcion`, `precio`, `imagen`, `validez`, `fecha_inicio`, `fecha_fin`, `eliminar`, `estado`) SELECT `id_promocion`, `nombre`, `descripcion`, `precio`, `imagen`, `validez`, `fecha_inicio`, `fecha_fin`, `eliminar`, `estado` from `promociones`;
*/

CREATE TABLE Catalogo_Digital.`pedidos` ( 
  `id_pedido` INT NOT NULL AUTO_INCREMENT,
  `nombre` VARCHAR(255) NOT NULL,
  `telefono` VARCHAR(15) DEFAULT NULL,
  `pedido` TEXT DEFAULT NULL,
  `fecha` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `estado` ENUM('proceso','listo','cancelado') NOT NULL DEFAULT 'proceso',
  `total` DECIMAL(10,2) NOT NULL,
  `eliminar` TINYINT(1) NOT NULL DEFAULT 0,
  PRIMARY KEY (`id_pedido`)
) ENGINE=InnoDB;


INSERT INTO Catalogo_Digital.`pedidos`
(`nombre`, `telefono`, `pedido`, `fecha`, `estado`, `total`, `eliminar`)
VALUES
('Juan Pérez', '9991234567', 'Omelette de Queso, Limonada Natural', '2025-08-30 09:15:00', 'proceso', 115.00, 0),
('María López', '9999876543', 'Hamburguesa Clásica, Pastel de Chocolate', '2025-08-30 13:30:00', 'listo', 180.00, 0);


/*
CREATE TABLE `_pedidos_2025-08-30-10-12-57` ( 
  `id_pedido` INT NOT NULL,
  `nombre` VARCHAR(255) NOT NULL,
  `telefono` VARCHAR(15) NULL DEFAULT NULL ,
  `pedido` TEXT NULL DEFAULT NULL ,
  `fecha` TIMESTAMP NOT NULL DEFAULT 'current_timestamp()' ,
  `estado` ENUM('proceso','listo','cancelado') NULL DEFAULT '\'proceso'' ,
  `total` DECIMAL(10,2) NOT NULL,
  `eliminar` TINYINT NULL DEFAULT 0 ,
   PRIMARY KEY (`id_pedido`)
)
ENGINE = InnoDB;
INSERT INTO `_pedidos_2025-08-30-10-12-57`(`id_pedido`, `nombre`, `telefono`, `pedido`, `fecha`, `estado`, `total`, `eliminar`) SELECT `id_pedido`, `nombre`, `telefono`, `pedido`, `fecha`, `estado`, `total`, `eliminar` from `pedidos`;
*/


CREATE TABLE Catalogo_Digital.`platillos` ( 
  `id_platillo` INT NOT NULL AUTO_INCREMENT,
  `nombre` VARCHAR(255) NOT NULL,
  `descripcion` TEXT DEFAULT NULL,
  `precio` DECIMAL(10,2) NOT NULL,
  `imagen` VARCHAR(255) DEFAULT NULL,
  `categoria_id` INT DEFAULT NULL,
  `estado` ENUM('activo','inactivo') NOT NULL DEFAULT 'activo',
  `ingredientes` TEXT DEFAULT NULL,
  `eliminar` TINYINT(1) NOT NULL DEFAULT 0,
  PRIMARY KEY (`id_platillo`),
  FOREIGN KEY (`categoria_id`) REFERENCES `categorias`(`id_categoria`) ON DELETE SET NULL
) ENGINE=InnoDB;

INSERT INTO Catalogo_Digital.`platillos`
(`nombre`, `descripcion`, `precio`, `imagen`, `categoria_id`, `estado`, `ingredientes`, `eliminar`)
VALUES
('Omelette de Queso', 'Omelette esponjoso con queso y hierbas', 75.00, 'omelette.jpg', 1, 'activo', 'Huevos, queso, cebolla, pimiento, sal, pimienta', 0),
('Hamburguesa Clásica', 'Hamburguesa con carne de res, queso, lechuga y tomate', 120.00, 'hamburguesa.jpg', 2, 'activo', 'Carne de res, pan, queso, lechuga, tomate, mayonesa', 0),
('Limonada Natural', 'Limonada refrescante con hierbabuena', 40.00, 'limonada.jpg', 3, 'activo', 'Limón, agua, azúcar, hierbabuena', 0),
('Pastel de Chocolate', 'Porción de pastel de chocolate con crema', 60.00, 'pastel_chocolate.jpg', 4, 'activo', 'Harina, cacao, huevo, leche, mantequilla, azúcar', 0);



/*
CREATE TABLE `_platillos_2025-08-30-10-12-06` ( 
  `id_platillo` INT NOT NULL,
  `nombre` VARCHAR(255) NOT NULL,
  `descripcion` TEXT NULL DEFAULT NULL ,
  `precio` DECIMAL(10,2) NOT NULL,
  `imagen` VARCHAR(255) NULL DEFAULT NULL ,
  `categoria_id` INT NULL DEFAULT NULL ,
  `estado` ENUM('activo','inactivo') NULL DEFAULT '\'activo'' ,
  `ingredientes` TEXT NULL DEFAULT NULL ,
  `eliminar` TINYINT NULL DEFAULT 0 ,
   PRIMARY KEY (`id_platillo`)
)
ENGINE = InnoDB;
INSERT INTO `_platillos_2025-08-30-10-12-06`(`id_platillo`, `nombre`, `descripcion`, `precio`, `imagen`, `categoria_id`, `estado`, `ingredientes`, `eliminar`) SELECT `id_platillo`, `nombre`, `descripcion`, `precio`, `imagen`, `categoria_id`, `estado`, `ingredientes`, `eliminar` from `platillos`;
*/


DELIMITER //

CREATE PROCEDURE Catalogo_Digital.`CRUD_Restaurante`(IN straccion VARCHAR(50), IN params LONGTEXT)
BEGIN

    -- Declaración de variables para las categorías
    DECLARE var_id_categoria INT;
    DECLARE var_dias_semana VARCHAR(255);
    DECLARE var_categoria VARCHAR(255);
    DECLARE var_estado_categoria ENUM('activo', 'inactivo');
    DECLARE var_eliminar_categoria BOOLEAN;

    -- Declaración de variables para los platillos
    DECLARE var_id_platillo INT;
    DECLARE var_nombre_platillo VARCHAR(255);
    DECLARE var_descripcion_platillo TEXT;
    DECLARE var_precio_platillo DECIMAL(10, 2);
    DECLARE var_imagen_platillo VARCHAR(255);
    DECLARE var_categoria_id varchar(3);
    DECLARE var_estado_platillo ENUM('activo', 'inactivo');
    DECLARE var_ingredientes_platillo TEXT;
    DECLARE var_eliminar_platillo BOOLEAN;
    DECLARE var_categoria_nombre varchar(200);

    -- Declaración de variables para las promociones 
    DECLARE var_id_promocion INT;
    DECLARE var_nombre_promocion VARCHAR(255);
    DECLARE var_descripcion_promocion TEXT;
    DECLARE var_precio_promocion DECIMAL(10, 2);
    DECLARE var_imagen_promocion VARCHAR(255);
    DECLARE var_estado_pomocion ENUM('activo', 'inactivo');
    DECLARE var_validez_promocion TEXT;
    DECLARE var_fecha_inicio_promocion DATE;
    DECLARE var_fecha_fin_promocion DATE;
    DECLARE var_eliminar_promocion BOOLEAN;

    -- Declaración de variables para los pedidos
    DECLARE var_id_pedido INT;
    DECLARE var_nombre_cliente VARCHAR(255);
    DECLARE var_telefono_cliente VARCHAR(15);
    DECLARE var_pedido TEXT;
    DECLARE var_fecha_pedido TIMESTAMP;
    DECLARE var_estado_pedido ENUM('proceso', 'listo', 'cancelado');
    DECLARE var_total_pedido DECIMAL(10, 2);
    DECLARE var_eliminar_pedido BOOLEAN;

-- -------------------- Categorías ----------------------

    IF straccion = 'insertarCategoria' THEN
        SET var_dias_semana = JSON_UNQUOTE(JSON_EXTRACT(params, '$.dias_semana'));
        SET var_categoria = JSON_UNQUOTE(JSON_EXTRACT(params, '$.categoria'));
        SET var_estado_categoria = JSON_UNQUOTE(JSON_EXTRACT(params, '$.estado'));
        INSERT INTO categorias (dias_semana, categoria, estado) 
        VALUES (var_dias_semana, var_categoria, var_estado_categoria);
        SELECT 'Categoría insertada exitosamente' AS mensaje;

    ELSEIF straccion = 'actualizarCategoria' THEN
        SET var_id_categoria = JSON_UNQUOTE(JSON_EXTRACT(params, '$.id_categoria'));
        SET var_dias_semana = JSON_UNQUOTE(JSON_EXTRACT(params, '$.dias_semana'));
        SET var_categoria = JSON_UNQUOTE(JSON_EXTRACT(params, '$.categoria'));
        SET var_estado_categoria = JSON_UNQUOTE(JSON_EXTRACT(params, '$.estado'));
       
       UPDATE Catalogo_Digital.categorias 
        SET   estado = var_estado_categoria
        WHERE id_categoria = var_id_categoria;
      /*  UPDATE categorias 
        SET dias_semana = var_dias_semana, categoria = var_categoria, estado = var_estado_categoria
        WHERE id_categoria = var_id_categoria;
        */
        SELECT 'Categoría actualizada exitosamente' AS mensaje;

    ELSEIF straccion = 'buscarCategoria' THEN
        SET var_categoria = JSON_UNQUOTE(JSON_EXTRACT(params, '$.categoria'));
        SELECT * FROM categorias WHERE categoria = var_categoria;
    
    ELSEIF straccion = 'cargarCategoria' THEN
        SET var_categoria = JSON_UNQUOTE(JSON_EXTRACT(params, '$.categoria'));
       
      -- use Catalogo_Digital;
        -- SELECT * FROM Catalogo_digital.categorias where eliminar = 0 and estado = "activo" and eliminar = 0 ORDER by id_categoria DESC ;
        SELECT * FROM Catalogo_digital.categorias where  eliminar = 0 ORDER by id_categoria DESC ;
   -- se Catalogo_Digital;


    ELSEIF straccion = 'eliminarCategoria' THEN
        SET var_categoria = JSON_UNQUOTE(JSON_EXTRACT(params, '$.id_categoria'));
        
        DELETE FROM Catalogo_digital.categorias WHERE id_categoria = var_categoria;
        
        
        SELECT 'Categoría eliminada exitosamente' AS mensaje;
ELSEIF straccion = 'cargarCategoriaVista' THEN

-- se Catalogo_Digital;
SELECT 
p.nombre, p.descripcion, p.precio,p.imagen, p.ingredientes, c.categoria
FROM 
    Catalogo_digital.platillos p
JOIN 
    categorias c ON p.categoria_id = c.id_categoria
    where p.eliminar = 0;

-- -------------------- Platillos ----------------------

ELSEIF straccion = 'insertarPlatillo' THEN
    -- Obtener los parámetros del JSON
    SET var_nombre_platillo = JSON_UNQUOTE(JSON_EXTRACT(params, '$.nombre'));
    SET var_descripcion_platillo = JSON_UNQUOTE(JSON_EXTRACT(params, '$.descripcion'));
    SET var_precio_platillo = JSON_UNQUOTE(JSON_EXTRACT(params, '$.precio'));
    SET var_imagen_platillo = JSON_UNQUOTE(JSON_EXTRACT(params, '$.imagen'));
    SET var_categoria_nombre = JSON_UNQUOTE(JSON_EXTRACT(params, '$.categoria'));
    SET var_estado_platillo = JSON_UNQUOTE(JSON_EXTRACT(params, '$.estado'));
    SET var_ingredientes_platillo = JSON_UNQUOTE(JSON_EXTRACT(params, '$.ingredientes'));



SET var_categoria_id = (select id_categoria from Catalogo_Digital.categorias where categoria = var_categoria_nombre
and estado = "activo" and eliminar = 0 limit 1);

select * from Catalogo_digital.platillos;

    -- Insertar los datos en la tabla platillos
    INSERT INTO Catalogo_digital.platillos 
    (nombre, descripcion, precio, imagen, categoria_id, estado, ingredientes, eliminar)
    VALUES 
    (var_nombre_platillo, var_descripcion_platillo, var_precio_platillo, var_imagen_platillo, var_categoria_id, "activo", var_ingredientes_platillo, 0);

    -- Mensaje de éxito
    SELECT 'Platillo insertado exitosamente' AS mensaje;

ELSEIF straccion = 'actualizarPlatillo' THEN
    -- Obtener parámetros de entrada JSON
    SET var_id_platillo = JSON_UNQUOTE(JSON_EXTRACT(params, '$.id_platillo'));
    SET var_nombre_platillo = JSON_UNQUOTE(JSON_EXTRACT(params, '$.nombre'));
    SET var_descripcion_platillo = JSON_UNQUOTE(JSON_EXTRACT(params, '$.descripcion'));
    SET var_precio_platillo = JSON_UNQUOTE(JSON_EXTRACT(params, '$.precio'));
    SET var_imagen_platillo = JSON_UNQUOTE(JSON_EXTRACT(params, '$.imagen'));
    SET var_categoria_nombre  = JSON_UNQUOTE(JSON_EXTRACT(params, '$.categoria'));
    -- SET var_estado_platillo = JSON_UNQUOTE(JSON_EXTRACT(params, '$.estado'));
    SET var_ingredientes_platillo = JSON_UNQUOTE(JSON_EXTRACT(params, '$.ingredientes'));


-- Si necesitas el nombre de la categoría (opcional) 
-- SET var_categoria_nombre = (SELECT nombre FROM Catalogo_Digital.categorias WHERE categoria_id = var_categoria_id);
-- select * from Catalogo_Digital.categorias where categoria = "Entradas" and estado = "activo" and eliminar = 0;

SET var_categoria_id = (select id_categoria from Catalogo_Digital.categorias where categoria = var_categoria_nombre and estado = "activo" and eliminar = 0 limit 1 );

-- select * from Catalogo_digital.platillos;
-- select * from Catalogo_Digital.categorias where categoria = "Postres" and estado = "activo" and eliminar = 0

    -- Actualizar la tabla platillos con los nuevos valores
    UPDATE Catalogo_digital.platillos
    SET nombre = var_nombre_platillo,
        descripcion = var_descripcion_platillo,
        precio = var_precio_platillo,
        imagen = var_imagen_platillo,
        categoria_id = var_categoria_id,  -- Usamos el ID de la categoría
       -- estado = var_estado_platillo,
        ingredientes = var_ingredientes_platillo
    WHERE id_platillo = var_id_platillo;

    -- Mensaje de éxito
    SELECT 'Platillo actualizado exitosamente' AS mensaje;


    ELSEIF straccion = 'buscarPlatillo' THEN
        SET var_nombre_platillo = JSON_UNQUOTE(JSON_EXTRACT(params, '$.nombre'));
        SELECT * FROM platillos WHERE nombre = var_nombre_platillo;
    
        ELSEIF straccion = 'cargarPlatillos' THEN
        SET var_nombre_platillo = JSON_UNQUOTE(JSON_EXTRACT(params, '$.nombre'));
      
     --  use Catalogo_Digital;
    -- SELECT * FROM platillos where eliminar =0;
    SELECT 
p.id_platillo, p.estado, p.nombre, p.descripcion, p.precio, p.imagen, p.ingredientes, c.categoria
FROM 
    platillos p
JOIN 
    categorias c ON p.categoria_id = c.id_categoria
    where p.eliminar = 0;
    
    ELSEIF straccion = 'estadoPlatillo' THEN
        SET var_id_platillo = JSON_UNQUOTE(JSON_EXTRACT(params, '$.id_platillo'));
        SET var_estado_platillo = JSON_UNQUOTE(JSON_EXTRACT(params, '$.estado'));
        UPDATE platillos 
        SET  estado = var_estado_platillo
        WHERE id_platillo = var_id_platillo;

    ELSEIF straccion = 'eliminarPlatillo' THEN
       -- SET var_nombre_platillo = JSON_UNQUOTE(JSON_EXTRACT(params, '$.nombre'));
        -- DELETE FROM platillos WHERE nombre = var_nombre_platillo;
        SET var_id_platillo = JSON_UNQUOTE(JSON_EXTRACT(params, '$.id_platillo'));
        UPDATE platillos 
        SET  eliminar = 1
        WHERE id_platillo = var_id_platillo;
        SELECT 'Platillo eliminado exitosamente' AS mensaje;

-- -------------------- Promociones ----------------------

    ELSEIF straccion = 'insertarPromocion' THEN
        SET var_nombre_promocion = JSON_UNQUOTE(JSON_EXTRACT(params, '$.nombre'));
        SET var_descripcion_promocion = JSON_UNQUOTE(JSON_EXTRACT(params, '$.descripcion'));
        SET var_precio_promocion = JSON_UNQUOTE(JSON_EXTRACT(params, '$.precio'));
        SET var_imagen_promocion = JSON_UNQUOTE(JSON_EXTRACT(params, '$.imagen'));
        SET var_validez_promocion = JSON_UNQUOTE(JSON_EXTRACT(params, '$.validez'));
        SET var_fecha_inicio_promocion = JSON_UNQUOTE(JSON_EXTRACT(params, '$.fecha_inicio'));
        SET var_fecha_fin_promocion = JSON_UNQUOTE(JSON_EXTRACT(params, '$.fecha_fin'));
        INSERT INTO promociones (nombre, descripcion, precio, imagen, validez, fecha_inicio, fecha_fin)
        VALUES (var_nombre_promocion, var_descripcion_promocion, var_precio_promocion, var_imagen_promocion, var_validez_promocion, var_fecha_inicio_promocion, var_fecha_fin_promocion);
        SELECT 'Promoción insertada exitosamente' AS mensaje;

    ELSEIF straccion = 'actualizarPromocion' THEN
        SET var_id_promocion = JSON_UNQUOTE(JSON_EXTRACT(params, '$.id_promocion'));
        SET var_nombre_promocion = JSON_UNQUOTE(JSON_EXTRACT(params, '$.nombre'));
        SET var_descripcion_promocion = JSON_UNQUOTE(JSON_EXTRACT(params, '$.descripcion'));
        SET var_precio_promocion = JSON_UNQUOTE(JSON_EXTRACT(params, '$.precio'));
        SET var_imagen_promocion = JSON_UNQUOTE(JSON_EXTRACT(params, '$.imagen'));
        SET var_validez_promocion = JSON_UNQUOTE(JSON_EXTRACT(params, '$.validez'));
        SET var_fecha_inicio_promocion = JSON_UNQUOTE(JSON_EXTRACT(params, '$.fecha_inicio'));
        SET var_fecha_fin_promocion = JSON_UNQUOTE(JSON_EXTRACT(params, '$.fecha_fin'));
        UPDATE promociones
        SET nombre = var_nombre_promocion, descripcion = var_descripcion_promocion, 
        precio = var_precio_promocion, imagen = var_imagen_promocion, 
        validez = var_validez_promocion, fecha_inicio = var_fecha_inicio_promocion, fecha_fin = var_fecha_fin_promocion
        WHERE id_promocion = var_id_promocion;
        
        SELECT 'Promoción actualizada exitosamente' AS mensaje;

    ELSEIF straccion = 'cargarPromocion' THEN
        SET var_nombre_promocion = JSON_UNQUOTE(JSON_EXTRACT(params, '$.nombre'));
        select * from promociones where eliminar = 0;


    ELSEIF straccion = 'buscarPromocion' THEN
        SET var_nombre_promocion = JSON_UNQUOTE(JSON_EXTRACT(params, '$.nombre'));
        SELECT * FROM promociones WHERE nombre = var_nombre_promocion;
        
            ELSEIF straccion = 'estadoPromocion' THEN
        SET var_id_promocion = JSON_UNQUOTE(JSON_EXTRACT(params, '$.id_promocion'));
        SET var_estado_pomocion = JSON_UNQUOTE(JSON_EXTRACT(params, '$.estado'));
        UPDATE promociones 
        SET  estado = var_estado_pomocion
        WHERE id_promocion = var_id_promocion;


    ELSEIF straccion = 'eliminarPromocion' THEN
      --  SET var_nombre_promocion = JSON_UNQUOTE(JSON_EXTRACT(params, '$.nombre'));
      -- DELETE FROM promociones WHERE nombre = var_nombre_promocion;
        SET var_id_promocion = JSON_UNQUOTE(JSON_EXTRACT(params, '$.id_promocion'));
        UPDATE `promociones`
        SET `eliminar`='1'
        WHERE (`promociones`.`id_promocion` = var_id_promocion);

        
        SELECT 'Promoción eliminada exitosamente' AS mensaje;


select * from Catalogo_Digital.promociones;

-- -------------------- Pedidos ----------------------

   ELSEIF straccion = 'insertarPedido' THEN
    SET var_nombre_cliente = JSON_UNQUOTE(JSON_EXTRACT(params, '$.nombreCliente'));
    SET var_telefono_cliente = JSON_UNQUOTE(JSON_EXTRACT(params, '$.telefono'));
    SET var_pedido = JSON_UNQUOTE(JSON_EXTRACT(params, '$.pedido'));
    SET var_total_pedido = JSON_UNQUOTE(JSON_EXTRACT(params, '$.total'));

    -- Asignamos valores predeterminados
    SET var_estado_pedido = 'proceso';  -- Estado 'proceso' por defecto
    SET var_fecha_pedido = NOW();       -- Fecha actual
    
    -- Inserta el pedido en la base de datos
    INSERT INTO pedidos (nombre, telefono, pedido, fecha, estado, total, eliminar)
    VALUES (var_nombre_cliente, var_telefono_cliente, var_pedido, var_fecha_pedido, var_estado_pedido, var_total_pedido, 0);

    SELECT 'Pedido insertado exitosamente' AS mensaje;


    ELSEIF straccion = 'actualizarPedido' THEN
        SET var_id_pedido = JSON_UNQUOTE(JSON_EXTRACT(params, '$.id_pedido'));
        SET var_nombre_cliente = JSON_UNQUOTE(JSON_EXTRACT(params, '$.nombre'));
        SET var_telefono_cliente = JSON_UNQUOTE(JSON_EXTRACT(params, '$.telefono'));
        SET var_pedido = JSON_UNQUOTE(JSON_EXTRACT(params, '$.pedido'));
        SET var_estado_pedido = JSON_UNQUOTE(JSON_EXTRACT(params, '$.estado'));
        SET var_total_pedido = JSON_UNQUOTE(JSON_EXTRACT(params, '$.total'));
        UPDATE pedidos
        SET nombre = var_nombre_cliente, telefono = var_telefono_cliente, pedido = var_pedido, estado = var_estado_pedido, total = var_total_pedido
        WHERE id_pedido = var_id_pedido;
        SELECT 'Pedido actualizado exitosamente' AS mensaje;

    ELSEIF straccion = 'buscarPedido' THEN
        SET var_id_pedido = JSON_UNQUOTE(JSON_EXTRACT(params, '$.id_pedido'));
        SELECT * FROM pedidos WHERE id_pedido = var_id_pedido;
    
        ELSEIF straccion = 'actualizarEstatusPedido' THEN
        SET var_id_pedido = JSON_UNQUOTE(JSON_EXTRACT(params, '$.id_pedido'));
        SET var_estado_pedido = JSON_UNQUOTE(JSON_EXTRACT(params, '$.estado'));
        UPDATE Catalogo_digital.`pedidos`
        SET `estado`= var_estado_pedido-- 'listo'
        WHERE (`pedidos`.`id_pedido` = var_id_pedido);
      
        SELECT 'Estatus Pedido actualizado exitosamente' AS mensaje;

            ELSEIF straccion = 'eliminarPedido' THEN
            
        SET var_id_pedido = JSON_UNQUOTE(JSON_EXTRACT(params, '$.id_pedido'));
        UPDATE `pedidos`
        SET  `eliminar`='1'
        WHERE (`pedidos`.`id_pedido` = var_id_pedido);

        SELECT 'Promoción eliminada exitosamente' AS mensaje;

        
        ELSEIF straccion = 'cargarPedidos' THEN
        SET var_id_pedido = JSON_UNQUOTE(JSON_EXTRACT(params, '$.id_pedido'));
        select * from Catalogo_Digital.pedidos where eliminar = 0;

    ELSEIF straccion = 'eliminarPedido' THEN
        SET var_id_pedido = JSON_UNQUOTE(JSON_EXTRACT(params, '$.id_pedido'));
        DELETE FROM pedidos WHERE id_pedido = var_id_pedido;
        SELECT 'Pedido eliminado exitosamente' AS mensaje;

    END IF;

END

DELIMITER ;
