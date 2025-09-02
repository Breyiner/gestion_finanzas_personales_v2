import { errorModal } from '../../../../components/modales/modalError';
import { success } from '../../../../helpers/alertas';
import { post } from '../../../../helpers/api';
import { cerrarTodos, mostrarModal } from '../../../../helpers/modalManagement';
import { datos, validarCampo, validarCampos, validarMaximo, validarTexto } from '../../../../helpers/validaciones';
import htmlContent from './crearCiudad.html?raw';

export default async (parametros = null) => {

    mostrarModal(htmlContent);

    gestionarValidaciones();

}

function gestionarValidaciones() {

    let nombre = document.querySelector("#nombre");
    
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
        
        let response = await post(datos, 'cities');
        
        botonCrear.textContent = textoOriginal;
        botonCrear.disabled = false;

        if(response.success) {
            cerrarTodos();
            success(response.message);
            e.target.reset();
        }
        else {
            cerrarTodos();
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

    if(e.target.closest('#form-crearCiudad')) await validarSubmit(e);
    
})