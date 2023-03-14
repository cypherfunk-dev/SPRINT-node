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
const ruta3 = "./public/resultados.json"

hbs.registerHelper("inc", function (value, options) {
    return parseInt(value) + 1;
});

app.get('/', (req, res) => {
    res.send('Hola mundo');
});

app.get('/resultados', (req, res) => {
    let rawrace = fs.readFileSync(ruta1);
    let rawteam = fs.readFileSync(ruta2);
    let rawresultados = fs.readFileSync(ruta3);
    let race = JSON.parse(rawrace);
    let team = JSON.parse(rawteam);
    let result = JSON.parse(rawresultados);
    res.render("index.hbs", { race, team });
});

app.post('/enviar-datos', (req, res) => {
    const ubicacion = req.body.ubicacioncierre
    const finish = req.body.finalizacarrera;
    const tiempo = req.body.tiempo;
    const piloto = req.body.piloto;
    const puesto = req.body.lugar;
    const escuderia = req.body.escuderia;

    const objetoresultado = puesto.map((lugar, index) => ({

        "piloto": piloto[index],
        "puesto": puesto[index],
        "Finaliza": finish[index],
        "tiempo": tiempo[index],
        "escuderia": escuderia[index]
    }));

//      const resultadosPorUbicacion = {};
//      resultadosPorUbicacion[ubicacion] = objetoresultado;
//     let resultadosAnteriores = {};
//     if (fs.existsSync(ruta3)) {
//         let rawresultados = fs.readFileSync(ruta3);
//         resultadosAnteriores = JSON.parse(rawresultados);
//     }
//     const nuevosResultados = Object.assign({}, resultadosAnteriores, resultadosPorUbicacion);
//     let yeison = JSON.stringify(nuevosResultados);
//     fs.writeFileSync(ruta3, yeison);
//     res.render("enviado.hbs");
// });

let resultadosAnteriores = {};
if (fs.existsSync(ruta3)) {
  let rawresultados = fs.readFileSync(ruta3);
  resultadosAnteriores = JSON.parse(rawresultados);
}

const resultadosPorUbicacion = {};
resultadosPorUbicacion["carrera"] = ubicacion;
resultadosPorUbicacion["individuales"] = objetoresultado;

const nuevosResultados = Object.assign({}, resultadosAnteriores);
nuevosResultados["resultados"] = nuevosResultados["resultados"] || [];
nuevosResultados["resultados"].push(resultadosPorUbicacion);

let yeison = JSON.stringify(nuevosResultados);
fs.writeFileSync(ruta3, yeison);
res.render("enviado.hbs");
});


app.get('/puntajestotal', (req, res) => {
    res.send('Página de puntajes totales');
});

app.listen(port, () => {
    console.log(`Servidor corriendo en el puerto ${port}`);
});
