/**
 * @fileoverview Script principal que orquesta la lógica del juego.
 * Maneja la navegación entre "escenas", la selección de personajes,
 * el sistema de mercado (compra/venta), y la ejecución de batallas.
 */

import { Personaje } from './Modules/Personaje.js';
import { Enemigo } from './Modules/Enemigo.js';
import { Jefe } from './Modules/Jefe.js';
import { objetos } from './Modules/Mercado.js';
import { batallaJefe, batalla, mostrarRanking } from './Modules/Ranking.js';
import { showScene, formatearDinero } from './Utils/Utils.js';

let jugador;
let imagen = "";
const comprado = new Map();
const objetosComprados = [];
const barbanegra = new Enemigo('Barbanegra', 25, 25, 150);
const sakazuki = new Enemigo('Sakazuki', 35, 35, 175);
const imu = new Jefe('Imu', 50, 50, 220, 'Fuego Letal');

function actualizarMonederoVisual() {
    // Busca el span del footer
    const footerDinero = document.getElementById('dinero-footer');

    // Si el jugador existe, actualizamos el texto
    if (jugador && footerDinero) {
        footerDinero.textContent = jugador.dinero; // O usa formatearDinero(jugador.dinero) si prefieres la K

        // Efecto visual de parpadeo cuando cambia el dinero
        const monederoImg = document.getElementById('monederoImagen');
        monederoImg.style.transform = "scale(1.3)";
        setTimeout(() => monederoImg.style.transform = "scale(1)", 200);
    }
}


// ELECCIÓN DE JUGADOR
document.getElementById('botonLuffy').addEventListener('click', function () {
    jugador = new Personaje(0, 0, 0, 100, 10);
    imagen = 'IMG/Luffy.webp';
    mostrarStats(imagen);
});

document.getElementById('botonAce').addEventListener('click', function () {
    jugador = new Personaje(0, 0, 0, 100, 10);
    imagen = 'IMG/Ace.webp';
    mostrarStats(imagen);
});

document.getElementById('botonSabo').addEventListener('click', function () {
    jugador = new Personaje(0, 0, 0, 100, 10);
    imagen = 'IMG/Sabo.webp';
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

        actualizarMonederoVisual();
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
    const valorNombre = inputNombre.value.trim(); // Quitamos espacios sobrantes

    const regexValidacion = /^[A-ZÁÉÍÓÚÑ][a-zA-ZÁÉÍÓÚáéíóúÑñ\s]{2,19}$/;

    // 1. Validar que no esté vacío
    if (!valorNombre) {
        alert('Por favor, ingresa un nombre.');
        return;
    }

    // 2. Validar contra la expresión regular
    if (!regexValidacion.test(valorNombre)) {
        alert('Error: El nombre debe comenzar con mayúscula, tener entre 3 y 20 caracteres y solo contener letras/espacios.');
        inputNombre.focus();
        return;
    }

    jugador.nombre = valorNombre;

    const monedasJugador = jugador.dinero;
    mostrarMarket(imagen, jugador.nombre, monedasJugador);

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
                actualizarMonederoVisual();

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
            actualizarMonederoVisual();

            comprado.delete(index);
            itemDiv.style.backgroundColor = '';

            const i = objetosComprados.indexOf(obj);
            if (i > -1) objetosComprados.splice(i, 1);

            botonVender.parentElement.classList.remove("flipped");
        });

        marketItemsDiv.appendChild(itemDiv);
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
    actualizarMonederoVisual();
}

//VER A LOS ENEMIGOS 
/**
 * Muestra la pantalla de información de los enemigos (Barbanegra y Imu).
 * Rellena los datos estáticos definidos en las instancias globales.
 */
document.getElementById('verALosEnemigos').addEventListener('click', function () {
    verEnemigos();
})

function verEnemigos() {
    showScene('verEnemigo');

    document.getElementById('prevNombreEnemigoA').textContent = barbanegra.nombre;
    document.getElementById('prevVidaEnemigoA').textContent = barbanegra.vida;
    document.getElementById('prevAtaqueEnemigoA').textContent = barbanegra.ataque;

    document.getElementById('prevNombreEnemigoB').textContent = sakazuki.nombre;
    document.getElementById('prevVidaEnemigoB').textContent = sakazuki.vida;
    document.getElementById('prevAtaqueEnemigoB').textContent = sakazuki.ataque;

    // Rellenamos los datos del Jefe en el HTML
    document.getElementById('prevNombreJefe').textContent = imu.nombre;
    document.getElementById('prevVidaJefe').textContent = imu.vida;
    document.getElementById('prevAtaqueJefe').textContent = imu.ataque;
}

//BATALLA ENEMIGO
document.getElementById('empezar').addEventListener('click', function () {
    const imagenPersonaje = document.getElementById('chosenImgMarket').src;
    imagen = imagenPersonaje;
    mostrarBatalla();
});

/**
 * Inicia la batalla contra el enemigo estándar (Barbanegra).
 * Aplica animaciones CSS de entrada y ejecuta la lógica del combate.
 */
function mostrarBatalla() {
    showScene('enemigo');

    document.getElementById('playerImagen').src = imagen;
    document.getElementById('enemigoImagen').src = "IMG/Barbanegra.webp";

    const p = document.getElementById('playerImagen');
    const e = document.getElementById('enemigoImagen');

    p.style.animation = 'entrarJugador 0.8s forwards'; // Mantener en posicion final
    e.style.animation = 'entrarEnemigo 0.8s forwards';

    const resultadoHTML = batalla(jugador, barbanegra);
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

    const resultadoHTML = batallaJefe(jugador, imu);
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

// SISTEMA DE RANKING Y FINAL

document.getElementById('ir_final').addEventListener('click', () => {
    showScene('rankingVerificacion');

    // 1. Recopilar datos del jugador actual
    const nuevoRegistro = {
        nombre: jugador.nombre,
        puntos: jugador.puntos,
        monedas: jugador.dinero
    };

    //Obtener el array existente del LocalStorage
    let rankingGlobal = JSON.parse(localStorage.getItem('aventuraJsRanking')) || [];

    //Añadir al jugador actual al array
    rankingGlobal.push(nuevoRegistro);

    //Ordenar el array por Puntos (de mayor a menor)
    rankingGlobal.sort((a, b) => b.puntos - a.puntos);

    //Guardar el array actualizado en LocalStorage
    localStorage.setItem('aventuraJsRanking', JSON.stringify(rankingGlobal));

    //Pintar la tabla en el HTML
    const tbody = document.getElementById('rankingBody');
    tbody.innerHTML = ""; 

    rankingGlobal.forEach((registro, index) => {
        const fila = document.createElement('tr');

        if (registro.nombre === jugador.nombre && registro.puntos === jugador.puntos) {
            fila.style.border = "2px solid var(--color-primary)";
            fila.style.fontWeight = "bold";
        }

        fila.innerHTML = `
            <td>${index + 1}</td>
            <td>${registro.nombre}</td>
            <td>${registro.puntos}</td>
            <td>${formatearDinero(registro.monedas)}</td>
        `;
        tbody.appendChild(fila);
    });
});

const monedero = document.getElementById('contenedor-monedero');
monedero.style.animation = 'entrarMonedero 0.8s forwards';

// const moneda1 = document.getElementById('moneda1');
// moneda1.style.animation = 'bajarMoneda 5s linear forwards';
// const moneda2 = document.getElementById('moneda2');
// moneda2.style.animation = 'bajarMoneda 5s linear forwards';
// const moneda3 = document.getElementById('moneda3');
// moneda3.style.animation = 'bajarMoneda 5s linear forwards';
