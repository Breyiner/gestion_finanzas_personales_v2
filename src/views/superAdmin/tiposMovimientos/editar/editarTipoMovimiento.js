import { get, patch } from '../../../../helpers/api';
import { cerrarTodos, mostrarModal } from '../../../../helpers/modalManagement';
import { datos, validarCampo, validarCampos, validarMaximo, validarTexto } from '../../../../helpers/validaciones';
import { tiposMovimientosController } from '../tiposMovimientosController';
import { errorModal } from '../../../../components/modales/modalError';
import htmlContent from './editarTipoMovimiento.html?raw'; // Reutilizamos el mismo HTML
import { isAuthorize } from '../../../../helpers/auth';
import { success } from '../../../../helpers/alertas';

let tipoId = null;

export default async (parametros = null) => {
    const { tipo_id } = parametros || {};
    if (!isAuthorize('transaction-types.update')) {
        await errorModal('No tienes permisos para editar tipos de movimiento.');
        return;
    }
    if (!tipo_id) return;

    tipoId = tipo_id;
    mostrarModal(htmlContent);

    await cargarColores();
    await cargarIconos(); // <-- cargamos iconos
    gestionarValidaciones();

    if (isAuthorize('transaction-types.show')) {
        const infoTipo = await get(`transactionTypes/${tipo_id}`);
        const tipo = infoTipo.data;
        cargarFormulario(tipo);
    }
};

async function cargarColores() {
    const selectColor = document.getElementById('colorTipoMovimiento');
    const { data: colores } = await get('colors');
    colores.forEach(color => {
        const option = document.createElement('option');
        option.value = color.id;
        option.textContent = `${color.name} (${color.hex})`;
        selectColor.append(option);
    });
}

async function cargarIconos() {
    const selectIcon = document.getElementById('iconTipoMovimiento');
    const { data: iconos } = await get('icons');
    iconos.forEach(icon => {
        const option = document.createElement('option');
        option.value = icon.id;
        option.textContent = `${icon.name} (${icon.icon})`; // muestra nombre + clase
        selectIcon.append(option);
    });
}

function gestionarValidaciones() {
    const nombre = document.querySelector("#nombreTipoMovimiento");
    nombre.addEventListener('keydown', (e) => {
        validarTexto(e);
        validarMaximo(e, 30);
    });
    nombre.addEventListener('blur', (e) => validarCampo(e));

    const selectColor = document.querySelector("#colorTipoMovimiento");
    selectColor.addEventListener('blur', (e) => validarCampo(e));

    const selectIcon = document.querySelector("#iconTipoMovimiento");
    selectIcon.addEventListener('blur', (e) => validarCampo(e));
}

async function cargarFormulario(data) {
    document.getElementById('nombreTipoMovimiento').value = data.name || '';
    document.getElementById('colorTipoMovimiento').value = data.color_id || '';
    document.getElementById('iconTipoMovimiento').value = data.icon_id || ''; // <-- seleccionamos el icono
}

async function validarSubmit(e) {
    if (validarCampos(e)) {
        const botonEditar = document.querySelector('#btnCrearTipoMovimiento');
        const textoOriginal = botonEditar.textContent;
        botonEditar.disabled = true;
        botonEditar.textContent = "cargando...";

        const response = await patch(datos, `transactionTypes/${tipoId}`);

        botonEditar.textContent = textoOriginal;
        botonEditar.disabled = false;

        if (response.success) {
            cerrarTodos();
            const confirmacion = success(response.message);
            e.target.reset();
            if ((await confirmacion).isConfirmed) tiposMovimientosController();
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
    if (e.target.closest('#form-editarTipoMovimiento')) await validarSubmit(e);
});
