import { groupBy } from "../Utils/Utils.js";

/**
 * Simula un combate por turnos entre el jugador y un enemigo estándar.
 */
export function batalla(jugador, enemigo) {
    let vidaJugador = jugador.vidaFinal ?? jugador.vida;
    let vidaEnemigo = enemigo.vida;

    const danioJugador = jugador.ataqueFinal ?? jugador.ataque;
    const danioEnemigo = enemigo.ataque;

    let ronda = 1;
    let resultadoHTML = `<h3>⚔️ ${jugador.nombre} vs ${enemigo.nombre}</h3>`;

    while (vidaJugador > 0 && vidaEnemigo > 0) {

        const danioRealJugador = Math.max(1, danioJugador - (enemigo.defensa ?? 0) / 2);

        const defensaJugador = jugador.defensaFinal ?? jugador.defensa;
        const danioRealEnemigo = Math.max(1, danioEnemigo - defensaJugador / 2);
        // --------------------------

        resultadoHTML += `
          <div class="ronda">
            <strong>🩸 Ronda ${ronda}</strong><br>
            <span class="ataque_jugador">${jugador.nombre} inflige ${danioRealJugador} de daño a ${enemigo.nombre}.</span><br>
        `;

        vidaEnemigo -= danioRealJugador;

        if (vidaEnemigo <= 0) {
            vidaEnemigo = 0;
            resultadoHTML += `<span>${enemigo.nombre} ha caído.</span></div>`;
            break;
        }

        resultadoHTML += `<span class="ataque_enemigo">${enemigo.nombre} inflige ${danioRealEnemigo} de daño a ${jugador.nombre}.</span></div>`;
        vidaJugador -= danioRealEnemigo;
        ronda++;
    }

    if (vidaEnemigo <= 0) {
        const puntosGanados = 100 + enemigo.ataque;
        jugador.puntos += puntosGanados;
        jugador.vida += 100;

        jugador.dinero += 5;
        const puntosTotal = jugador.puntos + jugador.dinero + puntosGanados; 
        resultadoHTML += `<h4>🏆 ${jugador.nombre} ha ganado (${puntosTotal} pts, +5 monedas y salud + 100</h4>`;
    } else {
        resultadoHTML += `<h4>💀 ${enemigo.nombre} ha ganado. ¡Has perdido!</h4>`;
    }

    return resultadoHTML;
}

/**
 * Simula el combate final contra un Jefe.
 */
export function batallaJefe(jugador, jefe) {
    let vidaJugador = jugador.vidaFinal ?? jugador.vida;
    let vidaJefe = jefe.vida;

    const danioJugador = jugador.ataqueFinal ?? jugador.ataque; 
    const danioJefe = jefe.ataque;

    let ronda = 1;
    let resultadoHTML = `<h3>⚔️ ${jugador.nombre} vs ${jefe.nombre}</h3>`;

    while (vidaJugador > 0 && vidaJefe > 0) {
        const danioRealJugador = Math.max(1, danioJugador - (jefe.defensa ?? 0) / 2);

        // --- 🔴 CORRECCIÓN AQUÍ TAMBIÉN ---
        const defensaJugador = jugador.defensaFinal ?? jugador.defensa;
        const danioRealJefe = Math.max(1, danioJefe - defensaJugador / 2);
        // ----------------------------------

        resultadoHTML += `
          <div class="ronda">
            <strong>🩸 Ronda ${ronda}</strong><br>
            <span class="ataque_jugador">${jugador.nombre} inflige ${danioRealJugador} de daño a ${jefe.nombre}.</span><br>
        `;

        vidaJefe -= danioRealJugador;

        if (vidaJefe <= 0) {
            vidaJefe = 0;
            resultadoHTML += `<span>${jefe.nombre} ha caído.</span></div>`;
            break;
        }

        resultadoHTML += `<span class="ataque_enemigo">${jefe.nombre} inflige ${danioRealJefe} de daño a ${jugador.nombre}.</span></div>`;
        vidaJugador -= danioRealJefe;
        ronda++;
    }

    if (vidaJefe <= 0) {
        const puntosGanados = (100 + jefe.ataque) * (jefe.multiplicador ?? 1);
        jugador.puntos += puntosGanados;
        jugador.dinero += 10;
        const puntosTotal = jugador.puntos + jugador.dinero + puntosGanados; // Corregido variable local
        resultadoHTML += `<h4>🏆 ${jugador.nombre} ha ganado el juego (${puntosTotal} pts) y ha ganado 10 monedas, ENHORABUENA</h4>`;
    } else {
        resultadoHTML += `<h4>💀 ${jefe.nombre} ha ganado. ¡Has perdido!</h4>`;
    }

    return resultadoHTML;
}

export function mostrarRanking(jugador) {
    const rankingDiv = document.getElementById('ranking_final');

    rankingDiv.innerHTML = `
        <h2>🏆 RANKING FINAL 🏆</h2>
        <img src="${jugador.imagen}" alt="Jugador" width="150"><br>
    `;

    let mensaje = '';
    let lanzarConfetti = false;

    if (jugador.puntos === 0) {
        mensaje = 'Eres un noob';
    } else if (jugador.puntos > 0 && jugador.puntos < 200) {
        mensaje = 'Eres un jugador normalito';
        lanzarConfetti = true;
    } else if (jugador.puntos >= 200) {
        mensaje = 'Eres un pro';
        lanzarConfetti = true;
    } else {
        mensaje = `Tienes ${jugador.puntos} puntos.`;
    }

    const resultado = document.createElement('p');
    resultado.textContent = `${jugador.nombre}: ${jugador.puntos} puntos - ${mensaje}`;

    rankingDiv.appendChild(resultado);

    if (lanzarConfetti && window.confetti) {
        confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 }
        });
    }
}