import { get, patch } from '../../../../helpers/api';
import { cerrarTodos, mostrarModal } from '../../../../helpers/modalManagement';
import { datos, validarCampo, validarCampos, validarMaximo, validarTexto } from '../../../../helpers/validaciones';
import { estadosController } from '../estadosController';
import { errorModal } from '../../../../components/modales/modalError';
import htmlContent from './editarEstado.html?raw';
import { isAuthorize } from '../../../../helpers/auth';
import { success } from '../../../../helpers/alertas';

let estadoId = null;

export default async (parametros = null) => {
    const { status_id } = parametros || {};
    if (!isAuthorize('statuses.update')) {
        await errorModal('No tienes permisos para editar estados.');
        return;
    }
    if (!status_id) return;
    estadoId = status_id;
    mostrarModal(htmlContent);
    gestionarValidaciones();

    const formulario = document.getElementById('form-editarEstado');

    if (isAuthorize('statuses.show')) {
        const infoEstado = await get(`statuses/${status_id}`);
        const estado = infoEstado.data;
        cargarFormulario(formulario, estado);
    }
};

function gestionarValidaciones() {
    let nombre = document.querySelector("#nombreEstado");
    nombre.addEventListener('keydown', (e) => {
        validarTexto(e);
        validarMaximo(e, 30);
    });
    nombre.addEventListener('blur', (e) => validarCampo(e));
}

async function validarSubmit(e) {
    if (validarCampos(e)) {
        let botonEditar = document.querySelector('#btnEditarEstado');
        let textoOriginal = botonEditar.textContent;
        botonEditar.disabled = true;
        botonEditar.textContent = "cargando...";
        let response = await patch(datos, `statuses/${estadoId}`);
        
        botonEditar.textContent = textoOriginal;
        botonEditar.disabled = false;
        if (response.success) {
            cerrarTodos();
            let confirmacion = success(response.message);
            e.target.reset();
            if ((await confirmacion).isConfirmed) estadosController();
        } else {
            if (response.errors) {
                await errorModal(response.erros[0]);
                return;
            }
            await errorModal(response.message);
        }
    }
}

async function cargarFormulario(formulario, data) {
    const campos = formulario.querySelectorAll('input, textarea, select');
    campos.forEach(async campo => {
        if (campo.getAttribute('name') in data)
            campo.value = data[campo.getAttribute('name')];
    });
}

document.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (e.target.closest('#form-editarEstado')) await validarSubmit(e);
});
