import { success } from '../../../helpers/alertas';
import { get, put } from '../../../helpers/api';
import { cerrarTodos, mostrarModal } from '../../../helpers/modalManagement';
import { datos, validarCampo, validarCampos, validarMaximo, validarTexto } from '../../../helpers/validaciones';
import { generosController } from '../../../views/admin/generos/generosController';
import { errorModal } from '../modalError';
import htmlContent from './editarGenero.html?raw';

let generoId = null;

export const abrirModalEditGenero = async (idGenero) => {

    generoId = idGenero;

    // Crear y mostrar el modal
    mostrarModal(htmlContent);
    
    // Ahora configurar la funcionalidad
    gestionarValidaciones();

    const formulario = document.getElementById('form-editarGenero');
    const infoGenero = await get(`generos/${idGenero}`);

    const genero = infoGenero.data; 
    console.log(genero);
    

    cargarFormulario(formulario, genero);
};

function gestionarValidaciones() {

    let nombre = document.querySelector("#nombreGenero");
    
    nombre.addEventListener('keydown', (e) => {
        validarTexto(e);
        validarMaximo(e, 30);
    })
    


    nombre.addEventListener('blur', (e) => validarCampo(e));
}

async function validarSubmit(e) {

    if(validarCampos(e)) {
        
        console.log(datos);
        let botonEditar = document.querySelector(('#btnEditarGenero'));
        let textoOriginal = botonEditar.textContent;
        botonEditar.disabled = true;
        botonEditar.textContent = "cargando...";
        
        let response = await put(datos, `generos/${generoId}`);
        
        botonEditar.textContent = textoOriginal;
        botonEditar.disabled = false;

        if(response.success) {
            cerrarTodos();
            let confirmacion = success(response.message);
            e.target.reset();   
            if((await confirmacion).isConfirmed) generosController();
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

    if(e.target.closest('#form-editarGenero')) await validarSubmit(e);
    
})