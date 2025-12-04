import { Objeto } from './Objeto.js';

/**
 * Catálogo predefinido de objetos disponibles en el juego.
 * Contiene una mezcla de armas, armaduras y accesorios con diferentes rarezas y estadísticas.
 * @type {Objeto[]}
 */
export const objetos = [
    new Objeto("Espada Carmesí", 12500, "Épica", "Arma", { ataque: 28, vida: 15 }),
    new Objeto("Hacha del Trueno", 14000, "Legendaria", "Arma", { ataque: 45, defensa: 10 }),
    new Objeto("Látigo Sombrío", 8000, "Rara", "Arma", { ataque: 30, vida: 20 }),
    new Objeto("Katana Celestial", 16000, "Legendaria", "Arma", { ataque: 40, vida: 25 }),
    new Objeto("Martillo del Gigante", 11500, "Épica", "Arma", { ataque: 33, defensa: 15 }),
    new Objeto("Muro de Hierro", 9000, "Rara", "Armadura", { defensa: 45, vida: 20 }),
    new Objeto("Escudo del León", 10000, "Épica", "Armadura", { defensa: 50, vida: 25 }),
    new Objeto("Placas de Acero", 7500, "Común", "Armadura", { defensa: 35, vida: 30 }),
    new Objeto("Casco del Centinela", 6000, "Común", "Armadura", { defensa: 20, vida: 10 }),
    new Objeto("Guanteletes de Diamante", 13000, "Legendaria", "Armadura", { defensa: 55, vida: 35 }),
    new Objeto("Anillo del Eclipse", 9500, "Rara", "Accesorio", { ataque: 10, defensa: 10, vida: 20 }),
    new Objeto("Colgante del Viento", 7000, "Común", "Accesorio", { vida: 15, defensa: 5 }),
    new Objeto("Amuleto del Guardián", 12000, "Épica", "Accesorio", { defensa: 25, vida: 40 }),
    new Objeto("Talisman de Sangre", 8500, "Rara", "Accesorio", { ataque: 15, vida: 25 }),
    new Objeto("Brazalete del Sabio", 11000, "Épica", "Accesorio", { defensa: 15, vida: 35 })
];

/**
 * Filtra una lista de productos según su nivel de rareza.
 *
 * @param {Objeto[]} productos - La lista de objetos a filtrar.
 * @param {string} rareza - La rareza buscada (ej. "Común", "Rara", "Épica", "Legendaria").
 * @returns {Objeto[]} Un nuevo array que contiene solo los objetos que coinciden con la rareza.
 */
export function filtrarPorRareza(productos, rareza) {
    return productos.filter(producto => producto.rareza === rareza);
}

/**
 * Aplica un descuento al precio de los productos que coincidan con una rareza específica.
 *
 * @param {Objeto[]} productos - La lista de objetos a procesar.
 * @param {string} rareza - La rareza de los objetos a los que se aplicará el descuento.
 * @param {number} porcentaje - El porcentaje de descuento a aplicar (ej. 10 para un 10%).
 * @returns {Objeto[]} Una nueva lista con los precios actualizados donde corresponda.
 */
export function aplicarDescuento(productos, rareza, porcentaje) {
    return productos.map(producto => producto.rareza === rareza ? producto.aplicarDescuento(porcentaje) : producto);
}

/**
 * Busca un producto específico por su nombre exacto.
 *
 * @param {Objeto[]} productos - La lista donde buscar.
 * @param {string} nombre - El nombre del objeto a buscar.
 * @returns {Objeto|undefined} El objeto encontrado, o `undefined` si no existe.
 */
export function buscarProducto(productos, nombre) {
    return productos.find(producto => producto.nombre === nombre);
}

/**
 * Muestra la información detallada de un producto individual.
 * Es un wrapper para el método `mostrarInfo` de la instancia.
 *
 * @param {Objeto} producto - El objeto del cual se quiere obtener la información.
 * @returns {string} La descripción textual del producto.
 */
export function mostrarProducto(producto) {
    return producto.mostrarInfo();
}