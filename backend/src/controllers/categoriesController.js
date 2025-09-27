import pool from "../config/db.js";

export const getAllCategories = async (req, res) => {
  try {
    const result = await pool.query(
      "select * from categorias order by id_categoria"
    );
    res.json(result.rows);
  } catch (err) {
    console.error("Error al obtener categorías", err);
    res.status(500).json({ error: "Error en el servidor" });
  }
};

export const getAllCategoriesWithProductCount = async (req, res) => {
  try {
    const result = await pool.query(
      `select 
        c.id_categoria, c.nombre, c.descripcion,
        count(p.id_producto) as total_productos
      from categorias c
      left join productos p on c.id_categoria = p.id_categoria
      group by c.id_categoria
      order by c.id_categoria`
    );
    res.json(result.rows);
  } catch (err) {
    console.error("Error al obtener categorías", err);
    res.status(500).json({ error: "Error en el servidor" });
  }
};

export const addCategory = async (req, res) => {
  const { nombre, descripcion } = req.body;
  try {
    const result = await pool.query(
      `insert into categorias (nombre, descripcion) 
      values ($1, $2) returning *`,
      [nombre, descripcion || null]
    );
    const detalles = await pool.query(
      `select
      c.id_categoria, c.nombre, c.descripcion,
      count(p.id_producto) as total_productos
      from categorias c
      left join productos p on c.id_categoria = p.id_categoria
      where c.id_categoria = $1
      group by c.id_categoria
      order by c.id_categoria`,
      [result.rows[0].id_categoria]
    );
    res.status(201).json({ message: "Categoría añadida", categoria: detalles.rows[0] });
  } catch (err) {
    console.error("Error al añadir categoría", err);
    res.status(500).json({ error: "Error en el servidor" });
  }
};

export const updateCategory = async (req, res) => {
  const { id } = req.params;
  const { nombre, descripcion } = req.body;
  try {
    const result = await pool.query(
      `update categorias 
      set nombre = $1, descripcion = $2
      where id_categoria = $3 returning *`,
      [nombre, descripcion || null, id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Categoría no encontrada" });
    }
    const detalles = await pool.query(
      `select
      c.id_categoria, c.nombre, c.descripcion,
      count(p.id_producto) as total_productos
      from categorias c
      left join productos p on c.id_categoria = p.id_categoria
      where c.id_categoria = $1
      group by c.id_categoria
      order by c.id_categoria`,
      [id]
    );
    res.status(200).json({ message: "Categoría actualizada", categoria: detalles.rows[0] });
  } catch (err) {
    console.error("Error al actualizar categoría", err);
    res.status(500).json({ error: "Error en el servidor" });
  }
};

export const deleteCategory = async (req, res) => {
  const { id } = req.params;
  try {
    const productCheck = await pool.query(
      "select count(*) from productos where id_categoria = $1",
      [id]
    );
    if (parseInt(productCheck.rows[0].count) > 0) {
      return res.status(400).json({ error: "No se puede eliminar la categoría porque tiene productos asociados." });
    }
    const result = await pool.query(
      "delete from categorias where id_categoria = $1 returning *",
      [id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Categoría no encontrada" });
    }
    res.status(200).json({ message: "Categoría eliminada", categoria: result.rows[0] });
  } catch (err) {
    console.error("Error al verificar productos asociados", err);
    return res.status(500).json({ error: "Error en el servidor" });
  }
}
