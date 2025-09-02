import { delet, get } from '../../../helpers/api';
import { cerrarModal } from '../../../helpers/modalManagement';
import { isAuthorize } from '../../../helpers/auth';
import { confirm, error, success } from '../../../helpers/alertas';

export const goalStatusesController = async (parametros = null) => {
    let containerTable = document.querySelector('.container-table');
    if (isAuthorize('goal-statuses.index')) {
        const { data } = await get('goalStatuses');
        containerTable.innerHTML = "";
        if (isAuthorize('goal-statuses.store')) createBtnNew(containerTable);
        crearTabla(containerTable, data);
    }
};

function createBtnNew(container) {
    const btnNuevo = document.createElement('button');
    btnNuevo.classList.add('boton', 'boton--verde');
    btnNuevo.setAttribute('type', 'button');
    btnNuevo.setAttribute('id', 'crearGoalStatus');
    btnNuevo.textContent = "Nuevo Estado";
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
    const cellEditar = document.createElement('th');
    const cellEliminar = document.createElement('th');

    table.classList.add('tabla');
    tableHeader.classList.add('tabla__header');

    cellId.classList.add('tabla__celda', 'tabla__celda--header');
    cellNombre.classList.add('tabla__celda', 'tabla__celda--header');
    cellEditar.classList.add('tabla__celda', 'tabla__celda--header');
    cellEliminar.classList.add('tabla__celda', 'tabla__celda--header');

    cellId.textContent = 'ID';
    cellNombre.textContent = 'Nombre';
    cellEditar.textContent = 'Editar';
    cellEliminar.textContent = 'Eliminar';

    const tableBody = document.createElement('tbody');
    data.forEach(({ id, name }) => {
        const rowBody = document.createElement('tr');

        const cellIdBody = document.createElement('td');
        const cellNombreBody = document.createElement('td');
        const cellEditBody = document.createElement('td');
        const cellDeleteBody = document.createElement('td');

        rowBody.setAttribute('data-goalStatusId', id);
        rowBody.classList.add('tabla__fila');

        cellIdBody.classList.add('tabla__celda');
        cellNombreBody.classList.add('tabla__celda');
        cellEditBody.classList.add('tabla__celda');
        cellDeleteBody.classList.add('tabla__celda');

        cellIdBody.textContent = id;
        cellNombreBody.textContent = name;

        if (isAuthorize('goal-statuses.update')) {
            const btnEditar = document.createElement('button');
            btnEditar.classList.add('boton', 'boton--azul');
            btnEditar.setAttribute('data-goalStatusId', id);
            btnEditar.setAttribute('id', 'editarGoalStatus');
            btnEditar.textContent = "Editar";
            cellEditBody.append(btnEditar);
        }

        if (isAuthorize('goal-statuses.destroy')) {
            const btnEliminar = document.createElement('button');
            btnEliminar.classList.add('boton', 'boton--rojo');
            btnEliminar.setAttribute('type', 'button');
            btnEliminar.setAttribute('id', 'eliminarGoalStatus');
            btnEliminar.setAttribute('data-goalStatusId', id);
            btnEliminar.textContent = "Eliminar";
            cellDeleteBody.append(btnEliminar);
        }

        rowBody.append(cellIdBody, cellNombreBody, cellEditBody, cellDeleteBody);
        tableBody.append(rowBody);
    });

    rowHeader.append(cellId, cellNombre, cellEditar, cellEliminar);
    tableHeader.append(rowHeader);
    table.append(tableHeader, tableBody);
    container.append(table);
}

async function eliminar(boton) {
    let dataId = boton.dataset.goalstatusid;
    const confirmacion = await confirm("¿Está seguro de eliminar el estado de meta?");
    if (confirmacion.isConfirmed) {
        const respuesta = await delet(`goalStatuses/${dataId}`);
        if (!respuesta.success) {
            console.log(respuesta);
            error(respuesta.message);
            return;
        }
        await success(respuesta.message);
        goalStatusesController();
    }
}

document.addEventListener('click', async (e) => {
    if (e.target.closest('#crearGoalStatus'))
        location.href = `#/super_admin/goalStatuses/crear`;
    if (e.target.closest('#editarGoalStatus')) {
        const id = e.target.closest('#editarGoalStatus').dataset.goalstatusid;
        location.href = `#/super_admin/goalStatuses/editar/goalStatus_id=${id}`;
    }
    if (e.target.closest('#eliminarGoalStatus')) {
        await eliminar(e.target.closest('#eliminarGoalStatus'));
    }
    if (e.target.closest('.modal-exit--goalStatuses')) cerrarModal();
});
