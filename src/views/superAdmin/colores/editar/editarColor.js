import { get, patch, put } from '../../../../helpers/api';
import { cerrarTodos, mostrarModal } from '../../../../helpers/modalManagement';
import { datos, validarCampo, validarCampos, validarMaximo, validarTexto } from '../../../../helpers/validaciones';
import { coloresController } from '../coloresController';
import { errorModal } from '../../../../components/modales/modalError';
import htmlContent from './editarColor.html?raw';
import { isAuthorize } from '../../../../helpers/auth';
import { success } from '../../../../helpers/alertas';

let colorId = null;

export default async (parametros = null) => {
    const { color_id } = parametros || {};
    if (!isAuthorize('colors.update')) {
        await errorModal('No tienes permisos para editar colores.');
        return;
    }
    if (!color_id) return;
    colorId = color_id;
    mostrarModal(htmlContent);
    gestionarValidaciones();

    const formulario = document.getElementById('form-editarColor');

    if (isAuthorize('colors.show')) {
        const infoColor = await get(`colors/${color_id}`);
        const color = infoColor.data;
        cargarFormulario(formulario, color);
    }
}

function gestionarValidaciones() {
    let nombre = document.querySelector("#nombreColor");
    let hex = document.querySelector("#hexColor");
    nombre.addEventListener('keydown', (e) => {
        validarTexto(e);
        validarMaximo(e, 30);
    });
    nombre.addEventListener('blur', (e) => validarCampo(e));
    hex.addEventListener('blur', (e) => validarCampo(e));
}

async function validarSubmit(e) {
    if (validarCampos(e)) {
        let botonEditar = document.querySelector('#btnEditarColor');
        let textoOriginal = botonEditar.textContent;
        botonEditar.disabled = true;
        botonEditar.textContent = "cargando...";
        let response = await patch(datos, `colors/${colorId}`);
        console.log(response);
        
        botonEditar.textContent = textoOriginal;
        botonEditar.disabled = false;
        if (response.success) {
            cerrarTodos();
            let confirmacion = success(response.message);
            e.target.reset();
            if ((await confirmacion).isConfirmed) coloresController();
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
    if (e.target.closest('#form-editarColor')) await validarSubmit(e);
});
