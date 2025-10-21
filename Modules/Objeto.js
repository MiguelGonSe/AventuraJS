export class Objeto {
    nombre;
    precio;
    rareza;
    tipo;
    bonus;

    constructor(nombre, precio, rareza, tipo, bonus) {
        this.nombre = nombre;
        this.precio = precio;
        this.rareza = rareza;
        this.tipo = tipo;
        this.bonus = bonus;

    }

    mostrarInfo() {
        return `Nombre: ${this.nombre}, Precio: ${this.precio}, Rareza: ${this.rareza}, Tipo: ${this.tipo}, Bonus: ${this.bonus}`;
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