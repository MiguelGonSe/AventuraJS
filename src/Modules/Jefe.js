import { Enemigo } from './Enemigo.js';

/**
 * Representa a un enemigo de rango superior (Jefe).
 * Hereda de la clase {@link Enemigo}, posee una habilidad especial y un multiplicador de daño nativo.
 * * @extends Enemigo
 */
export class Jefe extends Enemigo {
    /**
     * Nombre o descripción de la habilidad especial del jefe.
     * @type {string}
     */
    habilidad;

    /**
     * Factor por el cual se multiplica el ataque base.
     * Se inicializa en 1.25 por defecto.
     * @type {number}
     * @default 1.25
     */
    multiplicadorDanio = 1.25;

    /**
     * Crea una nueva instancia de un Jefe.
     * Nota: El ataque final se calculará aplicando inmediatamente el `multiplicadorDanio` al ataque base proporcionado.
     * * @param {string} nombre - El nombre del jefe.
     * @param {number} ataque - El ataque base (antes del multiplicador).
     * @param {number} defensa - La defensa del jefe.
     * @param {number} vida - Los puntos de vida totales.
     * @param {string} habilidad - El nombre de la habilidad especial única.
     */
    constructor(nombre, ataque, defensa, vida, habilidad) {
        super(nombre, ataque, defensa, vida);
        this.tipo = 'Jefe';

        // Se sobrescribe el ataque aplicando el multiplicador
        this.ataque = ataque * this.multiplicadorDanio;
        this.habilidad = habilidad;
    }

    /**
     * Genera un resumen textual del jefe, incluyendo sus características base y especiales.
     * Sobrescribe el método de la clase padre para añadir detalles de la habilidad.
     * * @override
     * @returns {string} Descripción completa del jefe.
     */
    presentar() {
        return `${super.presentar()} Además, tengo la habilidad especial "${this.habilidad}" y mi daño se multiplica por ${this.multiplicadorDanio}.`;
    }

    /**
     * Ejecuta la habilidad especial del jefe.
     * * @returns {string} Mensaje de acción describiendo el uso de la habilidad.
     */
    usarHabilidad() {
        return `!${this.nombre} usa su habilidad especial: ${this.habilidad}!`;
    }
}