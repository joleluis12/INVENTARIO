const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Configuración de la conexión a la base de datos MySQL usando un pool de conexiones
const pool = mysql.createPool({
    host: 'invetariotiendita21.neuroseeq.com',
    user: 'u475816193_seegaaa',
    password: 'Danny9710',
    database: 'u475816193_seega',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Verificar la conexión
pool.getConnection((err, connection) => {
    if (err) {
        console.error('Error conectando a la base de datos MySQL:', err);
        return;
    }
    console.log('Conectado a la base de datos MySQL.');
    connection.release(); // Liberar la conexión de nuevo al pool
});

// Rutas CRUD para celulares
app.get('/api/celulares', (req, res) => {
    const sql = 'SELECT * FROM celulares';
    pool.query(sql, (err, result) => {
        if (err) {
            console.error('Error al obtener los celulares:', err);
            return res.status(500).json({ error: 'Error al obtener los celulares' });
        }
        res.json(result);
    });
});

app.get('/api/celulares/:id', (req, res) => {
    const sql = 'SELECT * FROM celulares WHERE id = ?';
    const id = req.params.id;
    pool.query(sql, [id], (err, result) => {
        if (err) {
            console.error('Error al obtener el celular:', err);
            return res.status(500).json({ error: 'Error al obtener el celular' });
        }
        res.json(result[0]);
    });
});

app.post('/api/celulares', (req, res) => {
    const { nombre, marca, precio, stock, descripcion, imagen_url } = req.body;

    // Validar que precio y stock no sean negativos
    if (precio < 0 || stock < 0) {
        return res.status(400).json({ error: 'Precio y Stock no pueden ser negativos' });
    }

    const sql = 'INSERT INTO celulares SET ?';
    const newCelular = { nombre, marca, precio, stock, descripcion, imagen_url };
    pool.query(sql, newCelular, (err, result) => {
        if (err) {
            console.error('Error al crear el celular:', err);
            return res.status(500).json({ error: 'Error al crear el celular' });
        }
        res.json({ id: result.insertId, ...newCelular });
    });
});

app.put('/api/celulares/:id', (req, res) => {
    const { nombre, marca, precio, stock, descripcion, imagen_url } = req.body;

    // Validar que precio y stock no sean negativos
    if (precio < 0 || stock < 0) {
        return res.status(400).json({ error: 'Precio y Stock no pueden ser negativos' });
    }

    const sql = 'UPDATE celulares SET ? WHERE id = ?';
    const id = req.params.id;
    const updatedCelular = { nombre, marca, precio, stock, descripcion, imagen_url };
    pool.query(sql, [updatedCelular, id], (err, result) => {
        if (err) {
            console.error('Error al actualizar el celular:', err);
            return res.status(500).json({ error: 'Error al actualizar el celular' });
        }
        res.json({ id, ...updatedCelular });
    });
});

app.delete('/api/celulares/:id', (req, res) => {
    const sql = 'DELETE FROM celulares WHERE id = ?';
    const id = req.params.id;
    pool.query(sql, [id], (err, result) => {
        if (err) {
            console.error('Error al eliminar el celular:', err);
            return res.status(500).json({ error: 'Error al eliminar el celular' });
        }
        res.json({ message: 'Celular eliminado' });
    });
});

// Ruta para obtener celulares ordenados por precio de mayor a menor
app.get('/api/celulares/precio', (req, res) => {
    const sql = 'SELECT * FROM celulares ORDER BY precio DESC';
    pool.query(sql, (err, result) => {
        if (err) {
            console.error('Error al obtener los celulares ordenados por precio:', err);
            return res.status(500).json({ error: 'Error al obtener los celulares ordenados por precio' });
        }
        res.json(result);
    });
});

// Iniciar el servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});
