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

        const rarezas = ["Común", "Rara", "Épica", "Legendaria"];

        const indiceDescuento = Math.floor(Math.random() * rarezas.length);
        const rarezaConDescuento = rarezas[indiceDescuento];

        const indiceObjeto = Math.floor(Math.random() * rarezas.length);
        obj.rareza = rarezas[indiceObjeto];

        let precioFinal = obj.precio;

        if (obj.rareza === rarezaConDescuento) {
            precioFinal = obj.precio * 0.75;
        }

        precioFinal = Math.round(precioFinal);
        obj.precioConDescuento = precioFinal;

        const itemDiv = document.createElement('div');
        itemDiv.innerHTML = `
        ${obj.mostrarInfo()}
        <p><strong>Rareza:</strong> ${obj.rareza}</p>
        <p><strong>Precio:</strong> 
            ${precioFinal < obj.precio
                ? `<span style="text-decoration: line-through;">${obj.precio}</span> 
                   <span style="color: green;">→ ${precioFinal} monedas (-${100 - Math.round(precioFinal * 100 / obj.precio)}%)</span>`
                : `${precioFinal} monedas`
            }
        </p>
<div class="flip-container">
    <div class="flip-card">
        <button class="botonComprar front" data-index="${index}">Comprar</button>
        <button class="botonVender back" data-index="${index}">Vender</button>
    </div>
</div>
        `;

        const botonComprar = itemDiv.querySelector('.botonComprar');
        const botonVender = itemDiv.querySelector('.botonVender');

        botonComprar.addEventListener('click', () => {
            if (comprado.has(index)) return; // ya comprado

            if (jugador.monedas >= obj.precioConDescuento) {
                jugador.monedas -= obj.precioConDescuento;
                document.getElementById('monedasMarket').textContent = jugador.monedas;

                const purchasedItem = document.createElement('div');
                purchasedItem.innerHTML = obj.mostrarInfo();
                purchasedDiv.appendChild(purchasedItem);

                comprado.set(index, purchasedItem);
                objetosComprados.push(obj);

                itemDiv.style.backgroundColor = 'red';

                const flipCard = botonComprar.closest('.flip-card');
                flipCard.classList.add('flipped'); // flip a vender

                const icono = document.createElement('i');
                icono.className = "fa fa-cart-plus cart-anim";
                botonComprar.parentElement.appendChild(icono);
                setTimeout(() => icono.remove(), 800);
            } else {
                alert("No tienes suficientes monedas para comprar esto.");
            }
        });

        botonVender.addEventListener('click', () => {
            if (!comprado.has(index)) return; 

            const purchasedItem = comprado.get(index);
            purchasedDiv.removeChild(purchasedItem);

            jugador.monedas += obj.precioConDescuento;
            document.getElementById('monedasMarket').textContent = jugador.monedas;

            comprado.delete(index);
            itemDiv.style.backgroundColor = '';

            const flipCard = botonVender.closest('.flip-card');
            flipCard.classList.remove('flipped'); 

            const i = objetosComprados.indexOf(obj);
            if (i > -1) objetosComprados.splice(i, 1);
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

document.getElementById('volver_inicio').addEventListener('click', () => {
    location.reload();
});

function mostrarFinal() {
    jugador.imagen = imagen;
    showScene('ranking');
    mostrarRanking(jugador);
}
