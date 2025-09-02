import { error, success } from "../../helpers/alertas";
import { get, patch } from "../../helpers/api"
import { isAuthorize } from "../../helpers/auth";
import { datos, validarCampo, validarCampos, validarCorreo, validarMaximo, validarPassword, validarTexto } from "../../helpers/validaciones";

let usuario_id = null;

export const perfilController = async (parametros = null) => {
    
    usuario_id = parseInt(localStorage.getItem('user_id'));
    
    await configurarFormulario();
}

async function configurarFormulario() {

    if(isAuthorize('cities.index')) await llenarCiudades();
    if(isAuthorize('genders.index')) await llenarGeneros();
    
    if(isAuthorize('profiles.show-own')) 
    {
        const formulario = document.querySelector('#form-profile');

        const {data} = await get('profiles/me');
        
        llenarFormulario(formulario, data);

    }

    if(isAuthorize('users.show-own')) 
    {

        const formulario = document.querySelector('#form-edit-email');

        const {data} = await get('users/me');
        
        llenarFormulario(formulario, data);
    }

    const updateProfile = document.querySelector("#btnEditPerfil");
    const updateCorreo = document.querySelector("#btnEditCorreo");
    const updatePassword = document.querySelector("#btnEditPass");

    if(!isAuthorize('profiles.update-own')) updateProfile.remove();
    if(!isAuthorize('users.update-own-email')) updateCorreo.remove();
    if(!isAuthorize('users.update-own-password')) updatePassword.remove();
    
    configurarValidaciones();
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

async function llenarFormulario(formulario, usuarioData) {

    const campos = formulario.querySelectorAll('input, textarea, select');
    
    campos.forEach(async campo => {
        
        if(campo.getAttribute('name') in usuarioData)
            campo.value = usuarioData[campo.getAttribute('name')];
    });

}

function configurarValidaciones() {

    let nombre = document.querySelector("#nombre");
    let apellido = document.querySelector("#apellido");
    let ciudades = document.querySelector('#ciudad');
    let generos = document.querySelector('#genero');
    let correo = document.querySelector("#correo");
    let correoConfirm = document.querySelector("#correo_confirm");

    let oldPass = document.querySelector('#old_pass');
    let newPass = document.querySelector('#new_pass');
    let confirmPass = document.querySelector('#confirm_pass');
    
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

    correoConfirm.addEventListener('keydown', (e) => {
        validarMaximo(e, 30);
    })
    
    oldPass.addEventListener('keydown', (e) => {
        validarMaximo(e, 20);
    })
    newPass.addEventListener('keydown', (e) => {
        validarMaximo(e, 20);
    })
    confirmPass.addEventListener('keydown', (e) => {
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

    correoConfirm.addEventListener('blur', (e) => {
        validarCampo(e);
        validarCorreo(e);
    });

    // oldPass.addEventListener('keydown', (e) => validarPassword(e));
    oldPass.addEventListener('input', (e) => validarPassword(e));
    newPass.addEventListener('input', (e) => validarPassword(e));
    confirmPass.addEventListener('input', (e) => validarPassword(e));
    

}

async function validarSubmitPerfil(e) {

    if(validarCampos(e)) {
        console.log('Datos a enviar:', datos);
            
        let botonEditar = document.querySelector(('#btnEditPerfil'));
        let textoOriginal = botonEditar.textContent;
        botonEditar.disabled = true;
        botonEditar.textContent = "cargando...";

        const response = await patch(datos, `profiles/me`);

        botonEditar.textContent = textoOriginal;
        botonEditar.disabled = false;

        if (response.success) {
    
            let confirmacion = await success(response.message);
            
          if (confirmacion.isConfirmed) {
            success('Inicie sesión nuevamente para aplicar cambios');
            await perfilController();
          }
    
        } else {
            
            if(response.errors.length > 0)  {
                error(response.errors[0]);
                return;
            }
            
            error(response.message);
    
        }
        
  }
  
  else {
    error('Debe llenar los campos correctamente');
  }

}

async function validarSubmitCorreo(e) {

    if(validarCampos(e)) {
        console.log('Datos a enviar:', datos);
            
        let botonEditar = document.querySelector(('#btnEditCorreo'));
        let textoOriginal = botonEditar.textContent;
        botonEditar.disabled = true;
        botonEditar.textContent = "cargando...";

        const response = await patch(datos, `users/me/email`);

        botonEditar.textContent = textoOriginal;
        botonEditar.disabled = false;

        if (response.success) {

            let confirmacion = await success(response.message);
            e.target.reset(); 
            
            if(confirmacion.isConfirmed) await perfilController();

        } else error(response.message);
    }

    else {
    error('Debe llenar los campos correctamente');
    }

}

async function validarSubmitPassword(e) {

    if(validarCampos(e)) {
        console.log('Datos a enviar:', datos);
            
        let botonEditar = document.querySelector(('#btnEditPass'));
        let textoOriginal = botonEditar.textContent;
        botonEditar.disabled = true;
        botonEditar.textContent = "cargando solicitud...";

        const response = await patch(datos, `users/me/password`);

        botonEditar.textContent = textoOriginal;
        botonEditar.disabled = false;

        if (response.success) {
    
            let confirmacion = await success(response.message);
            e.target.reset(); 
            
            if(confirmacion.isConfirmed) await perfilController();
    
        } else error(response.message);
        
    }
    else {
      error('Debe llenar los campos correctamente');
    }

}

document.addEventListener('submit', async (e) => {
    e.preventDefault();

    if(e.target.closest('#form-profile') && isAuthorize('profiles.update-own')) await validarSubmitPerfil(e);
    if(e.target.closest('#form-edit-email') && isAuthorize('users.update-own-email')) await validarSubmitCorreo(e);
    if(e.target.closest('#form-edit-pswd') && isAuthorize('users.update-own-password')) await validarSubmitPassword(e);
})