import { get, patch } from '../../../../helpers/api';
import { cerrarTodos, mostrarModal } from '../../../../helpers/modalManagement';
import { datos, validarCampo, validarCampos, validarMaximo, validarTexto } from '../../../../helpers/validaciones';
import { categoriasController } from '../categoriasController';
import { errorModal } from '../../../../components/modales/modalError';
import { success } from '../../../../helpers/alertas';
import htmlContent from './editarCategoria.html?raw';

let categoriaId = null;

export default async (parametros) => {
    categoriaId = parametros?.categoria_id || null;
    if (!categoriaId) return;

    mostrarModal(htmlContent);
    await cargarTiposMovimientos();
    await cargarIconos();

    if (categoriaId) {
        const { data } = await get(`transactionCategories/${categoriaId}`);
        console.log(data);
        cargarFormulario(data);
    }

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

function cargarFormulario(data) {
    document.querySelector('#nombreCategoria').value = data.name;
    document.querySelector('#tipoMovimientoCategoria').value = data.transaction_type_id || "";
    document.querySelector('#iconoCategoria').value = data.icon_id || "";
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
        const btn = document.querySelector('#btnEditarCategoria');
        const txt = btn.textContent;
        btn.disabled = true;
        btn.textContent = "cargando...";

        const response = await patch(datos, `transactionCategories/${categoriaId}`);

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
    if (e.target.closest('#form-editarCategoria')) await validarSubmit(e);
});
