import { success } from '../../../../helpers/alertas';
import { post } from '../../../../helpers/api';
import { cerrarTodos, mostrarModal } from '../../../../helpers/modalManagement';
import { datos, validarCampo, validarCampos, validarMaximo, validarTexto } from '../../../../helpers/validaciones';
import { coloresController } from '../coloresController';
import { errorModal } from '../../../../components/modales/modalError';
import htmlContent from './crearColor.html?raw';
import { isAuthorize } from '../../../../helpers/auth';

export default async (parametros = null) => {
    if (!isAuthorize('colors.store')) {
        await errorModal('No tienes permisos para crear colores.');
        return;
    }
    mostrarModal(htmlContent);
    gestionarValidaciones();
};

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
        let botonCrear = document.querySelector('#btnCrearColor');
        let textoOriginal = botonCrear.textContent;
        botonCrear.disabled = true;
        botonCrear.textContent = "cargando...";
        let response = await post(datos, 'colors');
        botonCrear.textContent = textoOriginal;
        botonCrear.disabled = false;
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

document.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (e.target.closest('#form-crearColor')) await validarSubmit(e);
});
