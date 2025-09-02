// userModal.js
import { get, post } from '../../../helpers/api.js';
import { cerrarModal, mostrarModal } from '../../../helpers/modalManagement.js';
import htmlContent from  './crearMeta.html?raw';
import * as validate from "../../../helpers/validaciones.js";
import { error, success } from '../../../helpers/alertas.js';
import { metasController } from '../metasController.js';
import { errorModal } from '../../../components/modales/modalError.js';
import { isAuthorize } from '../../../helpers/auth.js';

let usuario_id = null;

export default async (parametros = null) => {

    // usuario_id = parseInt(localStorage.getItem('usuario_id'));

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

    form.addEventListener('submit', await manejarSubmitMeta);
}

async function manejarSubmitMeta(e) {
    e.preventDefault();

    const submitBtn = document.getElementById('btnCrearMeta');
    const textoOriginal = submitBtn.textContent;
    
    let datosMeta = {};
    
    if(validate.validarCampos(e)){
        
        datosMeta = {...validate.datos};
        
        datosMeta.user_id = parseInt(localStorage.getItem('user_id'));
        
        if(!datosMeta.due_date) datosMeta.due_date = null;
        if(!datosMeta.description) datosMeta.description = null;
        console.log(datosMeta);
        
        submitBtn.disabled = true;
        submitBtn.textContent = 'Guardando...';
        
        if(isAuthorize('goals.store')) await guardarMeta(datosMeta);

        submitBtn.disabled = false;
        submitBtn.textContent = textoOriginal;
    }
    
}


async function guardarMeta(data) {

    let metaCreada = await post(data, 'goals');
        
    console.log(metaCreada);
    
    if(!metaCreada.success) {

        if(metaCreada.errors)  {
           await errorModal(metaCreada.errors[0]);
            return;
        }
           await errorModal(metaCreada.message);
    }
    else{
        cerrarModal();
        success(metaCreada.message);
    }
}
