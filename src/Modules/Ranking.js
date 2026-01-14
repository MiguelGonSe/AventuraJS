import { groupBy } from "../Utils/Utils.js";

/**
 * Simula un combate por turnos entre el jugador y un enemigo estándar.
 * 
 */
export function batalla(jugador, enemigo) {
    let vidaJugador = jugador.vidaFinal ?? jugador.vida;
    let vidaEnemigo = enemigo.vida;

    const danioJugador = jugador.ataqueFinal ?? jugador.ataque;
    const danioEnemigo = enemigo.ataque;

    // Solo mostramos el título del combate
    let resultadoHTML = `<h3>${jugador.nombre} vs ${enemigo.nombre}</h3>`;

    // Bucle lógico 
    while (vidaJugador > 0 && vidaEnemigo > 0) {
        // Turno Jugador
        const danioRealJugador = Math.max(1, danioJugador - (enemigo.defensa ?? 0) / 2);
        vidaEnemigo -= danioRealJugador;

        if (vidaEnemigo <= 0) {
            vidaEnemigo = 0;
            break; 
        }

        // Turno Enemigo
        const defensaJugador = jugador.defensaFinal ?? jugador.defensa;
        const danioRealEnemigo = Math.max(1, danioEnemigo - defensaJugador / 2);
        vidaJugador -= danioRealEnemigo;
    }

    // Resultado final
    if (vidaEnemigo <= 0) {
        const puntosGanados = 100 + enemigo.ataque;
        jugador.puntos += puntosGanados;
        jugador.vida += 100;
        jugador.dinero += 5;

        // Se usa la puntuación actualizada
        const puntosTotal = jugador.puntos; 
        
        resultadoHTML += `<h4>${jugador.nombre} ha ganado (${puntosGanados} pts obtenidos, +5 monedas y salud +100)</h4>`;
        resultadoHTML += `
            <div class="contenedor-monedas-victoria">
                <img src="IMG/moneda.png" class="moneda-animada" style="animation-duration: 2s;" alt="Moneda">
                <img src="IMG/moneda.png" class="moneda-animada" style="animation-duration: 2s;" alt="Moneda">
                <img src="IMG/moneda.png" class="moneda-animada" style="animation-duration: 2s;" alt="Moneda">
            </div>
        `;
    } else {
        resultadoHTML += `<h4>${enemigo.nombre} ha ganado. ¡Has perdido!</h4>`;
    }

    return resultadoHTML;
}

/**
 * Simula el combate final contra un Jefe.
 * (Sin imprimir el log de rondas)
 */
export function batallaJefe(jugador, jefe) {
    let vidaJugador = jugador.vidaFinal ?? jugador.vida;
    let vidaJefe = jefe.vida;

    const danioJugador = jugador.ataqueFinal ?? jugador.ataque; 
    const danioJefe = jefe.ataque;

    let resultadoHTML = `<h3>${jugador.nombre} vs ${jefe.nombre}</h3>`;

    // Bucle lógico 
    while (vidaJugador > 0 && vidaJefe > 0) {
        // Turno Jugador
        const danioRealJugador = Math.max(1, danioJugador - (jefe.defensa ?? 0) / 2);
        vidaJefe -= danioRealJugador;

        if (vidaJefe <= 0) {
            vidaJefe = 0;
            break;
        }

        // Turno Jefe
        const defensaJugador = jugador.defensaFinal ?? jugador.defensa;
        const danioRealJefe = Math.max(1, danioJefe - defensaJugador / 2);
        vidaJugador -= danioRealJefe;
    }

    // Resultado final
    if (vidaJefe <= 0) {
        const puntosGanados = (100 + jefe.ataque) * (jefe.multiplicador ?? 1);
        jugador.puntos += puntosGanados;
        jugador.dinero += 10;
        
        const puntosTotal = jugador.puntos;

        resultadoHTML += `<h4>${jugador.nombre} ha ganado el juego (Total: ${puntosTotal} pts) y ha ganado 10 monedas, ENHORABUENA</h4>`;
        resultadoHTML += `
            <div class="contenedor-monedas-victoria">
                <img src="IMG/moneda.png" class="moneda-animada" style="animation-duration: 2s;" alt="Moneda">
                <img src="IMG/moneda.png" class="moneda-animada" style="animation-duration: 2s;" alt="Moneda">
                <img src="IMG/moneda.png" class="moneda-animada" style="animation-duration: 2s;" alt="Moneda">
            </div>
        `;
    } else {
        resultadoHTML += `<h4>${jefe.nombre} ha ganado. ¡Has perdido!</h4>`;
    }

    return resultadoHTML;
}

// La función mostrarRanking 
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