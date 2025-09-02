import { success } from '../../../../helpers/alertas';
import { post } from '../../../../helpers/api';
import { cerrarTodos, mostrarModal } from '../../../../helpers/modalManagement';
import { datos, validarCampo, validarCampos, validarMaximo, validarTexto } from '../../../../helpers/validaciones';
import { goalStatusesController } from '../estadosMetasController';
import { errorModal } from '../../../../components/modales/modalError';
import htmlContent from './crearEstadoMeta.html?raw';
import { isAuthorize } from '../../../../helpers/auth';

export default async (parametros = null) => {
    if (!isAuthorize('goal-statuses.store')) {
        await errorModal('No tienes permisos para crear estados de metas.');
        return;
    }
    mostrarModal(htmlContent);
    gestionarValidaciones();
};

function gestionarValidaciones() {
    let nombre = document.querySelector("#nombreGoalStatus");
    nombre.addEventListener('keydown', (e) => {
        validarTexto(e);
        validarMaximo(e, 30);
    });
    nombre.addEventListener('blur', (e) => validarCampo(e));
}

async function validarSubmit(e) {
    if (validarCampos(e)) {
        let botonCrear = document.querySelector('#btnCrearGoalStatus');
        let textoOriginal = botonCrear.textContent;
        botonCrear.disabled = true;
        botonCrear.textContent = "cargando...";
        let response = await post(datos, 'goalStatuses');
        botonCrear.textContent = textoOriginal;
        botonCrear.disabled = false;
        if (response.success) {
            cerrarTodos();
            let confirmacion = success(response.message);
            e.target.reset();
            if ((await confirmacion).isConfirmed) goalStatusesController();
        } else {
            if (response.errors) {
                await errorModal(response.errors[0]);
                return;
            }
            await errorModal(response.message);
        }
    }
}

document.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (e.target.closest('#form-crearGoalStatus')) await validarSubmit(e);
});
