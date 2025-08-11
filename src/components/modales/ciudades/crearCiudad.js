import { success } from '../../../helpers/alertas';
import { post } from '../../../helpers/api';
import { cerrarTodos, mostrarModal } from '../../../helpers/modalManagement';
import { datos, validarCampo, validarCampos, validarMaximo, validarTexto } from '../../../helpers/validaciones';
import { ciudadesController } from '../../../views/admin/ciudades/ciudadesController';
import { errorModal } from '../modalError';
import htmlContent from './crearCiudad.html?raw';

export const abrirModalNewCiudad = async () => {

    // Crear y mostrar el modal
    mostrarModal(htmlContent);
    
    // Ahora configurar la funcionalidad
    gestionarValidaciones();
};

function gestionarValidaciones() {

    let nombre = document.querySelector("#nombreCiudad");
    
    nombre.addEventListener('keydown', (e) => {
        validarTexto(e);
        validarMaximo(e, 30);
    })
    


    nombre.addEventListener('blur', (e) => validarCampo(e));
}

async function validarSubmit(e) {

    if(validarCampos(e)) {
        
        console.log(datos);
        let botonCrear = document.querySelector(('#btnCrearCiudad'));
        let textoOriginal = botonCrear.textContent;
        botonCrear.disabled = true;
        botonCrear.textContent = "cargando...";
        
        let response = await post(datos, 'ciudades');
        
        botonCrear.textContent = textoOriginal;
        botonCrear.disabled = false;

        if(response.success) {
            cerrarTodos();
            let confirmacion = success(response.message);
            e.target.reset();   
            if((await confirmacion).isConfirmed) ciudadesController();
        }
        else {
            if(response.data)  {
                await errorModal(response.data[0]);
                return;
            }
                await errorModal(response.message);
        }
    }

}

document.addEventListener('submit', async (e) => {
    
    e.preventDefault();

    if(e.target.closest('#form-nuevaCiudad')) await validarSubmit(e);
    
})