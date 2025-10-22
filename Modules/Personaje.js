import { deepClone, groupBy } from '../Utils/Utils.js';

export class Personaje {
    nombre;
    ataque;
    defensa;
    vida;
    puntos;
    vidaMaxima = 200;
    monedas = 3000;
    inventario;

    constructor(nombre, ataque, defensa, puntos, vidaMaxima) {
        this.nombre = nombre;
        this.ataque = ataque;
        this.defensa = defensa;
        this.puntos = puntos;
        this.vidaMaxima = vidaMaxima;
        this.vida = vidaMaxima;
        this.inventario = [];
    }

    añadirProducto(Producto) {
        this.inventario.push(deepClone(Producto));
    }

    sumarPuntos(experiencia) {
        this.puntos += experiencia;
    }

    get ataqueTotal() {
        return this.ataque + this.inventario
            .filter(productos => productos.tipo === 'Arma')
            .reduce((total, productos) => total + (productos.ataque ?? productos.bonus?.ataque ?? 0), 0);
    }

    get defensaTotal() {
        return this.defensa + this.inventario
            .filter(productos => productos.tipo === 'Armadura')
            .reduce((total, productos) => total + (productos.defensa ?? productos.bonus?.defensa ?? 0), 0);
    }

    get vidaTotal() {
        return this.vidaMaxima + this.inventario
            .reduce((total, obj) => total + (obj.bonus?.vida ?? 0), 0);
    }

    inventarioPorTipo() {
        return groupBy(this.inventario, productos => productos.tipo);
    }

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
