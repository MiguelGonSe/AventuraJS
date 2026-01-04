export class Objeto {
    nombre;
    precio;
    rareza;
    tipo;
    bonus;
    imagen;

    /**
     * Crea una nueva instancia de un Objeto.
     *
     * @param {string} nombre - El nombre del objeto.
     * @param {number} precio - El precio en céntimos (ej. 1250 para 12.50€).
     * @param {string} rareza - La rareza del objeto.
     * @param {string} tipo - El tipo de equipamiento.
     * @param {Object.<string, number>} bonus - Objeto con las mejoras (ej. `{ ataque: 10, vida: 5 }`).
     */

    constructor(nombre, precio, rareza, tipo, bonus) {
        this.nombre = nombre;
        this.precio = precio;
        this.precioBase = precio;
        this.rareza = rareza;
        this.tipo = tipo;
        this.bonus = bonus;
        this.imagen = this.getImagen();
    }

    /**
     * Convierte un valor numérico (céntimos) a formato de moneda local.
     *
     * @param {number} cantidad - La cantidad numérica a formatear.
     * @returns {string} El precio formateado (ej. "12,50€").
     */

    formatearPrecio(cantidad) {
        let valor = cantidad / 100;
        return valor.toFixed(2).replace('.', ',') + '€';
    }

    /**
     * Obtiene el precio actual del objeto formateado como moneda.
     *
     * @returns {string} El precio actual formateado.
     */
    getPrecioFormateado() {
        return this.formatearPrecio(this.precio);
    }

    /**
     * Genera una representación HTML de la tarjeta del producto.
     * Incluye la imagen, el nombre y la lista de bonus formateada.
     *
     * @returns {string} Cadena HTML lista para insertar en el DOM.
     */
    mostrarInfo() {
        const bonusStr = Object.entries(this.bonus).map(([k, v]) => `${k}: ${v}`).join(', ');
        return `<img src="${this.imagen}" alt="${this.nombre}" width="70" height="70"/> 
                <p><strong>${this.nombre}</strong><br><br> 
                <strong>Bonus: <span>${bonusStr}</span></strong> </p>`;
    }

    /**
         * Determina la ruta de la imagen basándose en el tipo y nombre del objeto.
         * Método auxiliar interno usado durante la construcción.
         *
         * @returns {string} Ruta al archivo de imagen.
         */

    getImagen() {
        if (this.tipo === 'Arma' && this.nombre === 'Zoro') {
            return "./IMG/Zoro.png";
        } else if (this.tipo === 'Arma' && this.nombre === 'Shanks') {
            return "./IMG/Shanks.png";
        } else if (this.tipo === 'Arma' && this.nombre === 'Dracule Mihawk') {
            return "./IMG/Mihwak.webp";
        } else if (this.tipo === 'Arma' && this.nombre === 'Edward Newgate') {
            return "./IMG/Barbablanca.png";
        } else if (this.tipo === 'Arma' && this.nombre === 'Brook') {
            return "./IMG/Brook.png";
        } else if (this.tipo === 'Armadura' && this.nombre === 'Marco') {
            return "./IMG/Marco.png";
        } else if (this.tipo === 'Armadura' && this.nombre === 'Sanji') {
            return "./IMG/Sanji.png";
        } else if (this.tipo === 'Armadura' && this.nombre === 'Charlotte Linlin') {
            return "./IMG/Bigmom.png";
        } else if (this.tipo === 'Armadura' && this.nombre === 'Franky') {
            return "./IMG/Franki.png";
        } else if (this.tipo === 'Armadura' && this.nombre === 'Kaido') {
            return "./IMG/Kaido.png";
        } else if (this.tipo === 'Accesorio' && this.nombre === 'Nami') {
            return "./IMG/Nami.png";
        } else if (this.tipo === 'Accesorio' && this.nombre === 'Trafalgar Law') {
            return "./IMG/Law.png";
        } else if (this.tipo === 'Accesorio' && this.nombre === 'Charlotte Katakuri') {
            return "./IMG/Katakuri.png";
        } else if (this.tipo === 'Accesorio' && this.nombre === 'Jimbe') {
            return "./IMG/Jimbe.png";
        } else if (this.tipo === 'Accesorio' && this.nombre === 'Boa Hancock') {
            return "./IMG/Boa.png";
        } else {
            return "./IMG/Marco.png";
        }
    }

    /**
     * Calcula el nuevo precio tras aplicar un porcentaje de descuento sobre el precio base.
     * Nota: Este método devuelve el valor calculado, no actualiza el precio del objeto automáticamente en este snippet.
     *
     * @param {number} porcentaje - El porcentaje a descontar (0 a 100).
     * @returns {number} El nuevo precio calculado (entero).
     */

    aplicarDescuento(porcentaje) {
        if (porcentaje < 0 || porcentaje > 100) {
            console.error("Porcentaje inválido");
            return this.precio;
        }

        const nuevoPrecio = Math.round(this.precioBase * (1 - porcentaje / 100));
        return nuevoPrecio;
    }
}