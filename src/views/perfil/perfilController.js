import { error, success } from "../../helpers/alertas";
import { get, patch } from "../../helpers/api"
import { datos, validarCampo, validarCampos, validarCorreo, validarMaximo, validarPassword, validarTexto } from "../../helpers/validaciones";

let usuario_id = null;

export const perfilController = async () => {
    
    usuario_id = parseInt(localStorage.getItem('usuario_id'));

    await configurarFormulario();
}

async function configurarFormulario() {

    await llenarCiudades();
    await llenarGeneros();

    const formulario = document.querySelector('#form-profile');
    let {data} = await get(`usuarios/${usuario_id}`);

    console.log(data);
    
    llenarFormulario(formulario, data);
    configurarValidaciones()
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

    // oldPass.addEventListener('keydown', (e) => validarPassword(e));
    oldPass.addEventListener('input', (e) => validarPassword(e));
    newPass.addEventListener('input', (e) => validarPassword(e));
    confirmPass.addEventListener('input', (e) => validarPassword(e));
    

}

async function validarSubmitUsuario(e) {

    if(validarCampos(e)) {
        console.log('Datos a enviar:', datos);
            
        let botonEditar = document.querySelector(('#btnEditUser'));
        let textoOriginal = botonEditar.textContent;
        botonEditar.disabled = true;
        botonEditar.textContent = "cargando...";

        const response = await patch(datos, `usuarios/${usuario_id}`);

        botonEditar.textContent = textoOriginal;
        botonEditar.disabled = false;

        if (response.success) {
    
            let confirmacion = await success(response.message);
            
          if (confirmacion.isConfirmed) {
            success('Inicie sesión nuevamente para aplicar cambios');
            await perfilController();
          }
    
        } else {
            
            if(response.data)  {
                error(response.data[0]);
                return;
            }
            
            error(response.message);
    
        }
        
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

        const response = await patch(datos, `usuarios/password/usuario/${usuario_id}`);

        botonEditar.textContent = textoOriginal;
        botonEditar.disabled = false;

        if (response.success) {
    
            let confirmacion = await success(response.message);
            e.target.reset(); 
            
            if(confirmacion.isConfirmed) await perfilController();
    
        } else {
            
            error(response.message);
    
        }
        
  }
    else {
      error('Debe llenar los campos correctamente');
    }

}

document.addEventListener('submit', async (e) => {
    e.preventDefault();

    if(e.target.closest('#form-profile')) await validarSubmitUsuario(e);
    if(e.target.closest('#form-edit-pswd')) await validarSubmitPassword(e);
})