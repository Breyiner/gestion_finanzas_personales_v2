// userModal.js
import { post } from '../../helpers/api';
import { cerrarTodos, mostrarModal } from '../../helpers/modalManagement';
import htmlContent from  './registrarAporte.html?raw';
import * as validate from "../../helpers/validaciones.js";
import { error, success } from '../../helpers/alertas.js';
import { metasController } from '../../views/metas/metasController.js';

export const abrirModalNewAporte = async (idMeta) => {
    // Crear y mostrar el modal
    mostrarModal(htmlContent);
    
    // Ahora configurar la funcionalidad
    await configurarModalAporte(idMeta);
};

async function configurarModalAporte(idMeta) {
    
    // Configurar formulario
    const form = document.getElementById('form-nuevoAporte');

    let monto = document.getElementById('montoAporte');
    let descripcion = document.getElementById('descripcionAporte');

    monto.addEventListener('keydown', (e) => {
        validate.validarMaximo(e, 10)
        validate.validarNumeros(e);
    });
    descripcion.addEventListener('keydown', (e) => {
        validate.validarTexto(e);
        validate.validarMaximo(e, 50)
    });

    monto.addEventListener("blur", validate.validarCampo);
    descripcion.addEventListener("blur", validate.validarCampo);

    form.addEventListener('submit', async (e) => await manejarSubmitAporte(e, idMeta));
}

async function manejarSubmitAporte(e, idMeta) {
    e.preventDefault();

    const submitBtn = document.getElementById('btnCrearAporte');
    
    let datosAporte = {};
    
    if(validate.validarCampos(e)){
        
        datosAporte = validate.datos;
        datosAporte.meta_id = Number(idMeta);
        
        console.log(datosAporte);
        
        submitBtn.disabled = true;
        submitBtn.textContent = 'Guardando...';

        await guardarAporte(datosAporte);

    }
    
}


async function guardarAporte(data) {

    let response = await post(data, 'aportes');
        console.log(response);
        
    cerrarTodos();
    if(!response.success) {

        error(response.message);
        return;
    }
    else{
        let confirmacion = await success(response.message);
            
        if(confirmacion.isConfirmed) await metasController();
    }
}
