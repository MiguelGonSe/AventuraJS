import { groupBy } from "../Utils/Utils.js";

/**
 * Simula un combate por turnos entre el jugador y un enemigo estándar.
 * Calcula el daño basándose en ataque y defensa, actualiza la vida y genera un reporte HTML.
 *
 * NOTA: Esta función muta el estado del jugador (puntos y vida) si gana.
 *
 * @param {Personaje} jugador - La instancia del personaje principal.
 * @param {Enemigo} enemigo - El enemigo contra el que se combate.
 * @returns {string} Código HTML que describe ronda por ronda lo sucedido en la batalla.
 */

export function batalla(jugador, enemigo) {
    let vidaJugador = jugador.vidaTotal ?? jugador.vida;
    let vidaEnemigo = enemigo.vida;

    const danioJugador = jugador.ataqueTotal ?? jugador.ataque;
    const danioEnemigo = enemigo.ataque;

    let ronda = 1;
    let resultadoHTML = `<h3>⚔️ ${jugador.nombre} vs ${enemigo.nombre}</h3>`;

    while (vidaJugador > 0 && vidaEnemigo > 0) {
        const danioRealJugador = Math.max(1, danioJugador - (enemigo.defensa ?? 0) / 2);
        const danioRealEnemigo = Math.max(1, danioEnemigo - (jugador.defensaTotal ?? jugador.defensa) / 2);

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
        jugador.vida = vidaJugador + 100;
        resultadoHTML += `<h4>🏆 ${jugador.nombre} ha ganado (${puntosGanados} pts y +100 vida)</h4>`;
    } else {
        resultadoHTML += `<h4>💀 ${enemigo.nombre} ha ganado. ¡Has perdido!</h4>`;
    }

    return resultadoHTML;
}
/**
 * Simula el combate final contra un Jefe.
 * Funciona de manera similar a `batalla` pero incluye lógica de fin de juego y multiplicadores de puntuación especiales.
 *
 * @param {Personaje} jugador - El personaje del jugador.
 * @param {Jefe} jefe - La instancia del Jefe (debe tener propiedades especiales como multiplicador).
 * @returns {string} Código HTML con el resumen del combate final.
 */

export function batallaJefe(jugador, jefe) {
    let vidaJugador = jugador.vidaTotal ?? jugador.vida;
    let vidaJefe = jefe.vida;

    const danioJugador = jugador.ataqueTotal ?? jugador.ataque;
    const danioJefe = jefe.ataque;

    let ronda = 1;
    let resultadoHTML = `<h3>⚔️ ${jugador.nombre} vs ${jefe.nombre}</h3>`;

    while (vidaJugador > 0 && vidaJefe > 0) {
        const danioRealJugador = Math.max(1, danioJugador - (jefe.defensa ?? 0) / 2);
        const danioRealJefe = Math.max(1, danioJefe - (jugador.defensaTotal ?? jugador.defensa) / 2);

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
        resultadoHTML += `<h4>🏆 ${jugador.nombre} ha ganado el juego (${puntosGanados} pts), ENHORABUENA</h4>`;
    } else {
        resultadoHTML += `<h4>💀 ${jefe.nombre} ha ganado. ¡Has perdido!</h4>`;
    }

    return resultadoHTML;
}

/**
 * Renderiza el ranking final en el DOM y lanza efectos visuales (confetti) según el desempeño.
 * Manipula directamente el elemento con ID 'ranking_final'.
 *
 * @param {Personaje} jugador - El objeto jugador con la puntuación final acumulada.
 * @returns {void} No retorna valor, modifica el DOM directamente.
 */

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