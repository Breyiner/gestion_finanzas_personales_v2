import { confirm, error, success } from '../../../helpers/alertas';
import { delet, get } from '../../../helpers/api';
import { isAuthorize } from '../../../helpers/auth';
import { cerrarModal, mostrarModal } from '../../../helpers/modalManagement';

let user_id = null;

export const usuariosController = async () => {

    user_id = localStorage.getItem('user_id');
  
    
    let containerTable = document.querySelector('.container-table');
    
    
    if(isAuthorize('users.index')) {
        let {data} = await get('users/information');
        
        console.log(data);
        
        containerTable.innerHTML = "";

        if(isAuthorize('users.store')) createBtnNew(containerTable);
        
        crearTabla(containerTable, data);
    }
}

function createBtnNew(container) {

    const btnNuevo = document.createElement('button');
    btnNuevo.classList.add('boton', 'boton--verde');
    btnNuevo.setAttribute('type', 'button');
    btnNuevo.setAttribute('id', 'crearUsuario');
    btnNuevo.textContent = "Nuevo Usuario";

    container.append(btnNuevo);

}

function crearTabla(container, data) {

    if (data.length == 0) {
        let sinRegistros = document.createElement('span');
        sinRegistros.textContent = "No hay registros";
        sinRegistros.classList.add('elemento-vacio');
        container.append(sinRegistros);
        return;
    }


    // creamos los elementos
    const table = document.createElement('table');
    const tableHeader = document.createElement('thead');
    const rowHeader = document.createElement('tr');
    const cellId = document.createElement('th');
    const cellRol = document.createElement('th');
    const cellNombre = document.createElement('th');
    const cellApellido = document.createElement('th');
    const cellCorreo = document.createElement('th');
    const cellGenero = document.createElement('th');
    const cellCiudad = document.createElement('th');
    const cellEstado = document.createElement('th');
    const cellEditar = document.createElement('th');
    const cellEliminar = document.createElement('th');

    // dar clases a los elementos
    table.classList.add('tabla');
    tableHeader.classList.add('tabla__header');
    cellId.classList.add('tabla__celda', 'tabla__celda--header');
    cellRol.classList.add('tabla__celda', 'tabla__celda--header');
    cellNombre.classList.add('tabla__celda', 'tabla__celda--header');
    cellApellido.classList.add('tabla__celda', 'tabla__celda--header');
    cellCorreo.classList.add('tabla__celda', 'tabla__celda--header');
    cellGenero.classList.add('tabla__celda', 'tabla__celda--header');
    cellCiudad.classList.add('tabla__celda', 'tabla__celda--header');
    cellEstado.classList.add('tabla__celda', 'tabla__celda--header');
    cellEditar.classList.add('tabla__celda', 'tabla__celda--header');
    cellEliminar.classList.add('tabla__celda', 'tabla__celda--header');

    // dar contenido
    cellId.textContent = 'ID';
    cellRol.textContent = 'Rol';
    cellNombre.textContent = 'Nombre';
    cellApellido.textContent = 'Apellido';
    cellCorreo.textContent = 'Correo';
    cellGenero.textContent = 'Género';
    cellCiudad.textContent = 'Ciudad';
    cellEstado.textContent = 'Estado';
    cellEditar.textContent = 'Editar';
    cellEliminar.textContent = 'Eliminar';

    const tableBody = document.createElement('tbody');

    data.forEach(({id, role, first_name, last_name, email, gender, city, status}) => {
        
        if(role == "Super Administrador" || role =="Administrador" || id == user_id) return;


        // Crear cuerpo de la tabla
        const rowBody = document.createElement('tr');
        const cellIdBody = document.createElement('td');
        const cellRoleBody = document.createElement('td');
        const cellNameBody = document.createElement('td');
        const cellLstNameBody = document.createElement('td');
        const cellEmailBody = document.createElement('td');
        const cellPswdBody = document.createElement('td');
        const cellGenderBody = document.createElement('td');
        const cellCityBody = document.createElement('td');
        const cellEstateBody = document.createElement('td');
        const cellEditBody = document.createElement('td');
        const cellDeleteBody = document.createElement('td');
    
        //dar clases y atributos
        rowBody.setAttribute('data-userId', id);
        rowBody.classList.add('tabla__fila');
        cellIdBody.classList.add('tabla__celda');
        cellRoleBody.classList.add('tabla__celda');
        cellNameBody.classList.add('tabla__celda');
        cellLstNameBody.classList.add('tabla__celda');
        cellEmailBody.classList.add('tabla__celda');
        cellPswdBody.classList.add('tabla__celda');
        cellGenderBody.classList.add('tabla__celda');
        cellCityBody.classList.add('tabla__celda');
        cellEstateBody.classList.add('tabla__celda');
        cellEditBody.classList.add('tabla__celda');
        cellDeleteBody.classList.add('tabla__celda');
    
        //contenido celdas cuerpo
        cellIdBody.textContent = id;
        cellRoleBody.textContent = role;
        cellNameBody.textContent = first_name;
        cellLstNameBody.textContent = last_name;
        cellEmailBody.textContent = email;
        cellGenderBody.textContent = gender;
        cellCityBody.textContent = city;
        cellEstateBody.textContent = status;
    
        // crear botones
        const btnEditar = document.createElement('button');
        const btnEliminar = document.createElement('button');
    
        //dar clases y atributos
        btnEditar.classList.add('boton', 'boton--azul');
        btnEliminar.classList.add('boton', 'boton--rojo');
        btnEditar.setAttribute('data-userId', id);
        btnEditar.setAttribute('id', 'editarUsuario');
        btnEliminar.setAttribute('type', 'button');
        btnEliminar.setAttribute('id', 'eliminarUsuario');
        btnEliminar.setAttribute('data-userId', id);

        if(status == "Inactivo") {
            btnEliminar.disabled = true;
            btnEliminar.classList.remove('boton--rojo');
        }
    
        // dar contenido a los botones
        btnEditar.textContent = "Editar";
        btnEliminar.textContent = "Eliminar";
    
        cellEditBody.append(btnEditar);
        cellDeleteBody.append(btnEliminar);
        
        rowBody.append(cellIdBody, cellRoleBody, cellNameBody, cellLstNameBody, cellEmailBody, cellGenderBody, cellCityBody, cellEstateBody);

        if(isAuthorize('users.update')) rowBody.append(cellEditBody);
        if(isAuthorize('users.destroy')) rowBody.append(cellDeleteBody);
        tableBody.append(rowBody);
    });


    rowHeader.append(cellId, cellRol, cellNombre, cellApellido, cellCorreo, cellGenero, cellCiudad, cellEstado, cellEditar, cellEliminar);

    if(!isAuthorize('users.update')) rowHeader.removeChild(cellEditar);
    if(!isAuthorize('users.destroy')) rowHeader.removeChild(cellEliminar);
    tableHeader.append(rowHeader);


    table.append(tableHeader, tableBody);

    container.append(table);
}

async function eliminar(boton) {
    
    let dataId = boton.dataset.userid;
    

    const confirmacion = await confirm("¿Está seguro de eliminar el usuario?");
    
    if(confirmacion.isConfirmed){
        const respuesta = await delet(`users/${dataId}/soft/`);
        
        if(!respuesta.success){
            console.log(respuesta);
            error(respuesta.message);
            return
        }
        
        await success(respuesta.message)
        usuariosController();
    }
}

async function editarUsuario(boton) {

    let userId = boton.dataset.userid;

    if(isAuthorize('users.update')) location.href = `#/admin/usuarios/editar/usuario_id=${userId}`;

}

document.addEventListener('click', async (e) => {

    if (e.target.closest('#crearUsuario') && isAuthorize('users.store')) 
        location.href = `#/admin/usuarios/crear`;

    if (e.target.closest('#editarUsuario')) await editarUsuario(e.target.closest('#editarUsuario'));
    if (e.target.closest('#eliminarUsuario')) await eliminar(e.target.closest('#eliminarUsuario'));


    if (e.target.closest('.modal-exit--usuario')) cerrarModal();
});