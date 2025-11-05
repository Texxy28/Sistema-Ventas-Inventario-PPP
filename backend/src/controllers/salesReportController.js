import pool from "../config/db.js";

export const getSalesByDateRange = async (req, res) => {
  const days = req.query.days;
  try {
    const result = await pool.query(
      `select sum(total) as total_sales from ventas where fecha >= current_date - ($1 || ' days')::interval and estado = 'completada'`,
      [days]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error("Error al obtener total de ventas", err);
    res.status(500).json({ error: "Error en el servidor" });
  }
};

export const getSalesCountByDateRange = async (req, res) => {
  const days = req.query.days;
  try {
    const result = await pool.query(
      `select count(*) as sales_count from ventas where fecha >= current_date - ($1 || ' days')::interval and estado = 'completada'`,
      [days]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error("Error al obtener cantidad de ventas", err);
    res.status(500).json({ error: "Error en el servidor" });
  }
};

export const getTopProductsByDateRange = async (req, res) => {
  const days = req.query.days;
  try {
    const result = await pool.query(
      `select p.nombre, sum(dv.cantidad) as total_sold from detalle_ventas dv join ventas v on dv.id_venta = v.id_venta join productos p on dv.id_producto = p.id_producto 
      where v.fecha >= current_date - ($1 || ' days')::interval and v.estado = 'completada' group by p.nombre, dv.id_producto order by total_sold desc limit 10`,
      [days]
    );
    res.json(result.rows);
  } catch (err) {
    console.error("Error al obtener top de productos", err);
    res.status(500).json({ error: "Error en el servidor" });
  }
};

export const getAverageSaleByDateRange = async (req, res) => {
  const days = req.query.days;
  try {
    const result = await pool.query(
      `select round(avg(total), 2) as average_sales from ventas where fecha >= current_date - ($1 || ' days')::interval and estado = 'completada'`,
      [days]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error("Error al obtener promedio de ventas", err);
    res.status(500).json({ error: "Error en el servidor" });
  }
};

export const getSalesByCategoryByDateRange = async (req, res) => {
  const days = req.query.days;
  try {
    const result = await pool.query(
      `select c.nombre as categoria, sum(dv.cantidad * dv.precio_unitario) as category_total from detalle_ventas dv join productos p on dv.id_producto = p.id_producto 
      join categorias c on p.id_categoria = c.id_categoria join ventas v on dv.id_venta = v.id_venta where v.fecha >= current_date - ($1 || ' days')::interval 
      and v.estado = 'completada' group by c.nombre order by category_total desc`,
      [days]
    );
    res.json(result.rows);
  } catch (err) {
    console.error("Error al obtener ventas totales por categoría", err);
    res.status(500).json({ error: "Error en el servidor" });
  }
};

export const getSalesByUserByDateRange = async (req, res) => {
  const days = req.query.days;
  try {
    const result = await pool.query(
      `select u.nombre || ' ' || u.apellido as vendedor, count(v.id_venta) as sales_count, sum(v.total) as sales_total from ventas v join usuarios u on v.id_usuario = u.id_usuario 
      where v.fecha >= current_date - ($1 || ' days')::interval and v.estado = 'completada' group by u.nombre, u.apellido order by sales_total desc`,
      [days]
    );
    res.json(result.rows);
  } catch (err) {
    console.error("Error al obtener ventas totales por vendedor", err);
    res.status(500).json({ error: "Error en el servidor" });
  }
}