const express = require('express');
const hb = require('handlebars');
const app = express();
const archivo = require('fs')
const path1 = 'equipos.json';
const path2 = 'carrera.json'
const port = 3000;


app.get('/', (req, res) =>{(
    res.send('holamundo')
)})

app.get('/resultados')


app.listen(port, () => {
    console.log(`Servidor corriendo en el puerto ${port}`)})