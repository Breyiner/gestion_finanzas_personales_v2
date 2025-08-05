// userModal.js
import { get, post } from '../../helpers/api';
import { cerrarModal, mostrarModal } from '../../helpers/modalManagement';
import htmlContent from  './crearMeta.html?raw';
import * as validate from "../../helpers/validaciones.js";
import { error, success } from '../../helpers/alertas.js';
import { metasController } from '../../views/metas/metasController.js';

let usuario_id = null;

export const abrirModalNewMeta = async () => {

  usuario_id = parseInt(localStorage.getItem('usuario_id'));

    // Crear y mostrar el modal
    mostrarModal(htmlContent);
    
    // Ahora configurar la funcionalidad
    await configurarModalMeta();
};

async function configurarModalMeta() {
    
    // Configurar formulario
    const form = document.getElementById('form-nuevaMeta');

    let nombre = document.getElementById('nombreMeta');
    let monto = document.getElementById('montoMeta');
    let descripcion = document.getElementById('descripcionMeta');


    nombre.addEventListener('keydown', (e) => {
        validate.validarTexto(e);
        validate.validarMaximo(e, 30)
    });
    monto.addEventListener('keydown', (e) => {
        validate.validarMaximo(e, 10)
        validate.validarNumeros(e);
    });
    descripcion.addEventListener('keydown', (e) => {
        validate.validarMaximo(e, 50)
    });

    nombre.addEventListener("blur", validate.validarCampo);
    monto.addEventListener("blur", validate.validarCampo);
    descripcion.addEventListener("blur", validate.validarCampo);

    form.addEventListener('submit', await manejarSubmitMeta);
}

async function manejarSubmitMeta(e) {
    e.preventDefault();

    const submitBtn = document.getElementById('btnCrearMeta');
    
    let datosMeta = {};
    
    if(validate.validarCampos(e)){
        
        datosMeta = {...validate.datos};
        
        datosMeta.usuario_id = usuario_id;
        
        if(!datosMeta.fecha_limite) datosMeta.fecha_limite = null;
        console.log(datosMeta);
        
        submitBtn.disabled = true;
        submitBtn.textContent = 'Guardando...';
        
        await guardarMeta(datosMeta);

    }
    
}


async function guardarMeta(data) {

    let metaCreada = await post(data, 'metas');
        
    console.log(metaCreada);
    
    if(!metaCreada.success) {

        error(metaCreada.message);
        cerrarModal();
    }
    else{
        cerrarModal();
        let confirmacion = await success(metaCreada.message);
            
        if(confirmacion.isConfirmed) metasController();
    }
}
