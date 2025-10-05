import pool from "../config/db.js";

export const getAllProducts = async (req, res) => {
  try {
    const result = await pool.query(
      `select 
      p.id_producto, p.codigo, p.nombre, p.autor, p.descripcion, 
      p.id_categoria, c.nombre as categoria,
      p.id_proveedor, pr.nombre as proveedor, p.precio, p.stock, p.punto_reorden, 
      p.fecha_creacion, p.fecha_actualizacion
      from productos p
      left join categorias c on p.id_categoria = c.id_categoria 
      left join proveedores pr on p.id_proveedor = pr.id_proveedor
      order by id_producto`
    );
    res.json(result.rows);
  } catch (err) {
    console.error("Error al obtener productos", err);
    res.status(500).json({ error: "Error en el servidor" });
  }
};

export const addProduct = async (req, res) => {
  const {
    codigo,
    nombre,
    autor,
    descripcion,
    id_categoria,
    id_proveedor,
    precio,
    stock,
    punto_reorden,
    usuario_responsable
  } = req.body;
  try {
    const result = await pool.query(
      `insert into productos 
      (codigo, nombre, autor, descripcion, id_categoria, id_proveedor, precio, stock, punto_reorden) 
      values ($1,$2,$3,$4,$5,$6,$7,$8,$9) returning *`,
      [
        codigo,
        nombre,
        autor || null,
        descripcion,
        id_categoria || null,
        id_proveedor || null,
        precio,
        stock,
        punto_reorden || 5,
      ]
    );

    const nuevoProducto = result.rows[0];

    if (stock > 0) {
      await pool.query(
        `insert into movimientos_inventario 
          (id_producto, tipo_movimiento, cantidad, usuario_responsable, nota)
         values ($1, 'entrada', $2, $3, 'Ingreso inicial de stock')`,
        [nuevoProducto.id_producto, stock, usuario_responsable || null]
      );
    }

    const detalles = await pool.query(
      `select 
      p.id_producto, p.codigo, p.nombre, p.autor, p.descripcion, 
      p.id_categoria, c.nombre as categoria,
      p.id_proveedor, pr.nombre as proveedor, p.precio, p.stock, p.punto_reorden, 
      p.fecha_creacion, p.fecha_actualizacion
      from productos p
      left join categorias c on p.id_categoria = c.id_categoria 
      left join proveedores pr on p.id_proveedor = pr.id_proveedor
      where p.id_producto = $1`,
      [nuevoProducto.id_producto]
    );

    res.status(201).json({ message: "Producto añadido", producto: detalles.rows[0] });
  } catch (err) {
    console.error("Error al añadir producto", err);
    res.status(500).json({ error: "Error en el servidor" });
  }
};

export const updateProduct = async (req, res) => {
  const { id } = req.params;
  const {
    nombre,
    autor,
    descripcion,
    id_categoria,
    id_proveedor,
    precio,
    stock,
    punto_reorden,
    usuario_responsable
  } = req.body;
  try {
    const productoActual = await pool.query(
      "select * from productos where id_producto = $1",
      [id]
    );
    if (productoActual.rows.length === 0) {
      return res.status(404).json({ error: "Producto no encontrado" });
    }
    const stockAnterior = productoActual.rows[0].stock;
    const result = await pool.query(
      `update productos 
       set nombre = $1, 
           autor = $2, 
           descripcion = $3, 
           id_categoria = $4, 
           id_proveedor = $5, 
           precio = $6, 
           stock = $7, 
           punto_reorden = $8,
           fecha_actualizacion = NOW()
       where id_producto = $9
       returning *`,
      [
        nombre,
        autor || null,
        descripcion || null,
        id_categoria || null,
        id_proveedor || null,
        precio,
        stock,
        punto_reorden,
        id,
      ]
    );
    const nuevoProducto = result.rows[0];
    if (stock !== stockAnterior) {
      const diferencia = stock - stockAnterior;
      let tipoMovimiento = "ajuste";
      if (diferencia > 0) {
        tipoMovimiento = "entrada";
      } else if (diferencia < 0) {
        tipoMovimiento = "ajuste";
      }
      await pool.query(
        `insert into movimientos_inventario 
          (id_producto, tipo_movimiento, cantidad, usuario_responsable, nota)
         values ($1, $2, $3, $4, $5)`,
        [
          id,
          tipoMovimiento,
          Math.abs(diferencia),
          usuario_responsable || null,
          `Ajuste de stock: ${stockAnterior} -> ${stock}`,
        ]
      );
    }

    const detalles = await pool.query(
      `select 
      p.id_producto, p.codigo, p.nombre, p.autor, p.descripcion, 
      p.id_categoria, c.nombre as categoria,
      p.id_proveedor, pr.nombre as proveedor, p.precio, p.stock, p.punto_reorden, 
      p.fecha_creacion, p.fecha_actualizacion
      from productos p
      left join categorias c on p.id_categoria = c.id_categoria 
      left join proveedores pr on p.id_proveedor = pr.id_proveedor
      where p.id_producto = $1`,
      [nuevoProducto.id_producto]
    );

    res.status(200).json({ message: "Producto actualizado", producto: detalles.rows[0] });
  } catch (err) { 
    console.error("Error al actualizar el producto", err);
    res.status(500).json({ error: "Error en el servidor" });
  }
};

export const deleteProduct = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      "delete from productos where id_producto = $1 returning *",
      [id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Producto no encontrado" });
    }
    res.status(200).json({ message: "Producto eliminado", producto: result.rows[0] });
  } catch (err) {
    console.error("Error al eliminar el producto", err);
    res.status(500).json({ error: "Error en el servidor" });
  }
}
