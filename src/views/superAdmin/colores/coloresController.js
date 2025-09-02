import { delet, get } from '../../../helpers/api';
import { cerrarModal } from '../../../helpers/modalManagement';
import { isAuthorize } from '../../../helpers/auth';
import { confirm, error, success } from '../../../helpers/alertas';

export const coloresController = async (parametros = null) => {
    let containerTable = document.querySelector('.container-table');

    if (isAuthorize('colors.index')) {
        const { data } = await get('colors');

        containerTable.innerHTML = "";

        if (isAuthorize('colors.store')) createBtnNew(containerTable);

        crearTabla(containerTable, data);
    }
};

function createBtnNew(container) {
    const btnNuevo = document.createElement('button');
    btnNuevo.classList.add('boton', 'boton--verde');
    btnNuevo.setAttribute('type', 'button');
    btnNuevo.setAttribute('id', 'crearColor');
    btnNuevo.textContent = "Nuevo Color";
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

    const table = document.createElement('table');
    const tableHeader = document.createElement('thead');
    const rowHeader = document.createElement('tr');
    const cellId = document.createElement('th');
    const cellNombre = document.createElement('th');
    const cellHex = document.createElement('th');
    const cellEditar = document.createElement('th');
    const cellEliminar = document.createElement('th');

    table.classList.add('tabla');
    tableHeader.classList.add('tabla__header');
    cellId.classList.add('tabla__celda', 'tabla__celda--header');
    cellNombre.classList.add('tabla__celda', 'tabla__celda--header');
    cellHex.classList.add('tabla__celda', 'tabla__celda--header');
    cellEditar.classList.add('tabla__celda', 'tabla__celda--header');
    cellEliminar.classList.add('tabla__celda', 'tabla__celda--header');

    cellId.textContent = 'ID';
    cellNombre.textContent = 'Nombre';
    cellHex.textContent = 'Color';
    cellEditar.textContent = 'Editar';
    cellEliminar.textContent = 'Eliminar';

    const tableBody = document.createElement('tbody');

    data.forEach(({ id, name, hex }) => {
        const rowBody = document.createElement('tr');
        const cellIdBody = document.createElement('td');
        const cellNombreBody = document.createElement('td');
        const cellHexBody = document.createElement('td');
        const cellEditBody = document.createElement('td');
        const cellDeleteBody = document.createElement('td');

        rowBody.setAttribute('data-colorId', id);
        rowBody.classList.add('tabla__fila');
        cellIdBody.classList.add('tabla__celda');
        cellNombreBody.classList.add('tabla__celda');
        cellHexBody.classList.add('tabla__celda');
        cellEditBody.classList.add('tabla__celda');
        cellDeleteBody.classList.add('tabla__celda');

        cellIdBody.textContent = id;
        cellNombreBody.textContent = name;
        cellHexBody.innerHTML = `<input type="color" value="${hex}" disabled style="border:none;background:none;width:32px;height:32px;vertical-align:middle;"> <span>${hex}</span>`;

        if (isAuthorize('colors.update')) {
            const btnEditar = document.createElement('button');
            btnEditar.classList.add('boton', 'boton--azul');
            btnEditar.setAttribute('data-colorId', id);
            btnEditar.setAttribute('id', 'editarColor');
            btnEditar.textContent = "Editar";
            cellEditBody.append(btnEditar);
        }

        if (isAuthorize('colors.destroy')) {
            const btnEliminar = document.createElement('button');
            btnEliminar.classList.add('boton', 'boton--rojo');
            btnEliminar.setAttribute('type', 'button');
            btnEliminar.setAttribute('id', 'eliminarColor');
            btnEliminar.setAttribute('data-colorId', id);
            btnEliminar.textContent = "Eliminar";
            cellDeleteBody.append(btnEliminar);
        }

        rowBody.append(cellIdBody, cellNombreBody, cellHexBody, cellEditBody, cellDeleteBody);
        tableBody.append(rowBody);
    });

    rowHeader.append(cellId, cellNombre, cellHex, cellEditar, cellEliminar);
    tableHeader.append(rowHeader);
    table.append(tableHeader, tableBody);
    container.append(table);
}

async function eliminar(boton) {
    let dataId = boton.dataset.colorid;

    const confirmacion = await confirm("¿Está seguro de eliminar el color?");

    if (confirmacion.isConfirmed) {
        const respuesta = await delet(`colors/${dataId}`);

        if (!respuesta.success) {
            console.log(respuesta);
            error(respuesta.message);
            return;
        }

        await success(respuesta.message);
        coloresController();
    }
}

document.addEventListener('click', async (e) => {
    if (e.target.closest('#crearColor'))
        location.href = `#/super_admin/colores/crear`;

    if (e.target.closest('#editarColor')) {
        const id = e.target.closest('#editarColor').dataset.colorid;
        location.href = `#/super_admin/colores/editar/color_id=${id}`;
    }

    if (e.target.closest('#eliminarColor')) {
        await eliminar(e.target.closest('#eliminarColor'));
    }

    if (e.target.closest('.modal-exit--colores')) cerrarModal();
});
