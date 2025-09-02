import { delet, get, put } from '../../../../helpers/api';
import { cerrarModal, cerrarTodos, mostrarModal } from '../../../../helpers/modalManagement';
import htmlContent from  './detallesMovimiento.html?raw';
import { validarTexto, validarNumeros, validarCampo, validarCampos, validarMaximo, datos } from '../../../../helpers/validaciones';
import { error, success } from '../../../../helpers/alertas';
import { confirmModal } from '../../../../components/modales/modalConfirm';
import { errorModal } from '../../../../components/modales/modalError';
import { isAuthorize } from '../../../../helpers/auth';

let usuario_id = null;

export default async (parametros = null) => {

  usuario_id = parseInt(localStorage.getItem('user_id'));

    // funcControlador = controlador;
    // Crear y mostrar el modal
    mostrarModal(htmlContent);
    
    const {movimiento_meta_id, movimiento_id} = parametros;
    
    // Ahora configurar la funcionalidad
    await configurarModalMovimiento(movimiento_meta_id, movimiento_id);
};

async function configurarModalMovimiento(movimiento_meta_id, movimiento_id) {

    const formulario = document.getElementById('form-detallesMovimiento');
    
    formEditable(formulario, false);

    if(isAuthorize('transaction-types.index')) await cargarTipos();

    if(movimiento_id) {
        if(isAuthorize('transactions.show-own')) {

            const {data} = await get(`transactions/${movimiento_id}`);
            console.log(data);
            
            await cargarFormulario(formulario, data);
        }    
    }
    else {

        if(isAuthorize('goal-transactions.show-own')) {

            const {data} = await get(`goalTransactions/${movimiento_meta_id}`);
            console.log(data);
            
            await cargarFormulario(formulario, data, true);
        }

    }
}

async function cargarTipos() {
    const selectTipos = document.getElementById('tiposMovimiento');
    
    const {data} = await get(`transactionTypes`);
    
    selectTipos.innerHTML = '<option value="">Seleccione...</option>';
    data.forEach((tipo, i) => {
        if(i != 2)
            selectTipos.innerHTML += `<option value="${tipo.id}">${tipo.name}</option>`;
    });


    selectTipos.addEventListener('change', async () => await cargarCategorias(selectTipos.value))
}

async function cargarCategorias(idTipo) {
        
    const selectCategorias = document.getElementById('categoriasMovimiento');
    selectCategorias.innerHTML = "";

    if (!idTipo) return;

    const {data} = await get(`transactionCategories/transactionTypes/${idTipo}`);
    
    selectCategorias.innerHTML = '<option value="">Seleccione...</option>';

    data.forEach(tipo => {
        
        selectCategorias.innerHTML += `<option value="${tipo.id}">${tipo.name}</option>`;
    });
}


async function cargarFormulario(formulario, data, isMeta = false) {
    
    const campos = formulario.querySelectorAll('input, textarea, select');

    if(isMeta) {

        const selectors = document.querySelector('.row-selectors');

        selectors.remove();

    }
    if(isAuthorize('transaction-categories.index') && !isMeta) await cargarCategorias(data.transaction_type_id);

    campos.forEach(async campo => {
        
        if(campo.getAttribute('name') in data)
            campo.value = data[campo.getAttribute('name')];
        
    });
}

function formEditable(form, editable) {
    
    const campos = form.querySelectorAll('input, textarea, select');

    campos.forEach(campo => campo.disabled = !editable);

}

document.addEventListener('click', e => {

    if(e.target.closest('#cerrarMovimiento')) cerrarModal();

});