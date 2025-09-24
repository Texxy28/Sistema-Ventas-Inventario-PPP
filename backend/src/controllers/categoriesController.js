import pool from "../config/db.js";

export const getAllCategories = async (req, res) => {
  try {
    const result = await pool.query("select * from categorias order by id_categoria");
    res.json(result.rows);
  } catch (err) {
    console.error("Error al obtener categorías", err);
    res.status(500).json({ error: "Error en el servidor" });
  }
};