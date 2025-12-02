import { deepClone, groupBy } from '../Utils/Utils.js';

/**
 * Representa al jugador o entidad principal controlable.
 * Gestiona estadísticas, economía (monedas) e inventario, calculando los totales
 * basándose en el equipamiento actual.
 * @class
 */

export class Personaje {
    nombre;
    ataque;
    defensa;
    vida;
    puntos;
    vidaMaxima = 500;
    monedas = 4000;
    inventario;

    /**
     * Crea una instancia del Personaje.
     * Inicializa la vida actual al valor de la vida máxima y el inventario vacío.
     *
     * @param {number} ataque - Fuerza base.
     * @param {number} defensa - Resistencia base.
     * @param {number} puntos - Puntuación inicial.
     * @param {number} vidaMaxima - Tope de salud del personaje.
     */

    constructor(ataque, defensa, puntos, vidaMaxima) {
        this.ataque = ataque;
        this.defensa = defensa;
        this.puntos = puntos;
        this.vidaMaxima = vidaMaxima;
        this.vida = vidaMaxima;
        this.inventario = [];
    }

    /**
     * Añade un objeto al inventario del personaje.
     * Utiliza `deepClone` para asegurar que el objeto en el inventario es una copia independiente
     * del original (evitando referencias compartidas).
     *
     * @param {Object} Producto - El objeto a añadir (debe tener estructura compatible).
     */
    añadirProducto(Producto) {
        this.inventario.push(deepClone(Producto));
    }

    /**
     * Incrementa la puntuación o experiencia del personaje.
     *
     * @param {number} experiencia - Cantidad de puntos a sumar.
     */
    sumarPuntos(experiencia) {
        this.puntos += experiencia;
    }

    /**
     * Calcula el ataque total sumando la base más los bonificadores de las armas.
     * Filtra el inventario buscando items de tipo 'Arma' y suma sus propiedades `ataque` o `bonus.ataque`.
     *
     * @readonly
     * @type {number}
     */
    get ataqueTotal() {
        return this.ataque + this.inventario
            .filter(productos => productos.tipo === 'Arma')
            .reduce((total, productos) => total + (productos.ataque ?? productos.bonus?.ataque ?? 0), 0);
    }

    /**
     * Calcula la defensa total sumando la base más los bonificadores de las armaduras.
     * Filtra el inventario buscando items de tipo 'Armadura'.
     *
     * @readonly
     * @type {number}
     */
    get defensaTotal() {
        return this.defensa + this.inventario
            .filter(productos => productos.tipo === 'Armadura')
            .reduce((total, productos) => total + (productos.defensa ?? productos.bonus?.defensa ?? 0), 0);
    }

    /**
     * Calcula la vida máxima total (Base + Bonificadores de objetos).
     * Suma cualquier objeto que tenga un bonus de vida.
     *
     * @readonly
     * @type {number}
     */
    get vidaTotal() {
        return this.vidaMaxima + this.inventario
            .reduce((total, obj) => total + (obj.bonus?.vida ?? 0), 0);
    }

    /**
     * Organiza el inventario agrupando los objetos por su categoría.
     * Utiliza la función de utilidad `groupBy`.
     *
     * @returns {Object.<string, Array<Object>>} Objeto donde las claves son los tipos (Arma, Poción, etc.) y los valores son arrays de objetos.
     */
    inventarioPorTipo() {
        return groupBy(this.inventario, productos => productos.tipo);
    }

    /**
     * Genera una ficha técnica en formato texto con el estado actual del personaje.
     * Incluye estadísticas calculadas y lista de items.
     *
     * @returns {string} String multilínea formateado para consola o display de texto.
     */
    mostrarPersonaje() {
        return `
        👤 ${this.nombre}
        💰 Monedas: ${this.monedas}
        ❤ Vida: ${this.vida}/${this.vidaMaxima}
        ⭐ Puntos: ${this.puntos}
        ⚔ Ataque total: ${this.ataqueTotal}
        🛡 Defensa total: ${this.defensaTotal}
        🎒 Inventario: ${this.inventario.length > 0
                ? this.inventario.map(productos => productos.nombre).join(', ')
                : 'Vacío'}
        `;
    }
}
