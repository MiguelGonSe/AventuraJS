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
        this.precioBase = precio;
        this.rareza = rareza;
        this.tipo = tipo;
        this.bonus = bonus;
        this.imagen = this.getImagen();
    }

    mostrarInfo() {
        const bonusStr = Object.entries(this.bonus).map(([k, v]) => `${k}: ${v}`).join(', ');
        return `<img src="${this.imagen}" alt="${this.nombre}" width="70" height="70"/> <p><strong>${this.nombre}</strong><br><br> <strong>Bonus: <span>${bonusStr}</span></strong> </p>`;
    }


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

    aplicarDescuento(porcentaje) {
        if (porcentaje < 0 || porcentaje > 100) {
            console.error("Porcentaje inválido");
            return this.precio;
        }

        const nuevoPrecio = Math.round(this.precioBase * (1 - porcentaje / 100));
        return nuevoPrecio;
    }
}