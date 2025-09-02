import { get, patch } from '../../../../helpers/api';
import { cerrarTodos, mostrarModal } from '../../../../helpers/modalManagement';
import { datos, validarCampo, validarCampos, validarMaximo, validarTexto } from '../../../../helpers/validaciones';
import { tiposMovimientosMetaController } from '../tiposMovimientosMetasController';
import { errorModal } from '../../../../components/modales/modalError';
import htmlContent from './editarTipoMovimientoMeta.html?raw';
import { isAuthorize } from '../../../../helpers/auth';
import { success } from '../../../../helpers/alertas';

let tipoId = null;

export default async (parametros) => {
    const { tipo_id } = parametros || {};
    if(!isAuthorize('goal-transaction-types.update')){
        await errorModal('No tienes permisos para editar tipos de movimiento meta.');
        return;
    }
    if(!tipo_id) return;
    tipoId = tipo_id;

    mostrarModal(htmlContent);
    await cargarColores();
    await cargarIconos();
    gestionarValidaciones();

    if(isAuthorize('goal-transaction-types.show')){
        const { data } = await get(`goalTransactionTypes/${tipo_id}`);
        cargarFormulario(data);
    }
};

async function cargarColores(){
    const select = document.getElementById('colorTipoMovimientoMeta');
    const { data: colores } = await get('colors');
    select.innerHTML = '<option value="">Seleccione un color</option>';
    colores.forEach(c => {
        const option = document.createElement('option');
        option.value = c.id;
        option.textContent = `${c.name} (${c.hex})`;
        select.append(option);
    });
}

async function cargarIconos(){
    const select = document.getElementById('iconTipoMovimientoMeta');
    const { data: iconos } = await get('icons');
    select.innerHTML = '<option value="">Seleccione un icono</option>';
    iconos.forEach(icon => {
        const option = document.createElement('option');
        option.value = icon.id;
        option.textContent = `${icon.name} (${icon.icon})`;
        select.append(option);
    });
}

function gestionarValidaciones(){
    const nombre = document.querySelector('#nombreTipoMovimientoMeta');
    nombre.addEventListener('keydown', e => { validarTexto(e); validarMaximo(e,30); });
    nombre.addEventListener('blur', e => validarCampo(e));

    const selects = [ '#colorTipoMovimientoMeta', '#iconTipoMovimientoMeta' ];
    selects.forEach(sel => document.querySelector(sel).addEventListener('blur', e=> validarCampo(e)));
}

function cargarFormulario(data){
    document.querySelector('#nombreTipoMovimientoMeta').value = data.name;
    document.querySelector('#colorTipoMovimientoMeta').value = data.color_id || "";
    document.querySelector('#iconTipoMovimientoMeta').value = data.icon_id || "";
}

async function validarSubmit(e){
    if(validarCampos(e)){
        const btn = document.querySelector('#btnEditarTipoMovimientoMeta');
        const txt = btn.textContent;
        btn.disabled = true;
        btn.textContent = 'cargando...';

        const response = await patch(datos, `goalTransactionTypes/${tipoId}`);

        btn.textContent = txt;
        btn.disabled = false;

        if(response.success){
            cerrarTodos();
            const confirmacion = success(response.message);
            e.target.reset();
            if((await confirmacion).isConfirmed) tiposMovimientosMetaController();
        } else {
            if(response.errors.length > 0){ await errorModal(response.errors[0]); return; }
            await errorModal(response.message);
        }
    }
}

document.addEventListener('submit', async e=>{
    e.preventDefault();
    if(e.target.closest('#form-editarTipoMovimientoMeta')) await validarSubmit(e);
});
