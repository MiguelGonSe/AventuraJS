/**
 * @fileoverview Script principal que orquesta la lógica del juego.
 * Maneja la navegación entre "escenas", la selección de personajes,
 * el sistema de mercado (compra/venta), y la ejecución de batallas.
 * * Integra animaciones con GSAP y ScrollTrigger.
 */

import { Personaje } from './Modules/Personaje.js';
import { Enemigo } from './Modules/Enemigo.js';
import { Jefe } from './Modules/Jefe.js';
import { objetos } from './Modules/Mercado.js';
import { batallaJefe, batalla, mostrarRanking } from './Modules/Ranking.js';
import { showScene, formatearDinero } from './Utils/Utils.js';

gsap.registerPlugin(ScrollTrigger);

let jugador;
let imagen = "";
const comprado = new Map();
const objetosComprados = [];
const caballero = new Enemigo('Caballero', 5, 5, 35);
const boss = new Jefe('Boss', 20, 20, 100, 'Fuego Letal');

// ELECCIÓN DE JUGADOR
document.getElementById('botonTroll').addEventListener('click', function () {
    jugador = new Personaje(0, 0, 0, 100, 10);
    imagen = 'IMG/troll.png';
    mostrarStats(imagen);
});

document.getElementById('botonOrco').addEventListener('click', function () {
    jugador = new Personaje(0, 0, 0, 100, 10);
    imagen = 'IMG/orco.png';
    mostrarStats(imagen);
});

document.getElementById('botonFantasma').addEventListener('click', function () {
    jugador = new Personaje(0, 0, 0, 100, 10);
    imagen = 'IMG/fantasma.png';
    mostrarStats(imagen);
});

document.getElementById('back_choose_player').addEventListener('click', () => showScene('choose_player'));

// STATS
/**
 * Muestra la escena de estadísticas iniciales del personaje recién creado.
 * Actualiza el DOM con los valores base del objeto `jugador`.
 *
 * @param {string} imagen - Ruta de la imagen del personaje a mostrar.
 */
function mostrarStats(imagen) {
    showScene('look_stats');
    document.getElementById('chosenImgStats').src = imagen;

    let ataqueTotal = jugador.ataque;
    let defensaTotal = jugador.defensa;
    let vidaTotal = jugador.vida;
    let phabilidadTotal = jugador.phabilidad;

    const actualizarBotones = () => {
        document.getElementById('vida').textContent = vidaTotal;
        document.getElementById('ataque').textContent = ataqueTotal;
        document.getElementById('defensa').textContent = defensaTotal;
        document.getElementById('phabilidad').textContent = phabilidadTotal;
        document.getElementById("puntos").textContent = jugador.puntos;
        document.getElementById("dinero").textContent = jugador.dinero;

        jugador.vida = vidaTotal;
        jugador.ataque = ataqueTotal;
        jugador.defensa = defensaTotal;
        jugador.phabilidad = phabilidadTotal;
    };

    document.getElementById('sumaVida').onclick = () => {
        if (phabilidadTotal > 0) {
            vidaTotal++;
            phabilidadTotal--;
            actualizarBotones();
        }
    };
    document.getElementById('sumaAtaque').onclick = () => {
        if (phabilidadTotal > 0) {
            ataqueTotal++;
            phabilidadTotal--;
            actualizarBotones();
        }
    };
    document.getElementById('sumaDefensa').onclick = () => {
        if (phabilidadTotal > 0) {
            defensaTotal++;
            phabilidadTotal--;
            actualizarBotones();
        }
    };

    document.getElementById('restaVida').onclick = () => {
        if (vidaTotal > 100) {
            vidaTotal--;
            phabilidadTotal++;
            actualizarBotones();
        }
    };
    document.getElementById('restaAtaque').onclick = () => {
        if (ataqueTotal > 0) {
            ataqueTotal--;
            phabilidadTotal++;
            actualizarBotones();
        }
    };
    document.getElementById('restadefensa').onclick = () => {
        if (defensaTotal > 0) {
            defensaTotal--;
            phabilidadTotal++;
            actualizarBotones();
        }
    };
    actualizarBotones();
}

