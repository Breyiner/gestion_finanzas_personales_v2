import { error, success } from "../../../helpers/alertas";
import { get, post } from "../../../helpers/api";
import { datos, validarCampo, validarCampos, validarCorreo, validarMaximo, validarPassword, validarTexto } from "../../../helpers/validaciones";

export const registerController = async () => {
    
    await configurarFormulario();

}

async function configurarFormulario() {

    await llenarGeneros();
    await llenarCiudades();
    gestionarValidaciones();
    
}

async function llenarCiudades() {

    let {data} = await get('ciudades');
    let selectCiudades = document.querySelector('#ciudad');

    selectCiudades.innerHTML = '<option value="">Seleccione...</option>';
    data.forEach(({id, nombre}) => {
       
        selectCiudades.innerHTML += `<option value="${id}">${nombre}</option>`;
        
    });

}

async function llenarGeneros() {

    let {data} = await get('generos');
    let selectGeneros = document.querySelector('#genero');

    selectGeneros.innerHTML = '<option value="">Seleccione...</option>';
    data.forEach(({id, nombre}) => {
       
        selectGeneros.innerHTML += `<option value="${id}">${nombre}</option>`;
        
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

    contrasena.addEventListener('blur', (e) => validarCampo(e));
    contrasena.addEventListener('input', (e) => validarPassword(e));
}

async function validarSubmit(e) {

    if(validarCampos(e)) {

        let botonRegister = document.querySelector(('.form__button'));
        let textoOriginal = botonRegister.textContent;
        botonRegister.disabled = true;
        botonRegister.textContent = "cargando...";

        let response = await post(datos, 'usuarios/register');

        botonRegister.textContent = textoOriginal;
        botonRegister.disabled = false;

        if(response.success) {
            let confirmacion = success(response.message);
            e.target.reset();   
            if((await confirmacion).isConfirmed) window.location.href = "#/login";
        }
        else {
            if(response.data)  {
                error(response.data[0]);
                return;
            }
            
            error(response.message);
        }
    }

}

document.addEventListener('submit', async (e) => {
    e.preventDefault();

    if(e.target.classList.contains('form--register')) await validarSubmit(e);
    
})