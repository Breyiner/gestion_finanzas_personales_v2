import { post } from '../../../../helpers/api';
import { cerrarTodos, mostrarModal } from '../../../../helpers/modalManagement';
import { datos, validarCampo, validarCampos, validarMaximo, validarTexto } from '../../../../helpers/validaciones';
import { rolesController } from '../rolesController';
import { errorModal } from '../../../../components/modales/modalError';
import { success } from '../../../../helpers/alertas';
import htmlContent from './crearRole.html?raw';

export default async () => {
    mostrarModal(htmlContent);
    const nombre = document.querySelector('#nombreRole');
    nombre.addEventListener('keydown', e => { validarTexto(e); validarMaximo(e, 30); });
    nombre.addEventListener('blur', e => validarCampo(e));
};

async function validarSubmit(e) {
    if (validarCampos(e)) {
        const btn = document.querySelector('#btnCrearRole');
        const txt = btn.textContent;
        btn.disabled = true;
        btn.textContent = "cargando...";

        const response = await post(datos, 'roles');

        btn.textContent = txt;
        btn.disabled = false;

        if (response.success) {
            cerrarTodos();
            success(response.message);
            e.target.reset();
            rolesController();
        } else {
            if (response.errors) {
                await errorModal(response.errors[0]);
                return;
            }
            await errorModal(response.message);
        }
    }
}

document.addEventListener('submit', async e => {
    e.preventDefault();
    if (e.target.closest('#form-crearRole')) await validarSubmit(e);
});
