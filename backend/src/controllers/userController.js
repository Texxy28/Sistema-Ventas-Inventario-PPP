import pool from "../config/db.js";

export const getUsers = async (req, res) => {
  try {
    const result = await pool.query(
      "select * from usuarios order by id_usuario desc"
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al obtener usuarios" });
  }
};

export const getUser = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      "select * from usuarios where id_usuario = $1",
      [id]
    );
    if (!result.rows.length)
      return res.status(404).json({ error: "Usuario no encontrado" });
    res.json({ user: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error en servidor" });
  }
};

export const updateUser = async (req, res) => {
  const { id } = req.params;
  const { nombre, apellido, correo, rol, contraseña } = req.body;
  let result = null;
  try {
    if (contraseña) {
      const hashedPassword = await bcrypt.hash(contraseña, SALT_ROUNDS);
      result = await pool.query(
        "update usuarios set nombre = $1, apellido = $2, correo = $3, rol = $4, contraseña = $5 where id_usuario = $6 returning *",
        [nombre, apellido, correo, rol, hashedPassword, id]
      );
    } else {
      result = await pool.query(
        "update usuarios set nombre = $1, apellido = $2, correo = $3, rol = $4 where id_usuario = $5 returning *",
        [nombre, apellido, correo, rol, id]
      );
    }
    res.status(201).json({ message: "Usuario actualizado", user: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al actualizar usuario" });
  }
};

export const deleteUser = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      "delete from usuarios where id_usuario = $1 returning *",
      [id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }
    res.status(200).json({ message: "Usuario eliminado", producto: result.rows[0] });
  } catch (err) {
    console.error("Error al eliminar el usuario", err);
    res.status(500).json({ error: "Error en el servidor" });
  }
}
