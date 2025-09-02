import { get, post } from '../../../../helpers/api';
import { cerrarTodos, mostrarModal } from '../../../../helpers/modalManagement';
import { datos, validarCampo, validarCampos, validarMaximo, validarTexto } from '../../../../helpers/validaciones';
import { tiposMovimientosController } from '../tiposMovimientosController';
import { errorModal } from '../../../../components/modales/modalError';
import htmlContent from './crearTipoMovimiento.html?raw';
import { isAuthorize } from '../../../../helpers/auth';
import { success } from '../../../../helpers/alertas';

export default async (parametros = null) => {
    if (!isAuthorize('transaction-types.store')) {
        await errorModal('No tienes permisos para crear tipos de movimiento.');
        return;
    }
    mostrarModal(htmlContent);
    await cargarColores();
    await cargarIconos();
    gestionarValidaciones();
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
}

async function validarSubmit(e) {
    if (validarCampos(e)) {
        const botonCrear = document.querySelector('#btnCrearTipoMovimiento');
        const textoOriginal = botonCrear.textContent;
        botonCrear.disabled = true;
        botonCrear.textContent = "cargando...";

        const response = await post(datos, 'transactionTypes');

        botonCrear.textContent = textoOriginal;
        botonCrear.disabled = false;

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
    if (e.target.closest('#form-crearTipoMovimiento')) await validarSubmit(e);
});
