import pool from "../config/db.js";
import bcrypt from "bcrypt";

export const getUsers = async (req, res) => {
  try {
    const result = await pool.query(
      "select id_usuario, nombre, apellido, correo, rol from usuarios order by id_usuario asc"
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
      const hashedPassword = await bcrypt.hash(contraseña, 10);
      result = await pool.query(
        "update usuarios set nombre = $1, apellido = $2, correo = $3, rol = $4, contraseña = $5 where id_usuario = $6 returning id_usuario, nombre, apellido, correo, rol",
        [nombre, apellido, correo, rol, hashedPassword, id]
      );
    } else {
      result = await pool.query(
        "update usuarios set nombre = $1, apellido = $2, correo = $3, rol = $4 where id_usuario = $5 returning id_usuario, nombre, apellido, correo, rol",
        [nombre, apellido, correo, rol, id]
      );
    }
    res
      .status(201)
      .json({ message: "Usuario actualizado", user: result.rows[0] });
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
    res
      .status(200)
      .json({ message: "Usuario eliminado", producto: result.rows[0] });
  } catch (err) {
    console.error("Error al eliminar el usuario", err);
    res.status(500).json({ error: "Error en el servidor" });
  }
};

export const changePasswordByAdmin = async (req, res) => {
  const { id } = req.params;
  const { contraseña } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(contraseña, 10);
    const result = await pool.query(
      "update usuarios set contraseña = $1 where id_usuario = $2 returning *",
      [hashedPassword, id]
    );
    res
      .status(201)
      .json({ message: "Contraseña actualizada", user: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al actualizar contraseña" });
  }
};

export const changePassword = async (req, res) => {
  const userId = req.user.id_usuario;
  const { currentPassword, newPassword, confirmPassword } = req.body;
  if (!currentPassword || !newPassword || !confirmPassword) {
    return res.status(400).json({ error: "Datos incompletos" });
  }
  if (newPassword !== confirmPassword) {
    return res.status(400).json({ error: "Las contraseñas no coinciden" });
  }
  // if (newPassword.length < 8) {
  //   return res
  //     .status(400)
  //     .json({ error: "La contraseña debe tener al menos 8 caracteres" });
  // }
  try {
    const userResult = await pool.query(
      "select contraseña from usuarios where id_usuario = $1",
      [userId]
    );

    const user = userResult.rows[0];
    if (!user) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    const isValid = await bcrypt.compare(currentPassword, user.contraseña);
    if (!isValid) {
      return res.status(401).json({ error: "Contraseña actual incorrecta" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await pool.query(
      "update usuarios set contraseña = $1 where id_usuario = $2",
      [hashedPassword, userId]
    );

    res.json({ message: "Contraseña actualizada correctamente" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error del servidor" });
  }
};

export const createUser = async (req, res) => {
  const { nombre, apellido, correo, contraseña, rol } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(contraseña, 10);
    const result = await pool.query(
      "insert into usuarios (nombre, apellido, correo, contraseña, rol) VALUES ($1,$2,$3,$4,$5) returning id_usuario, nombre, apellido, correo, rol",
      [nombre, apellido, correo, hashedPassword, rol]
    );
    res.status(201).json({ message: "Usuario creado", user: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al crear usuario" });
  }
};
