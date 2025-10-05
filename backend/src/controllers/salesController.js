import pool from "../config/db.js";

export const getAllSales = async (req, res) => {
  try {
    const result = await pool.query(`select * from ventas`);
    res.json(result.rows);
  } catch (err) {
    console.error("Error al obtener ventas", err);
    res.status(500).json({ error: "Error en el servidor" });
  }
};

export const addSale = async (req, res) => {
  const { productos, total, id_usuario, estado } = req.body;
  try {
    const result = await pool.query(
      `insert into ventas (id_usuario, total, estado) 
             values ($1, $2, $3) returning *`,
      [id_usuario, total, estado || "completada"]
    );
    const nuevaVenta = result.rows[0];
    const id_nuevaVenta = nuevaVenta.id_venta;

    for (const item of productos) {
      const { id_producto, nombre, cantidad, precio } = item;
      await pool.query(
        `insert into detalle_ventas (id_venta, id_producto, cantidad, precio_unitario) 
                 values ($1, $2, $3, $4)`,
        [
          id_nuevaVenta,
          id_producto,
          cantidad,
          precio
        ]
      );
      await pool.query(
        `insert into movimientos_inventario 
                  (id_producto, tipo_movimiento, cantidad, usuario_responsable, nota)
                 values ($1, 'venta', $2, $3, $4)`,
        [id_producto, cantidad, id_usuario, `Venta de: ${nombre}`]
      );
      await pool.query(
        `update productos set stock = stock - $1 where id_producto = $2`,
        [cantidad, id_producto]
      );
    }
    res.status(201).json({
      message: "Venta registrada exitosamente",
      venta: nuevaVenta,
    });
  } catch (err) {
    console.error("Error al añadir venta", err);
    res.status(500).json({ error: "Error en el servidor" });
  }
};
