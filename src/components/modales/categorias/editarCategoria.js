import { success } from '../../../helpers/alertas';
import { get, put } from '../../../helpers/api';
import { cerrarTodos, mostrarModal } from '../../../helpers/modalManagement';
import { datos, validarCampo, validarCampos, validarMaximo, validarTexto } from '../../../helpers/validaciones';
import { categoriasController } from '../../../views/admin/categorias/categoriasController';
import { errorModal } from '../modalError';
import htmlContent from './editarCategoria.html?raw';

let categoriaId = null;

export const abrirModalEditCategoria = async (idCategoria) => {

    categoriaId = idCategoria;

    // Crear y mostrar el modal
    mostrarModal(htmlContent);
    
    // Ahora configurar la funcionalidad
    gestionarValidaciones();

    const formulario = document.getElementById('form-editarCategoria');
    const infoCategoria = await get(`categorias/${idCategoria}`);

    const categoria = infoCategoria.data; 
    console.log(categoria);
    

    cargarFormulario(formulario, categoria);
};

function gestionarValidaciones() {

    let nombre = document.querySelector("#nombreCategoria");
    let icono = document.querySelector("#claseIconoCategoria");
    let tiposMovimiento = document.querySelector("#tiposMovimiento");
    
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
    tiposMovimiento.addEventListener('blur', (e) => validarCampo(e));
}

async function validarSubmit(e) {

    if(validarCampos(e)) {
        
        console.log(datos);
        let botonEditar = document.querySelector(('#btnEditarCategoria'));
        let textoOriginal = botonEditar.textContent;
        botonEditar.disabled = true;
        botonEditar.textContent = "cargando...";
        
        let response = await put(datos, `categorias/${categoriaId}`);
        
        botonEditar.textContent = textoOriginal;
        botonEditar.disabled = false;

        if(response.success) {
            cerrarTodos();
            let confirmacion = success(response.message);
            e.target.reset();   
            if((await confirmacion).isConfirmed) categoriasController();
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

async function cargarTipos() {
    const selectTipos = document.getElementById('tiposMovimiento');
    
    const {data} = await get(`tiposMovimiento`);
    
    selectTipos.innerHTML = '<option value="">Seleccione...</option>';
    data.forEach((tipo, i) => {
        if(i != 2)
            selectTipos.innerHTML += `<option value="${tipo.id}">${tipo.nombre}</option>`;
    });

}

async function cargarFormulario(formulario, data) {
    
    const campos = formulario.querySelectorAll('input, textarea, select');
    await cargarTipos();
    campos.forEach(async campo => {
        
        if(campo.getAttribute('name') in data)
            campo.value = data[campo.getAttribute('name')];
        
    });
}

document.addEventListener('submit', async (e) => {
    
    e.preventDefault();

    if(e.target.closest('#form-editarCategoria')) await validarSubmit(e);
    
})