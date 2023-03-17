const express = require('express');
const hbs = require('hbs');
const fs = require('fs');
const app = express();
const port = 3000;
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
hbs.registerPartials(__dirname + "/views/partials");
app.set("view engine", "hbs");

const ruta1 = './public/carrera.json'
const ruta2 = './public/equipos.json'
const ruta3 = "./public/resultados.json"

hbs.registerHelper("inc", function (value, options) {
    return parseInt(value) + 1;
});

app.get('/', (req, res) => {
    res.render("index.hbs");
});

app.get('/resultados', (req, res) => {
    let rawrace = fs.readFileSync(ruta1);
    let rawteam = fs.readFileSync(ruta2);
    let rawresultados = fs.readFileSync(ruta3);
    let race = JSON.parse(rawrace);
    let team = JSON.parse(rawteam);
    let result = JSON.parse(rawresultados);
    res.render("resultados.hbs", { race, team });
});

app.post('/enviar-datos', (req, res) => {
    
    const ubicacion = req.body.ubicacioncierre
    const finish = req.body.finalizacarrera;
    const tiempo = req.body.tiempo;
    const piloto = req.body.piloto;
    const puesto = req.body.lugar;
    const escuderia = req.body.escuderia;
    const motivo = req.body.miCheckbox;
    
    const objetoresultado = puesto.map((lugar, index) => {
        let puntaje;
        if (puesto[index] == 1) {
            puntaje = 20;
        } else if (puesto[index] == 2) {
            puntaje = 18;
        } else if (puesto[index] == 3) {
            puntaje = 15;
        } else if (puesto[index] == 4) {
            puntaje = 12;
        } else if (puesto[index] == 5) {
            puntaje = 10;
        } else if (puesto[index] == 6) {
            puntaje = 8;
        } else if (puesto[index] == 7) {
            puntaje = 6;
        } else if (puesto[index] == 8) {
            puntaje = 4;
        } else if (puesto[index] == 9) {
            puntaje = 2;
        } else if (puesto[index] == 10) {
            puntaje = 1;
        } else {
            puntaje = 0;
        }

        return {


            "piloto": piloto[index],
            "puesto": puesto[index],
            "Finaliza": finish[index],
            "tiempo": tiempo[index],
            "escuderia": escuderia[index],
            "puntaje": puntaje,
            "motivo": motivo[index]
        };
    });

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

app.get('/abandonos', (req, res) => {
    
    let rawresultados = fs.readFileSync(ruta3);
    let result = JSON.parse(rawresultados);
    let resultados = result.resultados;
    let pilotos = {};
    resultados.forEach((carrera) => {
        carrera.individuales.forEach((piloto) => {
            let Finaliza = parseInt(piloto.Finaliza);
            if (!pilotos[piloto.piloto]) {
                pilotos[piloto.piloto] = Finaliza;
            } else {
                pilotos[piloto.piloto] += Finaliza;
            }
        });
    });
    let pilotosArray = Object.entries(pilotos);
    pilotosArray.sort((a, b) => b[1] - a[1]);
    let pilotosOrdenados = {};
    for (let i = 0; i < pilotosArray.length; i++) {
        let [piloto, finalizadas] = pilotosArray[i];
        pilotosOrdenados[piloto] = finalizadas;
    }
    res.render('abandonos.hbs', { pilotos: pilotosOrdenados });
});

app.get('/totales', (req, res) => {
    res.render('totales.hbs')
})




app.get('/escuderia', (req, res) => {

    let rawresultados = fs.readFileSync(ruta3);
    let result = JSON.parse(rawresultados);
    let resultados = result.resultados;
    let escuderias = {};
    resultados.forEach((carrera) => {
        carrera.individuales.forEach((escuderia) => {
            let puesto = parseInt(escuderia.puesto);
            if (!escuderias[escuderia.escuderia]) {
                escuderias[escuderia.escuderia] = puesto;
            } else {
                escuderias[escuderia.escuderia] += puesto;
            }
        });
    });
    let pilotosArray = Object.entries(escuderias);
    pilotosArray.sort((a, b) => b[1] - a[1]);
    let pilotosOrdenados = {};
    for (let i = 0; i < pilotosArray.length; i++) {
        let [escuderia, finalizadas] = pilotosArray[i];
        pilotosOrdenados[escuderia] = finalizadas;
    }
    res.render('escuderia.hbs', { escuderias: pilotosOrdenados });
});










app.listen(port, () => {
    console.log(`Servidor corriendo en el puerto ${port}`);
});
