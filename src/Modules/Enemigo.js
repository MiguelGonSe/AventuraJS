/**
 * Representa a una entidad hostil o enemigo dentro del juego.
 * Esta clase base gestiona las estadísticas de combate y la identidad del enemigo.
 * * @class
 */
export class Enemigo {
    /**
     * El tipo de entidad. Se inicializa automáticamente como 'Enemigo'.
     * @type {string}
     */
    tipo;

    /**
     * El nombre propio del enemigo (ej. "Goblin", "Orco").
     * @type {string}
     */
    nombre;

    /**
     * Puntos de ataque o fuerza ofensiva.
     * @type {number}
     */
    ataque;

    /**
     * Puntos de defensa o resistencia al daño.
     * @type {number}
     */
    defensa;

    /**
     * Puntos de vida actuales (HP).
     * @type {number}
     */
    vida;

    /**
     * Crea una nueva instancia de un Enemigo.
     *
     * @param {string} nombre - El nombre identificativo del enemigo.
     * @param {number} ataque - La cantidad de daño que puede infligir.
     * @param {number} defensa - La cantidad de daño que puede mitigar.
     * @param {number} vida - La salud inicial del enemigo.
     */
    constructor(nombre, ataque, defensa, vida) {
        this.tipo = 'Enemigo';
        this.nombre = nombre;
        this.ataque = ataque;
        this.defensa = defensa;
        this.vida = vida;
    }

    /**
     * Genera un resumen textual de las estadísticas del enemigo.
     * Útil para logs de consola o interfaces de texto.
     *
     * @returns {string} Una cadena formateada con el nombre, tipo y estadísticas.
     */
    presentar() {
        return `Soy ${this.nombre}, un ${this.tipo} con ${this.vida} puntos de vida y ${this.ataque} de ataque y ${this.defensa} de defensa`;
    }
};