//importamos el express en app.js

const express = require('express');
const app = express();

//----anidacion a JSON----
app.use(express.json());

require('dotenv').config();

//-----Definir el puerto-----
const PORT = process.env.PORT;

//----- Ruta principal -----
app.get('/',(req,res) =>{
    res.send()
})