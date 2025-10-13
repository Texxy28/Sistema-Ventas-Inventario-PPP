import pool from "../config/db.js";
import PDFDocument from "pdfkit";

export const getAllVouchers = async (req, res) => {
  try {
    const result = await pool.query(`select * from comprobantes`);
    res.json(result.rows);
  } catch (err) {
    console.error("Error al obtener ventas", err);
    res.status(500).json({ error: "Error en el servidor" });
  }
};

export const getVoucherById = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      "select * from comprobantes where id_comprobante = $1",
      [id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Comprobante no encontrado" });
    }
    res
      .status(201)
      .json({ message: "Comprobante encontrado", comprobante: result.rows[0] });
  } catch (err) {
    console.error("Error al obtener el comprobante", err);
    res.status(500).json({ error: "Error en el servidor" });
  }
};

export const createDoc = async (req, res) => {
  const { id } = req.params;

  try {
    const comprobanteResult = await pool.query(
      `
      select c.*, v.fecha, u.nombre as vendedor, cli.nombre as cliente_nombre, cli.apellido as cliente_apellido
      from comprobantes c
      join ventas v on v.id_venta = c.id_venta
      join usuarios u on v.id_usuario = u.id_usuario
      left join clientes cli on v.id_cliente = cli.id_cliente
      where c.id_comprobante = $1
    `,
      [id]
    );

    if (comprobanteResult.rows.length === 0) {
      return res.status(404).send("Comprobante no encontrado");
    }

    const comprobante = comprobanteResult.rows[0];
    const detalleResult = await pool.query(
      `
      select p.nombre, d.cantidad, d.precio_unitario, d.subtotal
      from detalle_ventas d
      join productos p on d.id_producto = p.id_producto
      where d.id_venta = $1
    `,
      [comprobante.id_venta]
    );
    const detalles = detalleResult.rows;

    const doc = new PDFDocument({ margin: 40 });
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `inline; filename=comprobante_${comprobante.numero_comprobante}.pdf`
    );
    doc.pipe(res);

    doc
      .fontSize(18)
      .text("LIBRERÍA SORPRESAS", { align: "center", bold: true });
    doc
      .fontSize(10)
      .fillColor("#555")
      .text(
        "MZ. G LT. 2, NINGUNO 13 6 SECTOR - LIMA - LIMA - VILLA EL SALVADOR",
        { align: "center" }
      )
      .text(
        "Número de Contacto: 983587330  |  Email: claramelanieb@gmail.com",
        { align: "center" }
      )
      .moveDown(2);

    doc.moveTo(40, 120).lineTo(550, 120).strokeColor("#cccccc").stroke();

    doc
      .fontSize(12)
      .fillColor("#000")
      .text(`Comprobante N°: ${comprobante.numero_comprobante}`, 50, 140)
      .text(
        `Fecha: ${new Date(comprobante.fecha_emision).toLocaleString('es-PE')}`,
        50,
        160
      )
      .text(`Método de Pago: ${comprobante.metodo_pago}`, 50, 180)
      .text(`Vendedor: ${comprobante.vendedor}`, 50, 200);

    if (comprobante.cliente_nombre) {
      doc.text(
        `Cliente: ${comprobante.cliente_nombre} ${comprobante.cliente_apellido}`,
        50,
        220
      );
    }

    const tableTop = 260;
    const columnPositions = [50, 250, 350, 450, 520];

    doc
      .fontSize(12)
      .fillColor("#000")
      .text("Producto", columnPositions[0], tableTop)
      .text("Cant.", columnPositions[1], tableTop)
      .text("P. Unit.", columnPositions[2], tableTop)
      .text("Subtotal", columnPositions[3], tableTop);

    doc
      .moveTo(40, tableTop + 15)
      .lineTo(550, tableTop + 15)
      .strokeColor("#000")
      .stroke();

     let y = tableTop + 30;
    detalles.forEach((item) => {
      doc
        .fontSize(11)
        .fillColor("#333")
        .text(item.nombre, columnPositions[0], y)
        .text(item.cantidad.toString(), columnPositions[1], y)
        .text(`S/ ${parseFloat(item.precio_unitario).toFixed(2)}`, columnPositions[2], y)
        .text(`S/ ${parseFloat(item.subtotal).toFixed(2)}`, columnPositions[3], y, { align: "right" });
      y += 20;
    });

    doc.moveDown(1.5);
    doc
      .fontSize(13)
      .fillColor("#000")
      .text(`TOTAL: S/ ${parseFloat(comprobante.monto_total).toFixed(2)}`, 0, y + 20, { align: "right", bold: true });

    doc.moveDown(3);
    doc
      .fontSize(10)
      .fillColor("#444")
      .text("Gracias por su compra. ¡Vuelva pronto!", { align: "center" });

    doc.end();

  } catch (err) {
    console.error(err);
    res.status(500).send("Error al generar el comprobante");
  }
};
