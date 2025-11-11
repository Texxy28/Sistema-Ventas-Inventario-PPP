import pool from "../config/db.js";

export const getProductsLowStockByDateRange = async (req, res) => {
  const days = req.query.days;
  try {
    const result = await pool.query(
      `select codigo, nombre, stock, punto_reorden from productos where stock <= punto_reorden`
    );
    res.json(result.rows);
  } catch (err) {
    console.error("Error al obtener productos con stock bajo", err);
    res.status(500).json({ error: "Error en el servidor" });
  }
};

export const getBottomProductsByDateRange = async (req, res) => {
  const days = req.query.days;
  try {
    const result = await pool.query(
      `select p.nombre, sum(dv.cantidad) as total_sold from detalle_ventas dv join ventas v on dv.id_venta = v.id_venta join productos p on dv.id_producto = p.id_producto 
      where v.fecha >= current_date - ($1 || ' days')::interval and v.estado = 'completada' group by p.nombre, dv.id_producto order by total_sold asc limit 10`,
      [days]
    );
    res.json(result.rows);
  } catch (err) {
    console.error("Error al obtener productos menos vendidos", err);
    res.status(500).json({ error: "Error en el servidor" });
  }
};

export const getProductWithNoMovementByDateRange = async (req, res) => {
  const days = req.query.days;
  try {
    const result = await pool.query(
      `select p.id_producto, p.nombre from productos p left join (select id_producto, max(fecha_movimiento) as ultima_fecha 
      from movimientos_inventario group by id_producto) m on p.id_producto = m.id_producto where m.ultima_fecha is null 
      or m.ultima_fecha < current_date - ($1 || ' days')::interval`,
      [days]
    );
    res.json(result.rows);
  } catch (err) {
    console.error("Error al obtener productos sin movimientos", err);
    res.status(500).json({ error: "Error en el servidor" });
  }
};

export const getInventoryTotalValue = async (req, res) => {
  try {
    const result = await pool.query(
      `select round(sum(precio * stock), 2) as valor_total_inventario from productos`
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error("Error al obtener el valor total del inventario", err);
    res.status(500).json({ error: "Error en el servidor" });
  }
};

export const getProductsSoldByCategoryByDateRange = async (req, res) => {
  const days = req.query.days;
  try {
    const result = await pool.query(
      `select c.nombre as categoria, sum(dv.cantidad) as total_stock from detalle_ventas dv join productos p on dv.id_producto = p.id_producto 
      join categorias c on p.id_categoria = c.id_categoria join ventas v on dv.id_venta = v.id_venta where v.fecha >= current_date - ($1 || ' days')::interval
      and v.estado = 'completada' group by c.nombre order by total_stock desc`,
      [days]
    );
    res.json(result.rows);
  } catch (err) {
    console.error("Error al obtener la cantidad de productos vendidos por categoría", err);
    res.status(500).json({ error: "Error en el servidor" });
  }
};
