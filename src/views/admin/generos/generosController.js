import { abrirModalNewGenero } from "../../../components/modales/generos/crearGenero";
import { abrirModalEditGenero } from "../../../components/modales/generos/editarGenero";
import { get } from "../../../helpers/api";
import { cerrarModal } from "../../../helpers/modalManagement";

export const generosController = async () => {

    let containerTable = document.querySelector('.container-table');

    const {data} = await get('generos');

    console.log(data);
    
    containerTable.innerHTML = "";
    createBtnNew(containerTable);
    crearTabla(containerTable, data);

}

function createBtnNew(container) {

    const btnNuevo = document.createElement('button');
    btnNuevo.classList.add('boton', 'boton--verde');
    btnNuevo.setAttribute('type', 'button');
    btnNuevo.setAttribute('id', 'nuevoGenero');
    btnNuevo.textContent = "Nuevo Genero";

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
    const cellNombre = document.createElement('th');
    const cellEditar = document.createElement('th');
    const cellEliminar = document.createElement('th');

    // dar clases a los elementos
    table.classList.add('tabla', 'tabla--sinWidth');
    tableHeader.classList.add('tabla__header');
    cellId.classList.add('tabla__celda', 'tabla__celda--header');
    cellNombre.classList.add('tabla__celda', 'tabla__celda--header');
    cellEditar.classList.add('tabla__celda', 'tabla__celda--header');
    cellEliminar.classList.add('tabla__celda', 'tabla__celda--header');

    // dar contenido
    cellId.textContent = 'ID';
    cellNombre.textContent = 'Nombre';
    cellEditar.textContent = 'Editar';
    cellEliminar.textContent = 'Eliminar';

    const tableBody = document.createElement('tbody');

    data.forEach(({id, nombre}) => {
        
        // Crear cuerpo de la tabla
        const rowBody = document.createElement('tr');
        const cellIdBody = document.createElement('td');
        const cellNameBody = document.createElement('td');
        const cellEditBody = document.createElement('td');
        const cellDeleteBody = document.createElement('td');
    
        //dar clases y atributos
        rowBody.setAttribute('data-genero_id', id);
        rowBody.classList.add('tabla__fila');
        cellIdBody.classList.add('tabla__celda');
        cellNameBody.classList.add('tabla__celda');
        cellEditBody.classList.add('tabla__celda');
        cellDeleteBody.classList.add('tabla__celda');
    
        //contenido celdas cuerpo
        cellIdBody.textContent = id;
        cellNameBody.textContent = nombre;
    
        // crear botones
        const btnEditar = document.createElement('button');
        const btnEliminar = document.createElement('button');
    
        //dar clases y atributos
        btnEditar.classList.add('boton', 'boton--azul');
        btnEliminar.classList.add('boton', 'boton--rojo');
        btnEditar.setAttribute('data-genero_id', id);
        btnEditar.setAttribute('id', 'editarGenero');
        btnEliminar.setAttribute('type', 'button');
        btnEliminar.setAttribute('id', 'eliminarGenero');
        btnEliminar.setAttribute('data-genero_id', id);

        // if(estado == "Inactivo") {
        //     btnEliminar.disabled = true;
        //     btnEliminar.classList.remove('boton--rojo');
        // }
    
        // dar contenido a los botones
        btnEditar.textContent = "Editar";
        btnEliminar.textContent = "Eliminar";
    
        cellEditBody.append(btnEditar);
        cellDeleteBody.append(btnEliminar);
        
        rowBody.append(cellIdBody, cellNameBody, cellEditBody, cellDeleteBody);
        tableBody.append(rowBody);
    });


    rowHeader.append(cellId, cellNombre, cellEditar, cellEliminar);
    tableHeader.append(rowHeader);


    table.append(tableHeader, tableBody);

    container.append(table);
}

async function configEdit(boton) {

    let idGenero = boton.dataset.genero_id;
    await abrirModalEditGenero(idGenero);

}


document.addEventListener('click', async (e) => {

    if (e.target.closest('#nuevoGenero')) await abrirModalNewGenero();
    if (e.target.closest('#editarGenero')) await configEdit(e.target.closest('#editarGenero'));

    if(e.target.closest('.modal-exit--generos')) cerrarModal();
})