// MARKET
document.getElementById('ir_market').addEventListener('click', function () {

    const inputNombre = document.getElementById('nombre');
    jugador.nombre = inputNombre.value;

    const nombreJugador = inputNombre.value.trim() || jugador.nombre;

    function capitalizarPrimeraLetra(nombreJugador) {
        return nombreJugador.charAt(0).toUpperCase() + nombreJugador.slice(1);
    }

    if (!inputNombre.checkValidity()) {
        inputNombre.reportValidity();
        return;
    }

    if (inputNombre.value.trim().length < 2) {
        alert('Nombre de usuario no válido');
        location.reload();
    }

    const monedasJugador = jugador.dinero;

    mostrarMarket(imagen, capitalizarPrimeraLetra(nombreJugador), monedasJugador);

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
                ? `<span style="text-decoration: line-through;">${obj.formatearPrecio(obj.precioBase)}</span> 
                   
                   <span style="color: green;">→ ${obj.formatearPrecio(precioFinal)} (-${100 - Math.round(precioFinal * 100 / obj.precioBase)}%)</span>`

                : `<span>${obj.formatearPrecio(precioFinal)}</span>`
            }
        </h2>
        <div class="card-boton">
            <button class="front botonComprar" data-index="${index}">Comprar</button>
            <button class="back botonVender" data-index="${index}">Retirar</button>
        </div>
        `;

        const botonComprar = itemDiv.querySelector('.botonComprar');
        const botonVender = itemDiv.querySelector('.botonVender');

        botonComprar.addEventListener('click', () => {
            if (comprado.has(index)) return; // ya comprado

            if (jugador.dinero >= obj.precioConDescuento) {
                jugador.dinero -= obj.precioConDescuento;
                document.getElementById('monedasMarket').textContent = jugador.dinero;

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

            jugador.dinero += obj.precioConDescuento;
            document.getElementById('monedasMarket').textContent = jugador.dinero;

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

/**
 * Configura la vista del mercado con la información del jugador.
 *
 * @param {string} imagen - Avatar del jugador.
 * @param {string} nombre - Nombre introducido.
 * @param {number} dinero - Saldo actual.
 */
function mostrarMarket(imagen, nombre, dinero) {
    showScene('look_market');
    document.getElementById('chosenImgMarket').src = imagen;
    document.getElementById('nombreMarket').textContent = nombre;
    document.getElementById('monedasMarket').textContent = formatearDinero(dinero);
}

//PERSONAJE CON TODO
document.getElementById('comprar').addEventListener('click', function () {
    const imagenPersonaje = document.getElementById('chosenImgMarket').src;
    imagen = imagenPersonaje;

    mostrarJugador();
});

/**
 * Calcula y muestra las estadísticas totales del jugador sumando base + items comprados.
 * Renderiza la lista de equipamiento.
 */
function mostrarJugador() {
    showScene('player');

    let ataqueCalc = jugador.ataque;
    let defensaCalc = jugador.defensa;
    let vidaCalc = jugador.vida;

    objetosComprados.forEach(obj => {
        ataqueCalc += obj.bonus.ataque || 0;
        defensaCalc += obj.bonus.defensa || 0;
        vidaCalc += obj.bonus.vida || 0;
    });

    jugador.ataqueFinal = ataqueCalc;
    jugador.defensaFinal = defensaCalc;
    jugador.vidaFinal = vidaCalc;

    document.getElementById('playerImg').src = imagen;
    document.getElementById('playerNombre').textContent = jugador.nombre;
    document.getElementById('playerVida').textContent = vidaCalc;
    document.getElementById('playerAtaque').textContent = ataqueCalc;
    document.getElementById('playerDefensa').textContent = defensaCalc;
    document.getElementById('playerPuntos').textContent = jugador.puntos;
    document.getElementById('playerMonedas').textContent = jugador.dinero;

    localStorage.setItem('playerNombre', jugador.nombre);
    localStorage.setItem('playerPuntos', jugador.puntos);
    localStorage.setItem('playerMonedas', jugador.dinero);

    const equipDiv = document.getElementById('playerEquipamiento');
    equipDiv.textContent = "";

    objetosComprados.forEach(obj => {
        const div = document.createElement('div');
        div.innerHTML = obj.mostrarInfo();
        equipDiv.appendChild(div);
    });
}

//VER A LOS ENEMIGOS 
/**
 * Muestra la pantalla de información de los enemigos (Caballero y Boss).
 * Rellena los datos estáticos definidos en las instancias globales.
 */
document.getElementById('verALosEnemigos').addEventListener('click', function () {
    verEnemigos();
})

function verEnemigos() {
    showScene('verEnemigo');

    document.getElementById('prevNombreEnemigo').textContent = caballero.nombre;
    document.getElementById('prevVidaEnemigo').textContent = caballero.vida;
    document.getElementById('prevAtaqueEnemigo').textContent = caballero.ataque;

    // Rellenamos los datos del Jefe en el HTML
    document.getElementById('prevNombreJefe').textContent = boss.nombre;
    document.getElementById('prevVidaJefe').textContent = boss.vida;
    document.getElementById('prevAtaqueJefe').textContent = boss.ataque;
}

//BATALLA ENEMIGO
document.getElementById('empezar').addEventListener('click', function () {
    const imagenPersonaje = document.getElementById('chosenImgMarket').src;
    imagen = imagenPersonaje;
    mostrarBatalla();
});

/**
 * Inicia la batalla contra el enemigo estándar (Caballero).
 * Aplica animaciones CSS de entrada y ejecuta la lógica del combate.
 */
function mostrarBatalla() {
    showScene('enemigo');

    document.getElementById('playerImagen').src = imagen;
    document.getElementById('enemigoImagen').src = "IMG/caballero.png";

    const p = document.getElementById('playerImagen');
    const e = document.getElementById('enemigoImagen');

    p.style.animation = 'entrarJugador 0.8s forwards'; // Mantener en posicion final
    e.style.animation = 'entrarEnemigo 0.8s forwards';

    const resultadoHTML = batalla(jugador, caballero);
    const logicaBatallaDiv = document.getElementById('logicaBatalla');
    logicaBatallaDiv.innerHTML = resultadoHTML;

    localStorage.setItem('playerNombre', jugador.nombre);
    localStorage.setItem('playerPuntos', jugador.puntos);
    localStorage.setItem('playerMonedas', jugador.dinero);
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

    const resultadoHTML = batallaJefe(jugador, boss);
    const logicaBatallaDiv = document.getElementById('logicaBatallaJefe');
    logicaBatallaDiv.innerHTML = resultadoHTML;
    localStorage.setItem('playerNombre', jugador.nombre);
    localStorage.setItem('playerPuntos', jugador.puntos);
    localStorage.setItem('playerMonedas', jugador.dinero);
}

document.getElementById('fin').addEventListener('click', function () {
    mostrarFinal();
});

document.getElementById('volver_inicio').addEventListener('click', () => {
    location.reload();
});

document.getElementById('verRanking').addEventListener('click', () => {
    const playerNombre = localStorage.getItem("jugador.nombre");
    const playerPuntos = localStorage.getItem("jugador.puntos");
    const playerMonedas = localStorage.getItem("jugador.dinero");

    console.log(localStorage.getItem("playerNombre"));
    console.log(localStorage.getItem("playerPuntos"));
    console.log(localStorage.getItem("playerMonedas"));
});

/**
 * Muestra la pantalla de ranking final.
 * Pasa los datos finales del jugador a la función importada `mostrarRanking`.
 */
function mostrarFinal() {
    jugador.imagen = imagen;
    showScene('ranking');
    mostrarRanking(jugador);
}

document.getElementById('ir_final').addEventListener('click', () => {
    showScene('rankingVerificacion');

    const nombre = localStorage.getItem('playerNombre') || jugador.nombre;
    const puntos = localStorage.getItem('playerPuntos') || jugador.puntos;
    const monedas = localStorage.getItem('playerMonedas') || jugador.dinero;

    document.getElementById('tablaNombre').textContent = nombre;
    document.getElementById('tablaPuntos').textContent = puntos;
    document.getElementById('tablaMonedas').textContent = monedas;
});

const monedero = document.getElementById('monederoImagen');
monedero.style.animation = 'entrarMonedero 0.8s forwards';

const moneda1 = document.getElementById('moneda1');
moneda1.style.animation = 'bajarMoneda 5s linear forwards';
const moneda2 = document.getElementById('moneda2');
moneda2.style.animation = 'bajarMoneda 5s linear forwards';
const moneda3 = document.getElementById('moneda3');
moneda3.style.animation = 'bajarMoneda 5s linear forwards';
