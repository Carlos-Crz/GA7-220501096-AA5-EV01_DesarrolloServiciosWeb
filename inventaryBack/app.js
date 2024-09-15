const express = require('express')
const cors = require('cors');  // Para permitir conexiones desde React
const session = require('express-session');
const mysql = require('mysql2/promise');
const app = express();
const port = 3001;


// Configuración de CORS
app.use(cors({
  origin: 'http://localhost:3000', // Esto es la ruta frontend
  credentials: true,  
}));

// Configuración de sesiones
app.use(session({
  secret: 'clave123',
   resave: false,
   saveUninitialized: true,
   cookie: { secure: false }
}));

// Conexión a la base de datos
const connection = mysql.createPool({
  host: 'localhost',
  user: 'root',
  database: 'supermarketdb',
});


// Ruta de inicio de sesión
app.get('/Login', async (req, res) => {
  const datos = req.query;
  try {
    // Consulta a la base de datos
    const [results, fields] = await connection.query(
      "SELECT * FROM `usuarios` WHERE `nombre_usuario` = ? AND `contrasenia` = ?", 
      [datos.nombre_usuario, datos.contrasenia]
    );
    
    if(results.length > 0){
      req.session.isAuthenticated = true;
      req.session.nombre_usuario = datos.nombre_usuario;
      res.status(200).send({ success: true, message: 'Inicio de Sesión correcto' })
    } else {
      res.status(401).send({ success: false, message: 'Datos incorrectos' })
    }
  } catch (err) {
      console.log(err);
      res.status(500).json({ success: false, message: 'Error en el servidor' });
  }
})


// Ruta para verificar el estado de autenticación
app.get('/auth/status', (req, res) => {
  if (req.session.isAuthenticated) {
    res.status(200).json({ authenticated: true, user: req.session.user });
  } else {
    res.status(401).json({ authenticated: false });
  }
});


// Ruta para cerrar sesión
app.post('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      res.status(500).json({ success: false, message: 'Error al cerrar sesión' });
    } else {
      res.status(200).json({ success: true, message: 'Sesión cerrada correctamente' });
    }
  });
});

// Ruta de prueba
app.get('/', (req, res) => {
  res.send('Hola Mundo!');
});



app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})