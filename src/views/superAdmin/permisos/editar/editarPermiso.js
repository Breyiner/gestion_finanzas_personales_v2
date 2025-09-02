import { get, patch } from '../../../../helpers/api';
import { cerrarTodos, mostrarModal } from '../../../../helpers/modalManagement';
import { datos, validarCampo, validarCampos, validarMaximo, validarTexto } from '../../../../helpers/validaciones';
import { permissionsController } from '../permisosController';
import { errorModal } from '../../../../components/modales/modalError';
import { success } from '../../../../helpers/alertas';
import htmlContent from './editarPermiso.html?raw';

let permissionId = null;

export default async (parametros) => {
    permissionId = parametros?.permission_id || null;
    if (!permissionId) return;

    mostrarModal(htmlContent);

    const { data } = await get(`permissions/${permissionId}`);
    document.querySelector('#nombrePermission').value = data.name;
    document.querySelector('#descripcionPermission').value = data.description || '';

    const nombre = document.querySelector('#nombrePermission');
    nombre.addEventListener('keydown', e => { validarTexto(e); validarMaximo(e, 30); });
    nombre.addEventListener('blur', e => validarCampo(e));

    const descripcion = document.querySelector('#descripcionPermission');
    descripcion.addEventListener('keydown', e => validarMaximo(e, 200));
};

async function validarSubmit(e) {
    if (validarCampos(e)) {
        const btn = document.querySelector('#btnEditarPermission');
        const txt = btn.textContent;
        btn.disabled = true;
        btn.textContent = "cargando...";

        if (!datos.description) datos.description = null;

        const response = await patch(datos, `permissions/${permissionId}`);

        btn.textContent = txt;
        btn.disabled = false;

        if (response.success) {
            cerrarTodos();
            success(response.message);
            e.target.reset();
            permissionsController();
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
    if (e.target.closest('#form-editarPermission')) await validarSubmit(e);
});
