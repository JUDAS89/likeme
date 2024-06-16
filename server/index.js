// server/index.js
const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();
const port = 3000;

// Middleware para habilitar CORS
app.use(cors());
app.use(express.json());

// Configuración de conexión a PostgreSQL
const pool = new Pool({
  user: 'lorenaperoza', 
  host: 'localhost',
  database: 'likeme', 
  password: 'sadujudas', 
  port: 5432, 
});

// Ruta GET para obtener todos los posts
app.get('/posts', async (req, res) => {
  try {
    const client = await pool.connect();
    const result = await client.query('SELECT * FROM posts');
    const posts = result.rows;
    client.release();
    res.json(posts);
  } catch (err) {
    console.error('Error al obtener los posts', err);
    res.status(500).send('Error al obtener los posts');
  }
});

// Ruta POST para agregar un nuevo post
app.post('/posts', async (req, res) => {
  const { titulo, img, descripcion } = req.body;
  try {
    const client = await pool.connect();
    const result = await client.query(
      'INSERT INTO posts (titulo, img, descripcion, likes) VALUES ($1, $2, $3, $4) RETURNING *',
      [titulo, img, descripcion, 0] // Aquí se asume que likes empieza en 0
    );
    const nuevoPost = result.rows[0];
    client.release();
    res.status(201).json(nuevoPost);
  } catch (err) {
    console.error('Error al agregar el post', err);
    res.status(500).send('Error al agregar el post');
  }
});

// Iniciar servidor
app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});