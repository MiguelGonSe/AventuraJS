import { groupBy } from "../Utils/Utils.js";

export function batalla(jugador, enemigo) {
    let vidaJugador = jugador.vida;
    let vidaEnemigo = enemigo.vida;

    const danioJugador = jugador.ataqueTotal;
    const danioEnemigo = enemigo.ataque;

    console.log(`⚔️ ¡Comienza la batalla entre ${jugador.nombre} y ${enemigo.nombre}!`);
    let ronda = 1;

    while (vidaJugador > 0 && vidaEnemigo > 0) {
        console.log(`\n🩸 RONDA ${ronda}`);

        vidaEnemigo -= danioJugador;
        console.log(`${jugador.nombre} ataca y deja a ${enemigo.nombre} con ${Math.max(vidaEnemigo, 0)} de vida`);

        if (vidaEnemigo <= 0) break;

        vidaJugador -= danioEnemigo;
        console.log(`${enemigo.nombre} contraataca y deja a ${jugador.nombre} con ${Math.max(vidaJugador, 0)} de vida`);

        ronda++;
    }

    if (vidaEnemigo <= 0) {
        jugador.puntos += 10;
        jugador.vida = vidaJugador + 50;
        console.log(`\n🏆 ${jugador.nombre} ha ganado la batalla. (+10 puntos, +50 vida)`);
        return `· ${jugador.nombre} [${vidaJugador} vida] vs ${enemigo.nombre} [${Math.max(vidaEnemigo, 0)} vida] - 🏆 Ganador: ${jugador.nombre} | +${jugador.puntos} pts`;
    } else {
        console.log(`\n💀 ${enemigo.nombre} ha ganado la batalla.`);
        return `· ${jugador.nombre} [${Math.max(vidaJugador, 0)} vida] vs ${enemigo.nombre} [${vidaEnemigo} vida] - ❌ Ganador: ${enemigo.nombre} | ${jugador.puntos} pts ¡HAS PERDIDO!`;
    }
}

export function agruparPorNivel(jugadores, umbral) {
    return groupBy(
        jugadores,
        jugador => (jugador.puntos >= umbral ? 'pro' : 'rookie')
    );
}

export function mostrarRanking(jugadores) {
    const ordenados = jugadores.slice().sort((a, b) => b.puntos - a.puntos);
    console.log("🏆 RANKING FINAL 🏆");
    ordenados.forEach(jugador => {
        console.log(jugador.mostrarJugador());
    });
}