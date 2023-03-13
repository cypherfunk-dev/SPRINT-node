const express = require('express');
const hbs = require('hbs');
const fs = require('fs');
const app = express();
const port = 3000;
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));

hbs.registerPartials(__dirname + "/views/partials");
app.set("view engine", "hbs");

const ruta1 = './public/carrera.json'
const ruta2 = './public/equipos.json'

hbs.registerHelper("inc", function(value, options)
{
    return parseInt(value) + 1;
});

app.get('/', (req, res) => {
    res.send('Hola mundo');
});




app.get('/resultados', (req, res) => {
    let rawrace = fs.readFileSync(ruta1);
    let rawteam = fs.readFileSync(ruta2);
    let race = JSON.parse(rawrace);
    let team = JSON.parse(rawteam);
    res.render("index.hbs", { race, team });
});


app.post('/enviar-datos', (req, res) => {
    console.log(req.body.finalizacarrera);
    console.log(req.body.tiempo);
    console.log(JSON.stringify(req.body.piloto));
    console.log(req.body.ubicacioncierre)
    res.send('Datos recibidos');
  });



app.get('/puntajestotal', (req, res) => {
    res.send('Página de puntajes totales');
});

app.listen(port, () => {
    console.log(`Servidor corriendo en el puerto ${port}`);
});
