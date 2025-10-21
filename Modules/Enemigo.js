export class Enemigo {
    tipo;
    nombre;
    ataque;
    defensa;
    vida;

    constructor(nombre, ataque, defensa, vida) {
        this.tipo = 'Enemigo';
        this.nombre = nombre;
        this.ataque = ataque;
        this.defensa = defensa;
        this.vida = vida;
    }

    presentar() {
        return `Soy ${this.nombre}, un ${this.tipo} con ${this.vida} puntos de vida y ${this.ataque} de ataque y ${this.defensa} de defensa`;
    }
};


