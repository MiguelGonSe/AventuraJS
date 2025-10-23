import { Personaje } from './Modules/Personaje.js';
import { Jefe } from './Modules/Jefe.js';
import { objetos } from './Modules/Mercado.js';
import { agruparPorNivel, batalla, mostrarRanking } from './Modules/Ranking.js';
import { showScene } from './Utils/Utils.js';

let jugador;

document.getElementById('btnL').addEventListener('click', function () {
    jugador = new Personaje('Elfo', 50, 20, 0, 200);
    mostrarStats('IMG/legolas.webp');
});

document.getElementById('btnG').addEventListener('click', function () {
    jugador = new Personaje('Guerrero', 60, 10, 0, 200);
    mostrarStats('IMG/guerrero.png');
});

document.getElementById('btnO').addEventListener('click', function () {
    jugador = new Personaje('Orco', 40, 30, 0, 200);
    mostrarStats('IMG/orco.png');
});

document.getElementById('back_choose_player').addEventListener('click', function () {
    document.getElementById('choose_player').classList.remove('scene');
    document.getElementById('choose_player').classList.add('scene_active');
    document.getElementById('look_stats').classList.remove('scene_active');
    document.getElementById('look_stats').classList.add('scene');
});

function mostrarStats(imagen) {
    document.getElementById('choose_player').classList.remove('scene_active');
    document.getElementById('choose_player').classList.add('scene');
    document.getElementById('look_stats').classList.remove('scene');
    document.getElementById('look_stats').classList.add('scene_active');
    
    document.getElementById('chosenImg').src = imagen;

    document.getElementById('vida').textContent = jugador.vida;
    document.getElementById('ataque').textContent = jugador.ataque;
    document.getElementById('defensa').textContent = jugador.defensa;
    document.getElementById('puntos').textContent = jugador.puntos;
}

function mostrarMarket() {

}

// const jugador = new Personaje('Elfo', 60, 10, 0, 200);
// jugador.añadirProducto(objetos[0]);

// const jugadores = [jugador, jugador2, jugador3];
// const jefe = new Jefe('Dragón', 50, 50, 300, 'Fuego Infernal');


// console.log(jugador.mostrarPersonaje());
// console.log(jefe.presentar());
// console.log(jefe.usarHabilidad());


// console.log(batalla(jugador, jefe));

// console.log("🎖 Clasificación por nivel");
// console.log(agruparPorNivel(jugadores, 40));

// console.log(mostrarRanking(jugadores));