import { Enemigo } from './Enemigo.js';

export class Jefe extends Enemigo {
    habilidad;
    multiplicadorDanio = 1.25;

    constructor(nombre, ataque, defensa, vida, habilidad) {
        super(nombre, ataque, defensa, vida);
        this.tipo = 'Jefe';
        this.ataque = ataque * this.multiplicadorDanio;
        this.habilidad = habilidad;
    }

    presentar() {
        return `${super.presentar()} Además, tengo la habilidad especial "${this.habilidad}" y mi daño se multiplica por ${this.multiplicadorDanio}.`;
    }

    usarHabilidad() {
        return `!${this.nombre} usa su habilidad especial: ${this.habilidad}!`;
    }
}