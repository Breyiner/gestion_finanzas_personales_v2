import { error, success } from '../../helpers/alertas';
import { get, put } from '../../helpers/api';
import { cerrarTodos, mostrarModal } from '../../helpers/modalManagement';
import { datos, validarCampo, validarCampos, validarCorreo, validarMaximo, validarPassword, validarTexto } from '../../helpers/validaciones';
import { usuariosController } from '../../views/admin/usuarios/usuariosController';
import htmlContent from  './editarUsuario.html?raw';
import { errorModal } from './modalError';


let usuario_id = null;

export const abrirModalEditUser = async (userId) => {

    usuario_id = userId;
    mostrarModal(htmlContent);

    await configurarModal(userId);

}

async function configurarModal(userId) {
    
    const formulario = document.querySelector('#form-editUser');
    const {data} = await get(`usuarios/${userId}`);
    

    await llenarCiudades();
    await llenarGeneros();
    await llenarRoles();
    await llenarEstados();

    await llenarFormulario(formulario, data);

    configurarValidaciones();

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

async function llenarEstados() {

    let {data} = await get('estados');
    let selectEstados = document.querySelector('#estado');

    selectEstados.innerHTML = '<option value="">Seleccione...</option>';
    data.forEach(({id, nombre}) => {
       
        selectEstados.innerHTML += `<option value="${id}">${nombre}</option>`;
        
    });

}

async function llenarRoles() {

    let {data} = await get('roles');
    let selectRoles = document.querySelector('#rol');

    selectRoles.innerHTML = '<option value="">Seleccione...</option>';
    data.forEach(({id, nombre}) => {
       
        selectRoles.innerHTML += `<option value="${id}">${nombre}</option>`;
        
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

async function validarSubmit(e) {

    if(validarCampos(e)) {
        console.log('Datos a enviar:', datos);
            
        let botonEditar = document.querySelector(('#guardarEdicion'));
        let textoOriginal = botonEditar.textContent;
        botonEditar.disabled = true;
        botonEditar.textContent = "cargando...";

        const response = await put(datos, `usuarios/${usuario_id}`);

        botonEditar.textContent = textoOriginal;
        botonEditar.disabled = false;
        
        if (response.success) {
            cerrarTodos();
    
            let confirmacion = await success(response.message);
            
            if(confirmacion.isConfirmed) await usuariosController();
    
        } else {
            
            if(response.data)  {
                await errorModal(response.data[0]);
                return;
            }
                await errorModal(response.message);
    
        }
        
    }

}


document.addEventListener('submit', async (e) => {
    e.preventDefault();

    if(e.target.closest('#form-editUser')) await validarSubmit(e);
})