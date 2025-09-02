import { success } from '../../../helpers/alertas';
import { get, post } from '../../../helpers/api';
import { cerrarTodos, mostrarModal } from '../../../helpers/modalManagement';
import { datos, validarCampo, validarCampos, validarMaximo, validarTexto } from '../../../helpers/validaciones';
import { categoriasController } from '../../../views/admin/categorias/categoriasController';
import { errorModal } from '../modalError';
import htmlContent from './crearCategoria.html?raw';

export const abrirModalNewCategoria = async () => {

    // Crear y mostrar el modal
    mostrarModal(htmlContent);
    cargarTipos();
    // Ahora configurar la funcionalidad
    gestionarValidaciones();
};

async function cargarTipos() {
    const selectTipos = document.getElementById('tiposMovimiento');
    
    const {data} = await get(`tiposMovimiento`);
    
    selectTipos.innerHTML = '<option value="">Seleccione...</option>';
    data.forEach((tipo, i) => {
        if(i != 2)
            selectTipos.innerHTML += `<option value="${tipo.id}">${tipo.nombre}</option>`;
    });

}

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
        let botonCrear = document.querySelector(('#btnCrearCategoria'));
        let textoOriginal = botonCrear.textContent;
        botonCrear.disabled = true;
        botonCrear.textContent = "cargando...";
        
        let response = await post(datos, 'categorias');
        
        botonCrear.textContent = textoOriginal;
        botonCrear.disabled = false;

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

document.addEventListener('submit', async (e) => {
    
    e.preventDefault();

    if(e.target.closest('#form-nuevaCategoria')) await validarSubmit(e);
    
})