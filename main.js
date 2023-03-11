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

app.get('/resultados/:piloto/:minutos/:uCierre/:completa', (req,res)=> {
let piloto = JSON.stringify(req.params.piloto)
let minutos = JSON.stringify(req.params.minutos)
let uCierre = JSON.stringify(req.params.uCierre)
let completa = JSON.stringify(req.params.completa)
let p1 = piloto
})


app.listen(port, () => {
    console.log(`Servidor corriendo en el puerto ${port}`)})