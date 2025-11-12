import pool from "../config/db.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const SALT_ROUNDS = 10;

export const register = async (req, res) => {
  const { nombre, apellido, correo, contraseña, rol } = req.body;
  try {
    if (!nombre || !correo || !contraseña || !rol)
      return res.status(400).json({ error: "Faltan datos" });
    const exists = await pool.query(
      "select id_usuario from usuarios where correo = $1",
      [correo]
    );
    if (exists.rows.length)
      return res.status(409).json({ error: "Correo ya registrado" });
    const hashedPassword = await bcrypt.hash(contraseña, SALT_ROUNDS);
    const result = await pool.query(
      `insert into usuarios (nombre, apellido, correo, contraseña, rol)
       VALUES ($1,$2,$3,$4,$5) returning id_usuario, nombre, apellido, correo, rol`,
      [nombre, apellido, correo, hashedPassword, rol]
    );
    res.status(201).json({ user: result.rows[0] });
  } catch (err) {
    console.error("Error al registrar usuario", err);
    res.status(500).json({ error: "Error en el servidor" });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const result = await pool.query(
      "select * from usuarios where correo = $1",
      [email]
    );
    const user = result.rows[0];
    if (!user) return res.status(401).json({ error: "Credenciales inválidas" });
    const match = await bcrypt.compare(password, user.contraseña);
    if (!match)
      return res.status(401).json({ error: "Credenciales inválidas" });
    const payload = {
      id_usuario: user.id_usuario,
      nombre: user.nombre,
      rol: user.rol,
      correo: user.correo,
    };
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN || "8h",
    });
    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "None",
      maxAge: 1000 * 60 * 60 * 8, // 8 horas
    });
    delete user.contraseña;
    res.status(201).json({ message: 'Autenticado', user: payload });
  } catch (err) {
    console.error("Error al iniciar sesión", err);
    res.status(500).json({ error: "Error en el servidor" });
  }
};

export const logout = async (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.COOKIE_SECURE === "true",
    sameSite: "lax",
  });
  res.json({ message: "Sesión cerrada" });
};

export const me = async (req, res) => {
  res.json({ user: req.user });
};
