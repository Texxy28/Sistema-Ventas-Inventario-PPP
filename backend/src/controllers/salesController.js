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
  const { productos, total, id_usuario, estado, metodo_pago } = req.body;
  const client = await pool.connect();
  try {
    await client.query("begin");
    const result = await client.query(
      `insert into ventas (id_usuario, total, estado) 
             values ($1, $2, $3) returning *`,
      [id_usuario, total, estado || "completada"]
    );
    const nuevaVenta = result.rows[0];
    const id_nuevaVenta = nuevaVenta.id_venta;

    for (const item of productos) {
      const { id_producto, nombre, cantidad, precio } = item;
      await client.query(
        `insert into detalle_ventas (id_venta, id_producto, cantidad, precio_unitario) 
                 values ($1, $2, $3, $4)`,
        [id_nuevaVenta, id_producto, cantidad, precio]
      );
      await client.query(
        `insert into movimientos_inventario 
                  (id_producto, tipo_movimiento, cantidad, usuario_responsable, nota)
                 values ($1, 'venta', $2, $3, $4)`,
        [id_producto, cantidad, id_usuario, `Venta de: ${nombre}`]
      );
      await client.query(
        `update productos set stock = stock - $1 where id_producto = $2`,
        [cantidad, id_producto]
      );
    }
    const resultCount = await client.query(
      `select count(*) as total from comprobantes where date(fecha_emision) = CURRENT_DATE`
    );

    const countToday = parseInt(resultCount.rows[0].total) + 1;
    const numeroComprobante = `B${new Date()
      .toISOString()
      .slice(0, 10)
      .replace(/-/g, "")}-${String(countToday).padStart(3, "0")}`;

    const comprobanteResult = await client.query(
      `insert into comprobantes (id_venta, numero_comprobante, tipo_comprobante, metodo_pago, monto_total)
       values ($1, $2, $3, $4, $5)
       returning id_comprobante`,
      [
        id_nuevaVenta,
        numeroComprobante,
        "boleta",
        metodo_pago || "efectivo",
        total,
      ]
    );

    const nuevoComprobanteId = comprobanteResult.rows[0].id_comprobante;

    await client.query("commit");
    res.status(201).json({
      message: "Venta registrada exitosamente",
      venta: nuevaVenta,
      comprobante_id: nuevoComprobanteId
    });
  } catch (err) {
    await client.query("rollback");
    console.error("Error al añadir venta", err);
    res.status(500).json({ error: "Error en el servidor" });
  } finally {
    client.release();
  }
};
