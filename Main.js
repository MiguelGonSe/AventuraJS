import { Personaje } from './Modules/Personaje.js';
import { Enemigo } from './Modules/Enemigo.js';
import { Jefe } from './Modules/Jefe.js';
import { objetos } from './Modules/Mercado.js';
import { batallaJefe, batalla, mostrarRanking } from './Modules/Ranking.js';
import { showScene } from './Utils/Utils.js';

gsap.registerPlugin(ScrollTrigger);

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

        obj.rarezaMarket = obj.rareza;
        let precioFinal = obj.precioBase;

        if (obj.rarezaMarket === rarezaConDescuento) {
            precioFinal = obj.precioBase * 0.75;
        }

        precioFinal = Math.round(precioFinal);
        obj.precioConDescuento = precioFinal;

        const itemDiv = document.createElement('div');
        itemDiv.innerHTML = `
        ${obj.mostrarInfo()}
        <h2><strong>Rareza:</strong> <span>${obj.rarezaMarket}</span></h2>
        <h2><strong>Precio:</strong> 
        ${precioFinal < obj.precioBase
                ? `<span style="text-decoration: line-through;">${obj.precioBase}</span> 
       <span style="color: green;">→ ${precioFinal} monedas (-${100 - Math.round(precioFinal * 100 / obj.precioBase)}%)</span>`
                : `<span>${precioFinal}</span> monedas`
            }
        </h2>
<div class="card-boton">
    <button class="front botonComprar" data-index="${index}">Comprar</button>
    <button class="back botonVender" data-index="${index}">Vender</button>
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

                itemDiv.style.backgroundColor = '#9a0000';

                botonComprar.parentElement.classList.add("flipped");

                const icono = document.createElement('i');
                icono.className = "fa fa-cart-plus cart-anim";
                itemDiv.appendChild(icono);
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

            const i = objetosComprados.indexOf(obj);
            if (i > -1) objetosComprados.splice(i, 1);

            botonVender.parentElement.classList.remove("flipped");
        });

        marketItemsDiv.appendChild(itemDiv);
    });

    gsap.to("#marketItems > div", { //Selecciona los div dentro de marketItems
        scrollTrigger: {
            trigger: "#look_market",
            start: "top 20%",
            end: "bottom bottom",
            scrub: 1,
            markers: false
        },
        opacity: 1,
        y: 0,
        duration: 1.5,
        ease: "bounce.out",
        stagger: 0.18
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
    document.getElementById('enemigoImagen').src = "IMG/minotauro.webp";

    const p = document.getElementById('playerImagen');
    const e = document.getElementById('enemigoImagen');

    p.style.animation = 'entrarJugador 0.8s forwards'; // Mantener en posicion final
    e.style.animation = 'entrarEnemigo 0.8s forwards';

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

    const p = document.getElementById('playerJugadorImagen');
    const j = document.getElementById('jefeImagen');

    p.style.animation = 'entrarJugador 0.8s forwards';
    j.style.animation = 'entrarJefe 0.8s forwards';

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
