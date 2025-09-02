import { success } from '../../../../helpers/alertas';
import { post } from '../../../../helpers/api';
import { cerrarTodos, mostrarModal } from '../../../../helpers/modalManagement';
import { datos, validarCampo, validarCampos, validarMaximo, validarTexto } from '../../../../helpers/validaciones';
import { generosController } from '../generosController';
import { errorModal } from '../../../../components/modales/modalError';
import htmlContent from './crearGenero.html?raw';
import { isAuthorize } from '../../../../helpers/auth';

export default async (parametros = null) => {
    if (!isAuthorize('genders.store')) {
        await errorModal('No tienes permisos para crear géneros.');
        return;
    }
    mostrarModal(htmlContent);
    gestionarValidaciones();
}

function gestionarValidaciones() {
    let nombre = document.querySelector("#nombre");
    nombre.addEventListener('keydown', (e) => {
        validarTexto(e);
        validarMaximo(e, 30);
    });
    nombre.addEventListener('blur', (e) => validarCampo(e));
}

async function validarSubmit(e) {
    if(validarCampos(e)) {
        let botonCrear = document.querySelector('#btnCrearGenero');
        let textoOriginal = botonCrear.textContent;
        botonCrear.disabled = true;
        botonCrear.textContent = "cargando...";
        let response = await post(datos, 'genders');
        botonCrear.textContent = textoOriginal;
        botonCrear.disabled = false;
        if(response.success) {
            cerrarTodos();
            let confirmacion = success(response.message);
            e.target.reset();
            if((await confirmacion).isConfirmed) generosController();
        } else {
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
    if(e.target.closest('#form-crearGenero')) await validarSubmit(e);
});
