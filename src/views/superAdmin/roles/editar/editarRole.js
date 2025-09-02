import { get, patch } from '../../../../helpers/api';
import { cerrarTodos, mostrarModal } from '../../../../helpers/modalManagement';
import { datos, validarCampo, validarCampos, validarMaximo, validarTexto } from '../../../../helpers/validaciones';
import { rolesController } from '../rolesController';
import { errorModal } from '../../../../components/modales/modalError';
import { success } from '../../../../helpers/alertas';
import htmlContent from './editarRole.html?raw';

let roleId = null;

export default async (parametros) => {
    roleId = parametros?.role_id || null;
    if (!roleId) return;

    mostrarModal(htmlContent);

    if (roleId) {
        const { data } = await get(`roles/${roleId}`);
        document.querySelector('#nombreRole').value = data.name;
    }

    const nombre = document.querySelector('#nombreRole');
    nombre.addEventListener('keydown', e => { validarTexto(e); validarMaximo(e, 30); });
    nombre.addEventListener('blur', e => validarCampo(e));
};

async function validarSubmit(e) {
    if (validarCampos(e)) {
        const btn = document.querySelector('#btnEditarRole');
        const txt = btn.textContent;
        btn.disabled = true;
        btn.textContent = "cargando...";

        const response = await patch(datos, `roles/${roleId}`);

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
    if (e.target.closest('#form-editarRole')) await validarSubmit(e);
});
