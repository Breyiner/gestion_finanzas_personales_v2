// userModal.js
// import { get, post } from '../../helpers/api';
import { get, post } from '../../../../helpers/api';
import { isAuthorize } from '../../../../helpers/auth';
import { cerrarModal, cerrarTodos, mostrarModal } from '../../../../helpers/modalManagement';
import htmlContent from  './registrarMovimiento.html?raw';
import * as validate from "../../../../helpers/validaciones";
import { errorModal } from '../../../../components/modales/modalError';
import { success } from '../../../../helpers/alertas';
// import { error, success } from '../../helpers/alertas.js';
// import { errorModal } from './modalError.js';

let usuario_id = null;
let fechaCreacion = null;
let funcControlador = null;
let idTipoMovimiento = null;

export default async (parametros = null) => {

  usuario_id = parseInt(localStorage.getItem('user_id'));
  idTipoMovimiento = parseInt(localStorage.getItem('id_tipo_movimiento'));

    // Crear y mostrar el modal
    mostrarModal(htmlContent);
    
    // Ahora configurar la funcionalidad
    await configurarModalMovimiento();
};

async function configurarModalMovimiento() {
    // Cargar selects
    if(isAuthorize('transaction-types.index')) await cargarTipos();
    
    // Configurar formulario
    const form = document.getElementById('form-nuevoMovimiento');

    let monto = document.getElementById('montoMovimiento');
    let descripcion = document.getElementById('descripcionMovimiento');
    const selectTipos = document.getElementById('tiposMovimiento');
    const selectCategorias = document.getElementById('categoriasMovimiento');

    selectTipos.value = idTipoMovimiento;

    if(isAuthorize('transaction-categories.index')) await cargarCategorias(selectTipos.value);

    monto.addEventListener('keydown', (e) => {
        validate.validarMaximo(e, 10);
        validate.validarNumeros(e);
    });
    descripcion.addEventListener('keydown', (e) => {
        validate.validarMaximo(e, 50)
    });

    monto.addEventListener("blur", validate.validarCampo);
    selectTipos.addEventListener("blur", validate.validarCampo);
    selectCategorias.addEventListener("blur", validate.validarCampo);

    form.addEventListener('submit', await manejarSubmitMovimiento);
}

async function cargarTipos() {
    const selectTipos = document.getElementById('tiposMovimiento');
    
    const {data} = await get(`transactionTypes`);
    
    selectTipos.innerHTML = '<option value="">Seleccione...</option>';
    data.forEach((tipo, i) => {
        if(i != 2)
            selectTipos.innerHTML += `<option value="${tipo.id}">${tipo.name}</option>`;
    });

}
    
async function cargarCategorias(idTipo) {
        
    const selectCategorias = document.getElementById('categoriasMovimiento');
    selectCategorias.innerHTML = "";

    const {data} = await get(`transactionCategories/transactionTypes/${idTipo}`);
    
    selectCategorias.innerHTML = '<option value="">Seleccione...</option>';

    data.forEach(tipo => {
        
        selectCategorias.innerHTML += `<option value="${tipo.id}">${tipo.name}</option>`;
    });
}

async function manejarSubmitMovimiento(e) {
    e.preventDefault();

    const submitBtn = document.getElementById('btnCrearMovimiento');
    const textoOriginal = submitBtn.textContent;

    
    let datosMovimiento = {};
    
    if(validate.validarCampos(e)){
        
        datosMovimiento = validate.datos;
        
        delete datosMovimiento["transaction_type_id"];
        
        datosMovimiento.user_id = usuario_id;
        
        datosMovimiento.created_at = localStorage.getItem('fecha_calendario');
        
        submitBtn.disabled = true;
        submitBtn.textContent = 'Guardando...';

        await guardarMovimiento(datosMovimiento);

        submitBtn.disabled = false;
        submitBtn.textContent = textoOriginal;
    }
    
}


async function guardarMovimiento(data) {

    if(isAuthorize('transactions.store')) {
        let movimientoCreado = await post(data, 'transactions');
            
          
        if(!movimientoCreado.success) {
    
            if(movimientoCreado.errors)  {
               await errorModal(movimientoCreado.errors[0]);
                return;
            }
               await errorModal(movimientoCreado.message);
            
        }
        else{
            cerrarTodos();
            let confirmacion = await success(movimientoCreado.message);
                
            if(confirmacion.isConfirmed) cerrarModal();
        }
    }
}
