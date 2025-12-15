import pool from "../config/db.js";

export const getAllSuppliers = async (req, res) => {
    try {
        const result = await pool.query("select * from proveedores order by id_proveedor");
        res.json(result.rows);
    } catch (err) {
        console.error("Error al obtener proveedores", err);
        res.status(500).json({ error: "Error en el servidor" });
    }
};