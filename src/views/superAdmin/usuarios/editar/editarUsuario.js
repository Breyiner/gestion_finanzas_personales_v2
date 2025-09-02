// import { error, success } from '../../helpers/alertas';
// import { get, put } from '../../helpers/api';
// import { cerrarTodos, mostrarModal } from '../../helpers/modalManagement';
// import { datos, validarCampo, validarCampos, validarCorreo, validarMaximo, validarPassword, validarTexto } from '../../helpers/validaciones';
// import { usuariosController } from '../../views/admin/usuarios/usuariosController';
// import { errorModal } from './modalError';
import { errorModal } from '../../../../components/modales/modalError';
import { success } from '../../../../helpers/alertas';
import { get, patch } from '../../../../helpers/api';
import { isAuthorize } from '../../../../helpers/auth';
import { cerrarTodos, mostrarModal } from '../../../../helpers/modalManagement';
import { datos, validarCampo, validarCampos, validarMaximo, validarTexto } from '../../../../helpers/validaciones';
import htmlContent from  './editarUsuario.html?raw';


let user_id = null;

export default async (parametros = null) => {

    mostrarModal(htmlContent);
    
    const {usuario_id} = parametros;
    user_id = usuario_id;

    await configurarModal(usuario_id);

}

async function configurarModal(usuario_id) {
    
    const formPerfil = document.querySelector('#form-editPerfil');
    const formUsuario = document.querySelector('#form-editUser');

    if(isAuthorize('cities.index')) await llenarCiudades();
    if(isAuthorize('genders.index')) await llenarGeneros();
    if(isAuthorize('roles.index')) await llenarRoles();
    if(isAuthorize('statuses.index')) await llenarEstados();
    
    
    if(isAuthorize('profiles.show-user')) {

        const {data} = await get(`profiles/user/${usuario_id}`);

        await llenarFormulario(formPerfil, data);
    }

    if(isAuthorize('users.show')) {

        const {data} = await get(`users/${usuario_id}`);

        await llenarFormulario(formUsuario, data);
    }

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

async function llenarEstados() {

    let {data} = await get('statuses');
    let selectEstados = document.querySelector('#estado');

    selectEstados.innerHTML = '<option value="">Seleccione...</option>';
    data.forEach(({id, name}) => {
       
        selectEstados.innerHTML += `<option value="${id}">${name}</option>`;
        
    });

}

async function llenarRoles() {

    let {data} = await get('roles');
    let selectRoles = document.querySelector('#rol');

    selectRoles.innerHTML = '<option value="">Seleccione...</option>';
    data.forEach(({id, name}) => {
       
        selectRoles.innerHTML += `<option value="${id}">${name}</option>`;
        
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
    let roles = document.querySelector('#rol');
    let estados = document.querySelector('#estado');
    let correo = document.querySelector("#correo");
    let contrasena = document.querySelector("#contrasena");

    if(!isAuthorize('users.update-role')) roles.setAttribute('disabled', "");
    
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

    roles.addEventListener('blur', (e) => validarCampo(e));
    
    estados.addEventListener('blur', (e) => validarCampo(e));

    correo.addEventListener('blur', (e) => {
        validarCampo(e);
        validarCorreo(e);
    });

    contrasena.addEventListener('blur', (e) => {
        validarCampo(e);
        validarPassword(e);
    });

}

async function validarSubmitPerfil(e) {

    if(validarCampos(e)) {
        console.log('Datos a enviar:', datos);
            
        let botonEditar = document.querySelector(('#editarPerfil'));
        let textoOriginal = botonEditar.textContent;
        botonEditar.disabled = true;
        botonEditar.textContent = "cargando...";

        const response = await patch(datos, `profiles/user/${user_id}`);

        botonEditar.textContent = textoOriginal;
        botonEditar.disabled = false;
        
        if (response.success) {
            cerrarTodos();
    
            success(response.message);
    
        } else {
            
            if(response.errors.length > 0)  {
                await errorModal(response.errors[0]);
                return;
            }
                await errorModal(response.message);
    
        }
        
    }

}

async function validarSubmitUsuario(e) {

    if(validarCampos(e)) {
        console.log('Datos a enviar:', datos);
            
        let botonEditar = document.querySelector(('#editarUser'));
        let textoOriginal = botonEditar.textContent;
        botonEditar.disabled = true;
        botonEditar.textContent = "cargando...";

        const response = await patch(datos, `users/${user_id}`);

        botonEditar.textContent = textoOriginal;
        botonEditar.disabled = false;
        
        if (response.success) {
            cerrarTodos();
    
            success(response.message);
    
        } else {
            
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

    if(e.target.closest('#form-editPerfil')) await validarSubmitPerfil(e);
    if(e.target.closest('#form-editUser')) await validarSubmitUsuario(e);
})