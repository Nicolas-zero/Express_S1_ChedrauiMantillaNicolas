const express = require('express');
const passport = require('passport');
require('dotenv').config();
const { jwtStrategy } = require('./config/passport');

// Importar rutas
const authRoutes = require('./routes/auth.routes');
const userRoutes = require('./routes/userRoutes');
const auth = require('./middlewares/auth');

const app = express();
app.use(express.json());

// Configurar passport
passport.use(jwtStrategy);
app.use(passport.initialize());

// Rutas públicas
app.use('/auth', authRoutes);

// Rutas protegidas
app.use('/users', auth, userRoutes);

// Iniciar servidor directamente aquí
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
