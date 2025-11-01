import { Personaje } from './Modules/Personaje.js';
import { Enemigo } from './Modules/Enemigo.js';
import { Jefe } from './Modules/Jefe.js';
import { objetos } from './Modules/Mercado.js';
import { batallaJefe, batalla, mostrarRanking } from './Modules/Ranking.js';
import { showScene } from './Utils/Utils.js';

let jugador;
let imagen = "";
const comprado = new Map();
const objetosComprados = [];

// ELECCIÓN DE JUGADOR
document.getElementById('botonElfo').addEventListener('click', function () {
    jugador = new Personaje(80, 50, 0, 300);
    imagen = 'IMG/legolas.webp';
    mostrarStats(imagen);
});

document.getElementById('botonGuerrero').addEventListener('click', function () {
    jugador = new Personaje(90, 40, 0, 300);
    imagen = 'IMG/guerrero.png';
    mostrarStats(imagen);
});

document.getElementById('botonOrco').addEventListener('click', function () {
    jugador = new Personaje(70, 60, 0, 350);
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
                itemDiv.style.backgroundColor = '';

                const i = objetosComprados.indexOf(obj); // ELIMINAR
                if (i > -1) objetosComprados.splice(i, 1);

            } else {
                // Si no está comprado, verificamos monedas y compramos
                if (jugador.monedas >= obj.precio) {
                    jugador.monedas -= obj.precio;
                    document.getElementById('monedasMarket').textContent = jugador.monedas;

                    const purchasedItem = document.createElement('div');
                    purchasedItem.innerHTML = obj.mostrarInfo();
                    purchasedDiv.appendChild(purchasedItem);

                    comprado.set(index, purchasedItem);
                    objetosComprados.push(obj);

                    itemDiv.style.backgroundColor = 'red';
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

    let ataqueTotal = jugador.ataque;
    let defensaTotal = jugador.defensa;
    let vidaTotal = jugador.vida;

    objetosComprados.forEach(obj => {
        ataqueTotal += obj.bonus.ataque || 0;
        defensaTotal += obj.bonus.defensa || 0;
        vidaTotal += obj.bonus.vida || 0;
    });

    document.getElementById('playerImg').src = imagen;
    document.getElementById('playerNombre').textContent = jugador.nombre;
    document.getElementById('playerVida').textContent = vidaTotal;
    document.getElementById('playerAtaque').textContent = ataqueTotal;
    document.getElementById('playerDefensa').textContent = defensaTotal;
    document.getElementById('playerPuntos').textContent = jugador.puntos;
    document.getElementById('playerMonedas').textContent = jugador.monedas;

    const equipDiv = document.getElementById('playerEquipamiento');
    equipDiv.textContent = "";

    objetosComprados.forEach(obj => {
        const div = document.createElement('div');
        div.innerHTML = obj.mostrarInfo();
        equipDiv.appendChild(div);
    });
}

//BATALLA ENEMIGO
document.getElementById('empezar').addEventListener('click', function () {
    const imagenPersonaje = document.getElementById('chosenImgMarket').src;
    imagen = imagenPersonaje;
    mostrarBatalla();
});

function mostrarBatalla() {
    showScene('enemigo');
    document.getElementById('playerImagen').src = imagen;

    const enemigo = new Enemigo('Minotauro', 50, 25, 200);

    const resultadoHTML = batalla(jugador, enemigo);

    const logicaBatallaDiv = document.getElementById('logicaBatalla');
    logicaBatallaDiv.innerHTML = resultadoHTML;
}

//BATALLA JEFE
document.getElementById('finEnemigo').addEventListener('click', function () {
    const imagenPersonaje = document.getElementById('chosenImgMarket').src;
    imagen = imagenPersonaje;
    mostrarBatallaJefe();
});

function mostrarBatallaJefe() {
    showScene('jefe');
    document.getElementById('playerJugadorImagen').src = imagen;

    const jefe = new Jefe('Dragon', 100, 50, 300, 'Fuego Letal');

    const resultadoHTML = batallaJefe(jugador, jefe);

    const logicaBatallaDiv = document.getElementById('logicaBatallaJefe');
    logicaBatallaDiv.innerHTML = resultadoHTML;
}

document.getElementById('fin').addEventListener('click', function () {
    mostrarFinal();
});

document.getElementById('volver_inicio').addEventListener('click', () => showScene('choose_player'));

function mostrarFinal() {
    jugador.imagen = imagen;
    showScene('ranking');
    mostrarRanking(jugador);
}