import { get, patch } from '../../../../helpers/api';
import { cerrarTodos, mostrarModal } from '../../../../helpers/modalManagement';
import { datos, validarCampo, validarCampos, validarMaximo, validarTexto } from '../../../../helpers/validaciones';
import { goalStatusesController } from '../estadosMetasController';
import { errorModal } from '../../../../components/modales/modalError';
import htmlContent from './editarEstadoMeta.html?raw';
import { isAuthorize } from '../../../../helpers/auth';
import { success } from '../../../../helpers/alertas';

let goalStatusId = null;

export default async (parametros = null) => {
    const { goalStatus_id } = parametros || {};
    if (!isAuthorize('goal-statuses.update')) {
        await errorModal('No tienes permisos para editar estados de metas.');
        return;
    }
    if (!goalStatus_id) return;
    goalStatusId = goalStatus_id;
    mostrarModal(htmlContent);
    gestionarValidaciones();

    const formulario = document.getElementById('form-editarGoalStatus');

    if (isAuthorize('goal-statuses.show')) {
        const info = await get(`goalStatuses/${goalStatus_id}`);
        const goalStatus = info.data;
        cargarFormulario(formulario, goalStatus);
    }
}

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
        let botonEditar = document.querySelector('#btnEditarGoalStatus');
        let textoOriginal = botonEditar.textContent;
        botonEditar.disabled = true;
        botonEditar.textContent = "cargando...";
        let response = await patch(datos, `goalStatuses/${goalStatusId}`);
        
        botonEditar.textContent = textoOriginal;
        botonEditar.disabled = false;
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

async function cargarFormulario(formulario, data) {
    const campos = formulario.querySelectorAll('input, textarea, select');
    campos.forEach(async campo => {
        if(campo.getAttribute('name') in data)
            campo.value = data[campo.getAttribute('name')];
    });
}

document.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (e.target.closest('#form-editarGoalStatus')) await validarSubmit(e);
});
