import { Personaje } from './Modules/Personaje.js';
import { Jefe } from './Modules/Jefe.js';
import { objetos } from './Modules/Mercado.js';
import { agruparPorNivel, batalla, mostrarRanking } from './Modules/Ranking.js';
import { showScene } from './Utils/Utils.js';

let jugador;
let imagen = "";

// FUNCIONES DE CAMBIO DE ESCENA
function showChoosePlayer() {
    document.getElementById('choose_player').classList.add('scene_active');
    document.getElementById('choose_player').classList.remove('scene');
    document.getElementById('look_stats').classList.add('scene');
    document.getElementById('look_stats').classList.remove('scene_active');
}

function showStats() {
    document.getElementById('choose_player').classList.remove('scene_active');
    document.getElementById('choose_player').classList.add('scene');
    document.getElementById('look_stats').classList.remove('scene');
    document.getElementById('look_stats').classList.add('scene_active');
}

function showMarketScene() {
    document.getElementById('look_stats').classList.remove('scene_active');
    document.getElementById('look_stats').classList.add('scene');
    document.getElementById('look_market').classList.remove('scene');
    document.getElementById('look_market').classList.add('scene_active');
}

// ELECCIÓN DE JUGADOR
document.getElementById('btnL').addEventListener('click', function () {
    jugador = new Personaje('Elfo', 50, 20, 0, 200);
    imagen = 'IMG/legolas.webp';
    mostrarStats(imagen);
});

document.getElementById('btnG').addEventListener('click', function () {
    jugador = new Personaje('Guerrero', 60, 10, 0, 200);
    imagen = 'IMG/guerrero.png';
    mostrarStats(imagen);
});

document.getElementById('btnO').addEventListener('click', function () {
    jugador = new Personaje('Orco', 40, 30, 0, 200);
    imagen = 'IMG/orco.png';
    mostrarStats(imagen);
});

document.getElementById('back_choose_player').addEventListener('click', showChoosePlayer);

// STATS
function mostrarStats(imagen) {
    showStats();
    document.getElementById('chosenImg').src = imagen;
    document.getElementById('vida').textContent = jugador.vida;
    document.getElementById('ataque').textContent = jugador.ataque;
    document.getElementById('defensa').textContent = jugador.defensa;
    document.getElementById('puntos').textContent = jugador.puntos;
    document.getElementById('monedas').textContent = jugador.monedas;
}

// MARKET
document.getElementById('ir_market').addEventListener('click', function () {
    const inputNombre = document.getElementById('nombre');
    const nombreJugador = inputNombre.value.trim() || jugador.nombre;
    const monedasJugador = jugador.monedas;

    mostrarMarket(imagen, nombreJugador, monedasJugador);

    const marketItemsDiv = document.getElementById('marketItems');
    marketItemsDiv.textContent = "";

    objetos.forEach(obj => {
        const itemDiv = document.createElement('div');
        itemDiv.innerHTML = obj.mostrarInfo();
        marketItemsDiv.appendChild(itemDiv);
    });
});

function mostrarMarket(imagen, nombre, monedas) {
    showMarketScene();
    document.querySelector('#look_market #chosenImg').src = imagen;
    document.querySelector('#look_market #nombre').textContent = nombre;
    document.querySelector('#look_market #monedas').textContent = monedas;
}
