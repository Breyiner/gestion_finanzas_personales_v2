// userModal.js
import { get, post } from '../../helpers/api';
import { cerrarModal, mostrarModal } from '../../helpers/modalManagement';
import htmlContent from  './registrarMovimiento.html?raw';
import * as validate from "../../helpers/validaciones.js";
import { error, success } from '../../helpers/alertas.js';
import { homeController } from '../../views/home/homeController.js';

export const abrirModalNewMovimiento = async () => {
    // Crear y mostrar el modal
    mostrarModal(htmlContent);
    
    // Ahora configurar la funcionalidad
    await configurarModalMovimiento();
};

async function configurarModalMovimiento() {
    // Cargar selects
    await cargarTipos();
    
    // Configurar formulario
    const form = document.getElementById('form-nuevoMovimiento');

    let nombre = document.getElementById('nombreMovimiento');
    let monto = document.getElementById('montoMovimiento');
    let descripcion = document.getElementById('descripcionMovimiento');
    const selectTipos = document.getElementById('tiposMovimiento');
    const selectCategorias = document.getElementById('categoriasMovimiento');


    nombre.addEventListener('keydown', (e) => validate.validarMaximo(e, 30));
    monto.addEventListener('keydown', (e) => {
        validate.validarMaximo(e, 15)
        validate.validarNumeros(e);
    });
    descripcion.addEventListener('keydown', (e) => validate.validarMaximo(e, 50));

    nombre.addEventListener("blur", validate.validarCampo);
    monto.addEventListener("blur", validate.validarCampo);
    descripcion.addEventListener("blur", validate.validarCampo);
    selectTipos.addEventListener("blur", validate.validarCampo);
    selectCategorias.addEventListener("blur", validate.validarCampo);

    form.addEventListener('submit', await manejarSubmitMovimiento);
}

async function cargarTipos() {
    const selectTipos = document.getElementById('tiposMovimiento');
    
    const {data} = await get(`tiposMovimiento`);
    
    selectTipos.innerHTML = '<option value="">Seleccione...</option>';
    data.forEach((tipo, i) => {
        if(i != 2)
            selectTipos.innerHTML += `<option value="${tipo.id}">${tipo.nombre}</option>`;
    });


    selectTipos.addEventListener('change', async () => await cargarCategorias(selectTipos.value))
}
    
async function cargarCategorias(idTipo) {
        
    const selectCategorias = document.getElementById('categoriasMovimiento');
    selectCategorias.innerHTML = "";

    const {data} = await get(`categorias/tipoMovimiento/${idTipo}`);
    
    selectCategorias.innerHTML = '<option value="">Seleccione...</option>';

    data.forEach(tipo => {
        
        selectCategorias.innerHTML += `<option value="${tipo.id}">${tipo.nombre}</option>`;
    });
}

async function manejarSubmitMovimiento(e) {
    e.preventDefault();

    const submitBtn = document.getElementById('btnCrearMovimiento');
    const originalText = submitBtn.textContent;

    
    let datosMovimiento = {};
    
    if(validate.validarCampos(e)){
        
        datosMovimiento = validate.datos;
        
        delete datosMovimiento["tipo_movimiento_id"];
        
        datosMovimiento.usuario_id = 1;
        
        submitBtn.disabled = true;
        submitBtn.textContent = 'Guardando...';

        await guardarMovimiento(datosMovimiento);

    }
    
}


async function guardarMovimiento(data) {

    let movimientoCreado = await post(data, 'movimientos');
        
      
    if(!movimientoCreado.success) {

        error(movimientoCreado.message);
        return;
    }
    else{
        cerrarModal();
        let confirmacion = await success(movimientoCreado.message);
            
        if(confirmacion.isConfirmed) homeController();
    }
}
