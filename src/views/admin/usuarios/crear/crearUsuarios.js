// import { error, success } from '../../helpers/alertas';
// import { get, post } from '../../helpers/api';
// import { cerrarTodos, mostrarModal } from '../../helpers/modalManagement';
// import { datos, validarCampo, validarCampos, validarCorreo, validarMaximo, validarPassword, validarTexto } from '../../helpers/validaciones';
import { errorModal } from '../../../../components/modales/modalError';
import { success } from '../../../../helpers/alertas';
import { get, post } from '../../../../helpers/api';
import { isAuthorize } from '../../../../helpers/auth';
import { cerrarTodos, mostrarModal } from '../../../../helpers/modalManagement';
import { datos, validarCampo, validarCampos, validarMaximo, validarTexto } from '../../../../helpers/validaciones';
import htmlContent from  './crearUsuario.html?raw';
// import { errorModal } from './modalError';

let funcControlador = null;

export default async (parametros = null) => {

    mostrarModal(htmlContent);

    await configurarFormulario();

}

async function configurarFormulario() {

    if(isAuthorize('genders.index')) await llenarGeneros();
    if(isAuthorize('cities.index')) await llenarCiudades();
    gestionarValidaciones();
    
}

async function llenarCiudades() {

    let {data} = await get('cities');
    let selectCiudades = document.querySelector('#ciudad');

    selectCiudades.innerHTML = '<option value="">Seleccione...</option>';
    data.forEach(({id, name}) => {
       
        selectCiudades.innerHTML += `<option value="${id}">${name}</option>`;
        
    });

}

async function llenarGeneros() {

    let {data} = await get('genders');
    let selectGeneros = document.querySelector('#genero');

    selectGeneros.innerHTML = '<option value="">Seleccione...</option>';
    data.forEach(({id, name}) => {
       
        selectGeneros.innerHTML += `<option value="${id}">${name}</option>`;
        
    });
}

function gestionarValidaciones() {

    let nombre = document.querySelector("#nombre");
    let apellido = document.querySelector("#apellido");
    let ciudades = document.querySelector('#ciudad');
    let generos = document.querySelector('#genero');
    let correo = document.querySelector("#correo");
    let contrasena = document.querySelector("#contrasena");
    
    nombre.addEventListener('keydown', (e) => {
        validarTexto(e);
        validarMaximo(e, 30);
    })
    
    apellido.addEventListener('keydown', (e) => {
        validarTexto(e);
        validarMaximo(e, 30);
    })

    correo.addEventListener('keydown', (e) => {
        validarMaximo(e, 30);
    })

    contrasena.addEventListener('keydown', (e) => {
        validarMaximo(e, 20);
    })

    nombre.addEventListener('blur', (e) => validarCampo(e));
    
    apellido.addEventListener('blur', (e) => validarCampo(e));

    ciudades.addEventListener('blur', (e) => validarCampo(e));
    
    generos.addEventListener('blur', (e) => validarCampo(e));

    correo.addEventListener('blur', (e) => {
        validarCampo(e);
        validarCorreo(e);
    });

    contrasena.addEventListener('blur', (e) => {
        validarCampo(e);
        validarPassword(e);
    });
}

async function validarSubmit(e) {

    if(validarCampos(e)) {
        
        console.log(datos);
        let botonCrear = document.querySelector(('#newUser'));
        let textoOriginal = botonCrear.textContent;
        botonCrear.disabled = true;
        botonCrear.textContent = "cargando...";
        
        let response = await post(datos, 'users');
        
        botonCrear.textContent = textoOriginal;
        botonCrear.disabled = false;

        if(response.success) {
            cerrarTodos();
            success(response.message);
            e.target.reset();
        }
        else {
            cerrarTodos();
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

    if(e.target.classList.contains('form-newUser')) await validarSubmit(e);
    
})