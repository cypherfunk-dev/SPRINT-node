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
let piloto = req.params.piloto
let minutos = req.params.minutos
let uCierre = req.params.uCierre
let completa = req.params.completa
let p1 = JSON.stringify(piloto) 
res.send(p1)
})


app.listen(port, () => {
    console.log(`Servidor corriendo en el puerto ${port}`)})