import { success } from '../../../helpers/alertas';
import { post } from '../../../helpers/api';
import { cerrarTodos, mostrarModal } from '../../../helpers/modalManagement';
import { datos, validarCampo, validarCampos, validarMaximo, validarTexto } from '../../../helpers/validaciones';
import { generosController } from '../../../views/admin/generos/generosController';
import { errorModal } from '../modalError';
import htmlContent from './crearGenero.html?raw';

export const abrirModalNewGenero = async () => {

    // Crear y mostrar el modal
    mostrarModal(htmlContent);
    
    // Ahora configurar la funcionalidad
    gestionarValidaciones();
};

function gestionarValidaciones() {

    let nombre = document.querySelector("#nombreGenero");
    
    nombre.addEventListener('keydown', (e) => {
        validarTexto(e);
        validarMaximo(e, 30);
    })
    


    nombre.addEventListener('blur', (e) => validarCampo(e));
}

async function validarSubmit(e) {

    if(validarCampos(e)) {
        
        console.log(datos);
        let botonCrear = document.querySelector(('#btnCrearGenero'));
        let textoOriginal = botonCrear.textContent;
        botonCrear.disabled = true;
        botonCrear.textContent = "cargando...";
        
        let response = await post(datos, 'generos');
        
        botonCrear.textContent = textoOriginal;
        botonCrear.disabled = false;

        if(response.success) {
            cerrarTodos();
            let confirmacion = success(response.message);
            e.target.reset();   
            if((await confirmacion).isConfirmed) generosController();
        }
        else {
            if(response.errors.length > 0)  {
                await errorModal(response.errors[0]);
                return;
            }
                await errorModal(response.message);
        }
    }

}

document.addEventListener('submit', async (e) => {
    
    e.preventDefault();

    if(e.target.closest('#form-nuevoGenero')) await validarSubmit(e);
    
})