export class Objeto {
    nombre;
    precio;
    rareza;
    tipo;
    bonus;
    imagen;

    constructor(nombre, precio, rareza, tipo, bonus) {
        this.nombre = nombre;
        this.precio = precio;
        this.rareza = rareza;
        this.tipo = tipo;
        this.bonus = bonus;
        this.imagen = this.getImagen();
    }

    mostrarInfo() {
        const bonusStr = Object.entries(this.bonus).map(([k, v]) => `${k}: ${v}`).join(', ');
        return `<img src="${this.imagen}" alt="${this.nombre}" width="50" height="50"/> <p><strong>${this.nombre}</strong><br> ${this.precio} monedas <br> Bonus: ${bonusStr}</p>`;
    }


    getImagen() {
        if (this.tipo === 'Arma') {
            return "./IMG/arma.png";
        } else if (this.tipo === 'Armadura') {
            return "./IMG/escudo.png";
        } else {
            return "./IMG/pocion.png";
        }
    }

    aplicarDescuento(porcentaje) {
        if (porcentaje < 0) {
            return "Lo siento, el porcentaje no es válido. Tiene que ser mayor que 0";
        } else if (porcentaje > 100) {
            return "Lo siento, no puede ser el porcentaje mayor que 100";
        } else {
            const nuevoPrecio = Math.round(this.precio * (1 - porcentaje / 100));
            this.precio = nuevoPrecio;
            return `Nombre: ${this.nombre}, Precio: ${nuevoPrecio}, Rareza: ${this.rareza}, Tipo: ${this.tipo}, Bonus: ${this.bonus}`;
        }
    }

}