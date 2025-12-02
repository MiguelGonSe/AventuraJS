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
        if (this.tipo === 'Arma' && this.nombre === 'Espada Carmesí') {
            return "./IMG/espadaCarmesi.webp";
        } else if (this.tipo === 'Arma' && this.nombre === 'Hacha del Trueno') {
            return "./IMG/hachaTrueno.png";
        } else if (this.tipo === 'Arma' && this.nombre === 'Látigo Sombrío') {
            return "./IMG/latigoSombrio.webp";
        } else if (this.tipo === 'Arma' && this.nombre === 'Katana Celestial') {
            return "./IMG/katanaCelestial.png";
        } else if (this.tipo === 'Arma' && this.nombre === 'Martillo del Gigante') {
            return "./IMG/martilloGigante.webp";
        } else if (this.tipo === 'Armadura' && this.nombre === 'Muro de Hierro') {
            return "./IMG/muroHierro.png";
        } else if (this.tipo === 'Armadura' && this.nombre === 'Escudo del León') {
            return "./IMG/escudoLeon.png";
        } else if (this.tipo === 'Armadura' && this.nombre === 'Placas de Acero') {
            return "./IMG/placaAcero.png";
        } else if (this.tipo === 'Armadura' && this.nombre === 'Casco del Centinela') {
            return "./IMG/cascoCentinela.png";
        } else if (this.tipo === 'Armadura' && this.nombre === 'Guanteletes de Diamante') {
            return "./IMG/guantesDiamante.webp";
        } else if (this.tipo === 'Accesorio' && this.nombre === 'Anillo del Eclipse') {
            return "./IMG/anilloEclipse.png";
        } else if (this.tipo === 'Accesorio' && this.nombre === 'Colgante del Viento') {
            return "./IMG/colganteViento.png";
        } else if (this.tipo === 'Accesorio' && this.nombre === 'Amuleto del Guardián') {
            return "./IMG/amuletoGuardian.png";
        } else if (this.tipo === 'Accesorio' && this.nombre === 'Talisman de Sangre') {
            return "./IMG/talismanSangre.png";
        } else if (this.tipo === 'Accesorio' && this.nombre === 'Brazalete del Sabio') {
            return "./IMG/brazaleteSabio.webp";
        } else {
            return "./IMG/pocion.png";
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