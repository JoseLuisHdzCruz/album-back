const express = require('express');
const dotenv = require('dotenv');
const fs = require('fs'); // Para leer/escribir archivos
const path = require('path'); // Para manejar rutas de archivos
const crypto = require('crypto'); // Para generar un secreto seguro
const cors = require('cors'); // Importa el paquete cors
const connectDB = require('./config/db');
const albumRoutes = require('./routes/albumRoutes');
const userRoutes = require('./routes/UserRoutes')

// Ruta al archivo .env
const envPath = path.resolve(__dirname, '.env');

// Cargar variables de entorno desde .env
dotenv.config({ path: envPath });

// Función para generar un JWT_SECRET seguro
function ensureJwtSecret() {
  if (!process.env.JWT_SECRET) {
    console.log('JWT_SECRET no encontrado. Generando uno nuevo...');

    // Generar un secreto seguro usando crypto
    const jwtSecret = crypto.randomBytes(32).toString('hex');

    // Agregar el secreto al archivo .env
    const envContent = `\nJWT_SECRET=${jwtSecret}\n`;
    fs.appendFileSync(envPath, envContent);

    console.log('JWT_SECRET generado y guardado en .env.');
  } else {
    console.log('JWT_SECRET ya existe. No se realizaron cambios.');
  }
}

// Asegurar que el JWT_SECRET exista
ensureJwtSecret();

// Conectar a la base de datos
connectDB();

const app = express();

// Middleware
app.use(cors()); // Habilita CORS para todas las rutas
app.use(express.json());
app.use('/api/albums', albumRoutes);
app.use('/api/user', userRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));