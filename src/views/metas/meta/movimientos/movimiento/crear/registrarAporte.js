// userModal.js
import { post } from '../../../../../../helpers/api.js';
import { cerrarModal, cerrarTodos, mostrarModal } from '../../../../../../helpers/modalManagement.js';
import htmlContent from  './registrarAporte.html?raw';
import * as validate from "../../../../../../helpers/validaciones.js";
import { error, success } from '../../../../../../helpers/alertas.js';
import { metasController } from '../../../../metasController.js';
import { errorModal } from '../../../../../../components/modales/modalError.js';

export default async (parametros = null) => {
    // Crear y mostrar el modal
    mostrarModal(htmlContent);
    
    // Ahora configurar la funcionalidad
    await configurarModalAporte();
};

async function configurarModalAporte() {
    
    // Configurar formulario
    const form = document.getElementById('form-nuevoAporte');

    let monto = document.getElementById('montoAporte');
    let descripcion = document.getElementById('descripcionAporte');

    monto.addEventListener('keydown', (e) => {
        validate.validarMaximo(e, 10)
        validate.validarNumeros(e);
    });
    descripcion.addEventListener('keydown', (e) => {
        validate.validarMaximo(e, 50);
    });

    monto.addEventListener("blur", validate.validarCampo);
    descripcion.addEventListener("blur", validate.validarCampo);

    form.addEventListener('submit', async (e) => await manejarSubmitAporte(e));
}

async function manejarSubmitAporte(e) {
    e.preventDefault();

    const submitBtn = document.getElementById('btnCrearAporte');
    const textoOriginal = submitBtn.textContent;
    
    let datosAporte = {};
    
    if(validate.validarCampos(e)){
        
        datosAporte = validate.datos;
        datosAporte.goal_id = parseInt(localStorage.getItem('id_meta'));
        datosAporte.transaction_type_id = parseInt(localStorage.getItem('id_tipo_movimiento_meta'));
        
        console.log(datosAporte);
        
        submitBtn.disabled = true;
        submitBtn.textContent = 'Guardando...';
        
        await guardarAporte(datosAporte);
        
        submitBtn.disabled = false;
        submitBtn.textContent = textoOriginal;
    }
    
}


async function guardarAporte(data) {

    let response = await post(data, 'goalTransactions');
        console.log(response);
        
        if(!response.success) {
          
          if(response.errors.length > 0)  {
            await errorModal(response.errors[0]);
            return;
          }
          await errorModal(response.message);
        }
        else{
        cerrarTodos();
        success(response.message);
    }
}
