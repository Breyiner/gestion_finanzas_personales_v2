import { success } from '../../../helpers/alertas';
import { get, put } from '../../../helpers/api';
import { cerrarTodos, mostrarModal } from '../../../helpers/modalManagement';
import { datos, validarCampo, validarCampos, validarMaximo, validarTexto } from '../../../helpers/validaciones';
import { ciudadesController } from '../../../views/superAdmin/ciudades/ciudadesController';
import { errorModal } from '../modalError';
import htmlContent from './editarCiudad.html?raw';

let ciudadId = null;

export const abrirModalEditCiudad = async (idCiudad) => {

    ciudadId = idCiudad;

    // Crear y mostrar el modal
    mostrarModal(htmlContent);
    
    // Ahora configurar la funcionalidad
    gestionarValidaciones();

    const formulario = document.getElementById('form-editarCiudad');
    const infoCiudad = await get(`ciudades/${idCiudad}`);

    const ciudad = infoCiudad.data; 
    console.log(ciudad);
    

    cargarFormulario(formulario, ciudad);
};

function gestionarValidaciones() {

    let nombre = document.querySelector("#nombreCiudad");
    
    nombre.addEventListener('keydown', (e) => {
        validarTexto(e);
        validarMaximo(e, 30);
    })
    


    nombre.addEventListener('blur', (e) => validarCampo(e));
}

async function validarSubmit(e) {

    if(validarCampos(e)) {
        
        console.log(datos);
        let botonEditar = document.querySelector(('#btnEditarCiudad'));
        let textoOriginal = botonEditar.textContent;
        botonEditar.disabled = true;
        botonEditar.textContent = "cargando...";
        
        let response = await put(datos, `ciudades/${ciudadId}`);
        
        botonEditar.textContent = textoOriginal;
        botonEditar.disabled = false;

        if(response.success) {
            cerrarTodos();
            let confirmacion = success(response.message);
            e.target.reset();   
            if((await confirmacion).isConfirmed) ciudadesController();
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

    if(e.target.closest('#form-editarCiudad')) await validarSubmit(e);
    
})