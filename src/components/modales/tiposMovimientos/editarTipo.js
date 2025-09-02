import { success } from '../../../helpers/alertas';
import { get, put } from '../../../helpers/api';
import { cerrarTodos, mostrarModal } from '../../../helpers/modalManagement';
import { datos, validarCampo, validarCampos, validarMaximo, validarTexto } from '../../../helpers/validaciones';
import { tiposMovimientosController } from '../../../views/admin/tiposMovimientos/tiposMovimientosController';
import { errorModal } from '../modalError';
import htmlContent from './editarTipo.html?raw';

let tipoId = null;

export const abrirModalEditTipo = async (idTipo) => {

    tipoId = idTipo;

    // Crear y mostrar el modal
    mostrarModal(htmlContent);
    
    // Ahora configurar la funcionalidad
    gestionarValidaciones();

    const formulario = document.getElementById('form-editarTipo');
    const infoTipo = await get(`tiposMovimiento/${idTipo}`);

    const tipo = infoTipo.data; 
    console.log(tipo);
    

    cargarFormulario(formulario, tipo);
};

function gestionarValidaciones() {

    let nombre = document.querySelector("#nombreTipo");
    let icono  = document.querySelector('#claseIconoTipo');
    
    nombre.addEventListener('keydown', (e) => {
        validarTexto(e);
        validarMaximo(e, 30);
    })
    
    icono.addEventListener('keydown', (e) => {
        validarTexto(e);
        validarMaximo(e, 30);
    })
    


    nombre.addEventListener('blur', (e) => validarCampo(e));
    icono.addEventListener('blur', (e) => validarCampo(e));
}

async function validarSubmit(e) {

    if(validarCampos(e)) {
        
        console.log(datos);
        let botonEditar = document.querySelector(('#btnEditarTipo'));
        let textoOriginal = botonEditar.textContent;
        botonEditar.disabled = true;
        botonEditar.textContent = "cargando...";
        
        let response = await put(datos, `tiposMovimiento/${tipoId}`);
        
        botonEditar.textContent = textoOriginal;
        botonEditar.disabled = false;

        if(response.success) {
            cerrarTodos();
            let confirmacion = success(response.message);
            e.target.reset();   
            if((await confirmacion).isConfirmed) tiposMovimientosController();
        }
        else {
            if(response.errors.length > 0)  {
                await errorModal(response.errors[0]);
                return;
            }
                await errorModal(response.message);
        }
    }

}

async function cargarFormulario(formulario, data) {
    
    const campos = formulario.querySelectorAll('input, textarea, select');
    campos.forEach(async campo => {
        
        if(campo.getAttribute('name') in data)
            campo.value = data[campo.getAttribute('name')];
        
    });
}

document.addEventListener('submit', async (e) => {
    
    e.preventDefault();

    if(e.target.closest('#form-editarTipo')) await validarSubmit(e);
    
})