import { Personaje } from './Modules/Personaje.js';
import { Jefe } from './Modules/Jefe.js';
import { objetos } from './Modules/Mercado.js';
import { agruparPorNivel, batalla, mostrarRanking } from './Modules/Ranking.js';
import { showScene } from './Utils/Utils.js';

let jugador;
let imagen = "";
const comprado = new Map();

// ELECCIÓN DE JUGADOR
document.getElementById('botonElfo').addEventListener('click', function () {
    jugador = new Personaje(50, 20, 0, 200);
    imagen = 'IMG/legolas.webp';
    mostrarStats(imagen);
});

document.getElementById('botonGuerrero').addEventListener('click', function () {
    jugador = new Personaje(60, 10, 0, 200);
    imagen = 'IMG/guerrero.png';
    mostrarStats(imagen);
});

document.getElementById('botonOrco').addEventListener('click', function () {
    jugador = new Personaje(40, 30, 0, 200);
    imagen = 'IMG/orco.png';
    mostrarStats(imagen);
});

document.getElementById('back_choose_player').addEventListener('click', () => showScene('choose_player'));

// STATS
function mostrarStats(imagen) {
    showScene('look_stats');
    document.getElementById('chosenImgStats').src = imagen;
    document.getElementById('vida').textContent = jugador.vida;
    document.getElementById('ataque').textContent = jugador.ataque;
    document.getElementById('defensa').textContent = jugador.defensa;
    document.getElementById('puntos').textContent = jugador.puntos;
    document.getElementById('monedas').textContent = jugador.monedas;
}

// MARKET
document.getElementById('ir_market').addEventListener('click', function () {
    const inputNombre = document.getElementById('nombre');
    jugador.nombre = inputNombre.value;
    const nombreJugador = inputNombre.value.trim() || jugador.nombre;
    const monedasJugador = jugador.monedas;

    mostrarMarket(imagen, nombreJugador, monedasJugador);

    const marketItemsDiv = document.getElementById('marketItems');
    marketItemsDiv.textContent = "";

    const purchasedDiv = document.getElementById('purchasedItems');
    purchasedDiv.textContent = "";

    objetos.forEach((obj, index) => {
        const itemDiv = document.createElement('div');
        itemDiv.innerHTML = obj.mostrarInfo();

        // CLICK EN CADA OBJETO
        itemDiv.addEventListener('click', () => {
            if (comprado.has(index)) {
                // Si ya está comprado, lo quitamos y sumamos monedas
                const purchasedItem = comprado.get(index);
                purchasedDiv.removeChild(purchasedItem);
                jugador.monedas += obj.precio;
                document.getElementById('monedasMarket').textContent = jugador.monedas;
                comprado.delete(index);
            } else {
                // Si no está comprado, verificamos monedas y compramos
                if (jugador.monedas >= obj.precio) {
                    jugador.monedas -= obj.precio;
                    document.getElementById('monedasMarket').textContent = jugador.monedas;

                    const purchasedItem = document.createElement('div');
                    purchasedItem.innerHTML = obj.mostrarInfo();
                    purchasedDiv.appendChild(purchasedItem);

                    comprado.set(index, purchasedItem);
                } else {
                    alert("No tienes suficientes monedas para comprar esto.");
                }
            }
        });

        marketItemsDiv.appendChild(itemDiv);
    });
});

function mostrarMarket(imagen, nombre, monedas) {
    showScene('look_market');
    document.getElementById('chosenImgMarket').src = imagen;
    document.getElementById('nombreMarket').textContent = nombre;
    document.getElementById('monedasMarket').textContent = monedas;
}

//PERSONAJE CON TODO
document.getElementById('comprar').addEventListener('click', function () {
    const imagenPersonaje = document.getElementById('chosenImgMarket').src;
    imagen = imagenPersonaje;

    mostrarJugador();

});

function mostrarJugador() {
    showScene('player');

    document.getElementById('playerImg').src = imagen;

    document.getElementById('playerNombre').textContent = jugador.nombre;
    document.getElementById('playerVida').textContent = jugador.vida;
    document.getElementById('playerAtaque').textContent = jugador.ataque;
    document.getElementById('playerDefensa').textContent = jugador.defensa;
    document.getElementById('playerPuntos').textContent = jugador.puntos;
    document.getElementById('playerMonedas').textContent = jugador.monedas;

    const equipDiv = document.getElementById('playerEquipamiento');
    equipDiv.textContent = "";

    comprado.forEach((itemDiv) => {
        const clone = itemDiv.cloneNode(true);
        equipDiv.appendChild(clone);
    });
}
