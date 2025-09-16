import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { Pool } from 'pg';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

pool.connect()
  .then(client => {
    console.log('Conectado a la base de datos');
    client.release();
  })
  .catch(err => console.error('Error de conexión a BD:', err));

app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});