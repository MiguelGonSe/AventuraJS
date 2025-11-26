import { Objeto } from './Objeto.js';

export const objetos = [
    new Objeto("Espada Carmesí", 1250, "Épica", "Arma", { ataque: 28, vida: 15 }),
    new Objeto("Hacha del Trueno", 1400, "Legendaria", "Arma", { ataque: 45, defensa: 10 }),
    new Objeto("Látigo Sombrío", 800, "Rara", "Arma", { ataque: 30, vida: 20 }),
    new Objeto("Katana Celestial", 1600, "Legendaria", "Arma", { ataque: 40, vida: 25 }),
    new Objeto("Martillo del Gigante", 1150, "Épica", "Arma", { ataque: 33, defensa: 15 }),
    new Objeto("Muro de Hierro", 900, "Rara", "Armadura", { defensa: 45, vida: 20 }),
    new Objeto("Escudo del León", 1000, "Épica", "Armadura", { defensa: 50, vida: 25 }),
    new Objeto("Placas de Acero", 750, "Común", "Armadura", { defensa: 35, vida: 30 }),
    new Objeto("Casco del Centinela", 600, "Común", "Armadura", { defensa: 20, vida: 10 }),
    new Objeto("Guanteletes de Diamante", 1300, "Legendaria", "Armadura", { defensa: 55, vida: 35 }),
    new Objeto("Anillo del Eclipse", 950, "Rara", "Accesorio", { ataque: 10, defensa: 10, vida: 20 }),
    new Objeto("Colgante del Viento", 700, "Común", "Accesorio", { vida: 15, defensa: 5 }),
    new Objeto("Amuleto del Guardián", 1200, "Épica", "Accesorio", { defensa: 25, vida: 40 }),
    new Objeto("Talisman de Sangre", 850, "Rara", "Accesorio", { ataque: 15, vida: 25 }),
    new Objeto("Brazalete del Sabio", 1100, "Épica", "Accesorio", { defensa: 15, vida: 35 })
];

export function filtrarPorRareza(productos, rareza) {
    return productos.filter(producto => producto.rareza === rareza);
}

export function aplicarDescuento(productos, rareza, porcentaje) {
    return productos.map(producto => producto.rareza === rareza ? producto.aplicarDescuento(porcentaje) : producto);
}

export function buscarProducto(productos, nombre) {
    return productos.find(producto => producto.nombre === nombre);
}

export function mostrarProducto(producto) {
    return producto.mostrarInfo();
}