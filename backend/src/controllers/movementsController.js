import pool from "../config/db.js";

export const getMovementList = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 20;
  const offset = (page - 1) * limit;
  try {
    const movementsQuery = `select p.nombre as producto, m.tipo_movimiento, m.cantidad, m.fecha_movimiento, u.nombre || ' ' || u.apellido as vendedor
        from movimientos_inventario as m join usuarios as u on m.usuario_responsable = u.id_usuario 
        join productos as p on m.id_producto = p.id_producto order by m.fecha_movimiento desc limit $1 offset $2`;
    const totalQuery = `select count(*) from movimientos_inventario`;
    const [movementsResult, totalResult] = await Promise.all([
      pool.query(movementsQuery, [limit, offset]),
      pool.query(totalQuery),
    ]);
    const total = parseInt(totalResult.rows[0].count);
    const totalPages = Math.ceil(total / limit);
    res.json({
      movements: movementsResult.rows,
      total,
      totalPages,
      currentPage: page,
    });
  } catch (err) {
    console.error("Error al obtener movimientos", err);
    res.status(500).json({ error: "Error en el servidor" });
  }
};
