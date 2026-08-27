import express from 'express';
import cors from 'cors';

const app = express();
app.use(express.json());
app.use(cors()); // Permite peticiones desde el frontend

// Endpoint para el inicio de sesión
app.post('/api/login', (req, res) => {
    const { usuario, password } = req.body;

    // Validación básica de campos
    if (!usuario || !password) {
        return res.status(400).json({ error: 'Por favor, completá todos los campos.' });
    }

    // Ejemplo básico: reemplazar por consulta a Base de Datos
    if (usuario === 'admin' && password === '123456') {
        return res.status(200).json({ 
            mensaje: 'Inicio de sesión exitoso', 
            token: 'token-falso-de-prueba' 
        });
    }

    return res.status(401).json({ error: 'Usuario o contraseña incorrectos.' });
});

app.listen(3000, () => {
    console.log('Servidor corriendo en http://localhost:3000');
});


import express from 'express';
import cors from 'cors';

const app = express();
app.use(express.json());
app.use(cors()); // Permite peticiones desde el frontend

// Endpoint para el inicio de sesión
app.post('/api/login', (req, res) => {
    const { usuario, password } = req.body;

    // Validación básica de campos
    if (!usuario || !password) {
        return res.status(400).json({ error: 'Por favor, completá todos los campos.' });
    }

    // Ejemplo básico: reemplazar por consulta a Base de Datos
    if (usuario === 'admin' && password === '123456') {
        return res.status(200).json({ 
            mensaje: 'Inicio de sesión exitoso', 
            token: 'token-falso-de-prueba' 
        });
    }

    return res.status(401).json({ error: 'Usuario o contraseña incorrectos.' });
});

app.listen(3000, () => {
    console.log('Servidor corriendo en http://localhost:3000');
});

