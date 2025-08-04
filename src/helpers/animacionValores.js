import { formatter } from "./formateadorPrecio";

export function animateValue(elemento, valor, precio = true) {
    
    let numero = 0;
    const incremento = valor / 40;
    const intervalo = setInterval(() => {
        numero += incremento;

        if(precio){
            elemento.textContent = formatter.format(numero);
    
            if (numero >= valor) {
                numero = valor;
                elemento.textContent = formatter.format(Math.floor(numero));
                clearInterval(intervalo);
            }
        }
        else {
            elemento.textContent = Math.floor(numero);
    
            if (numero >= valor) {
                numero = valor;
                elemento.textContent = Math.floor(numero);
                clearInterval(intervalo);
            }
        }
    }, 20);

}