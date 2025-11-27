/**
 * Clonación profunda manual (soporta objetos y arrays anidados)
 * @param {any} obj - Objeto a clonar profundamente
 * @returns {any} Copia independiente de obj
 */

export function deepClone(obj) {
    if (obj === null || typeof obj !== 'object') return obj;
    if (Array.isArray(obj)) return obj.map(item => deepClone(item));
    const clone = {};
    for (const key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
            clone[key] = deepClone(obj[key]);
        }
    }
    return clone;
}

/**
 * Agrupa los elementos de un array por una función clave.
 * @param {Array} array 
 * @param {Function} keyFunc 
 * @returns {Record<string, any[]>}
 */

export function groupBy(array, keyFunc) {
    return array.reduce((acc, item) => {
        const key = keyFunc(item);
        acc[key] = acc[key] || [];
        acc[key].push(item);
        return acc;
    }, {});
}

/**
  * Permite mostrar u ocultar un elemento (escena) de la pantalla.
  * Selecciona todos los elementos con la clase scene y les remueve la clase active
  * Selecciona el elemento con el id especificado y le añade la clase active
  * @param {number} id - identificador del elemento.
  */

export function showScene(id) {
    document.querySelectorAll('.scene').forEach(
        element => element.classList.remove('active')
    );
    document.getElementById(id).classList.add('active');
}

// Divide entre 100, fija 2 decimales, cambia punto por coma y añade €
export function formatearDinero(cantidad) {
    return (cantidad / 100).toFixed(2).replace('.', ',') + ' €';
}