import { success } from '../../../helpers/alertas';
import { post } from '../../../helpers/api';
import { cerrarTodos, mostrarModal } from '../../../helpers/modalManagement';
import { datos, validarCampo, validarCampos, validarMaximo, validarTexto } from '../../../helpers/validaciones';
import { tiposMovimientosController } from '../../../views/admin/tiposMovimientos/tiposMovimientosController';
import { errorModal } from '../modalError';
import htmlContent from './crearTipo.html?raw';

export const abrirModalNewTipo = async () => {

    // Crear y mostrar el modal
    mostrarModal(htmlContent);
    
    // Ahora configurar la funcionalidad
    gestionarValidaciones();
};

function gestionarValidaciones() {

    let nombre = document.querySelector("#nombreTipo");
    let icono  = document.querySelector('#claseIconoTipo');
    
    nombre.addEventListener('keydown', (e) => {
        validarTexto(e);
        validarMaximo(e, 30);
    })
    
    icono.addEventListener('keydown', (e) => {
        validarTexto(e);
        validarMaximo(e, 30);
    })
    


    nombre.addEventListener('blur', (e) => validarCampo(e));
    icono.addEventListener('blur', (e) => validarCampo(e));
}

async function validarSubmit(e) {

    if(validarCampos(e)) {
        
        console.log(datos);
        let botonCrear = document.querySelector(('#btnCrearTipo'));
        let textoOriginal = botonCrear.textContent;
        botonCrear.disabled = true;
        botonCrear.textContent = "cargando...";
        
        let response = await post(datos, 'tiposMovimiento');
        
        botonCrear.textContent = textoOriginal;
        botonCrear.disabled = false;

        if(response.success) {
            cerrarTodos();
            let confirmacion = success(response.message);
            e.target.reset();   
            if((await confirmacion).isConfirmed) tiposMovimientosController();
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

    if(e.target.closest('#form-nuevoTipo')) await validarSubmit(e);
    
})