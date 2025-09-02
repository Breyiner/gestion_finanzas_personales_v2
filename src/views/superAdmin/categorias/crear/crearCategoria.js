import { errorModal } from '../../../../components/modales/modalError';
import { success } from '../../../../helpers/alertas';
import { post, get } from '../../../../helpers/api';
import { cerrarTodos, mostrarModal } from '../../../../helpers/modalManagement';
import { datos, validarCampo, validarCampos, validarMaximo, validarTexto } from '../../../../helpers/validaciones';
import { categoriasController } from '../categoriasController';
import htmlContent from './crearCategoria.html?raw';

export default async () => {
    mostrarModal(htmlContent);
    await cargarTiposMovimientos();
    await cargarIconos();
    gestionarValidaciones();
};

async function cargarTiposMovimientos() {
    const select = document.querySelector('#tipoMovimientoCategoria');
    const { data } = await get('transactionTypes');
    select.innerHTML = '<option value="">Seleccione un tipo</option>';
    data.forEach(t => {
        const option = document.createElement('option');
        option.value = t.id;
        option.textContent = t.name;
        select.append(option);
    });
}

async function cargarIconos() {
    const select = document.querySelector('#iconoCategoria');
    const { data } = await get('icons');
    select.innerHTML = '<option value="">Seleccione un icono</option>';
    data.forEach(icon => {
        const option = document.createElement('option');
        option.value = icon.id;
        option.textContent = icon.icon;
        select.append(option);
    });
}


function gestionarValidaciones() {
    const nombre = document.querySelector('#nombreCategoria');
    nombre.addEventListener('keydown', e => { validarTexto(e); validarMaximo(e, 30); });
    nombre.addEventListener('blur', e => validarCampo(e));
    document.querySelector('#tipoMovimientoCategoria').addEventListener('blur', e => validarCampo(e));
    document.querySelector('#iconoCategoria').addEventListener('blur', e => validarCampo(e));
}

async function validarSubmit(e) {
    if (validarCampos(e)) {
        const btn = document.querySelector('#btnCrearCategoria');
        const txt = btn.textContent;
        btn.disabled = true;
        btn.textContent = "cargando...";

        const response = await post(datos, 'transactionCategories');

        btn.textContent = txt;
        btn.disabled = false;

        if (response.success) {
            cerrarTodos();
            success(response.message);
            e.target.reset();
            categoriasController();
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
    if (e.target.closest('#form-crearCategoria')) await validarSubmit(e);
});
