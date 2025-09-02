import { delet, get } from '../../../helpers/api';
import { cerrarModal } from '../../../helpers/modalManagement';
import { isAuthorize } from '../../../helpers/auth';
import { confirm, error, success } from '../../../helpers/alertas';

export const tiposMovimientosController = async (parametros = null) => {
    let containerTable = document.querySelector('.container-table');
    if (isAuthorize('transaction-types.index')) {
        const { data } = await get('transactionTypes');
        containerTable.innerHTML = "";
        if (isAuthorize('transaction-types.store')) createBtnNew(containerTable);
        crearTabla(containerTable, data);
    }
};

function createBtnNew(container) {
    const btnNuevo = document.createElement('button');
    btnNuevo.classList.add('boton', 'boton--verde');
    btnNuevo.setAttribute('type', 'button');
    btnNuevo.setAttribute('id', 'crearTipoMovimiento');
    btnNuevo.textContent = "Nuevo Tipo de Movimiento";
    container.append(btnNuevo);
}

async function crearTabla(container, data) {
    if (data.length == 0) {
        let sinRegistros = document.createElement('span');
        sinRegistros.textContent = "No hay registros";
        sinRegistros.classList.add('elemento-vacio');
        container.append(sinRegistros);
        return;
    }

    const table = document.createElement('table');
    table.classList.add('tabla');

    // Encabezado
    const tableHeader = document.createElement('thead');
    tableHeader.classList.add('tabla__header');
    const rowHeader = document.createElement('tr');

    const headers = ['ID', 'Nombre', 'Icono', 'Color', 'Editar', 'Eliminar'];
    headers.forEach(text => {
        const th = document.createElement('th');
        th.classList.add('tabla__celda', 'tabla__celda--header');
        th.textContent = text;
        rowHeader.append(th);
    });

    tableHeader.append(rowHeader);
    table.append(tableHeader);

    const tableBody = document.createElement('tbody');

    for (const item of data) {
        const row = document.createElement('tr');
        row.classList.add('tabla__fila');

        // ID
        const cellId = document.createElement('td');
        cellId.classList.add('tabla__celda');
        cellId.textContent = item.id;

        // Nombre
        const cellNombre = document.createElement('td');
        cellNombre.classList.add('tabla__celda');
        cellNombre.textContent = item.name;

        // Icono
        const cellIcon = document.createElement('td');
        cellIcon.classList.add('tabla__celda');
        if (item.icon_id) {
            const { data: icon } = await get(`icons/${item.icon_id}`);
            cellIcon.innerHTML = icon?.icon ? `<i class="${icon.icon}" style="font-size:30px;"></i>` : '-';
        } else {
            cellIcon.textContent = '-';
        }

        // Color
        const cellColor = document.createElement('td');
        cellColor.classList.add('tabla__celda');
        if (item.color_id) {
            const { data: color } = await get(`colors/${item.color_id}`);
            cellColor.innerHTML = `<input type="color" value="${color.hex}" disabled style="border:none;background:none;width:32px;height:32px;vertical-align:middle;"> <span>${color.hex}</span>`;
        } else {
            cellColor.textContent = "-";
        }

        // Editar
        const cellEdit = document.createElement('td');
        cellEdit.classList.add('tabla__celda');
        if (isAuthorize('transaction-types.update')) {
            const btnEditar = document.createElement('button');
            btnEditar.classList.add('boton', 'boton--azul');
            btnEditar.setAttribute('data-tipo_id', item.id);
            btnEditar.setAttribute('id', 'editarTipoMovimiento');
            btnEditar.textContent = "Editar";
            cellEdit.append(btnEditar);
        }

        // Eliminar
        const cellDelete = document.createElement('td');
        cellDelete.classList.add('tabla__celda');
        if (isAuthorize('transaction-types.destroy')) {
            const btnEliminar = document.createElement('button');
            btnEliminar.classList.add('boton', 'boton--rojo');
            btnEliminar.setAttribute('type', 'button');
            btnEliminar.setAttribute('id', 'eliminarTipoMovimiento');
            btnEliminar.setAttribute('data-tipo_id', item.id);
            btnEliminar.textContent = "Eliminar";
            cellDelete.append(btnEliminar);
        }

        row.append(cellId, cellNombre, cellIcon, cellColor, cellEdit, cellDelete);
        tableBody.append(row);
    }

    table.append(tableBody);
    container.append(table);
}


async function eliminar(boton) {
    const tipoId = boton.dataset.tipo_id;
    const confirmacion = await confirm("¿Está seguro de eliminar este tipo de movimiento?");
    if (confirmacion.isConfirmed) {
        const respuesta = await delet(`transactionTypes/${tipoId}`);
        if (!respuesta.success) {
            error(respuesta.message);
            return;
        }
        await success(respuesta.message);
        tiposMovimientosController();
    }
}

document.addEventListener('click', async (e) => {
    if (e.target.closest('#crearTipoMovimiento'))
        location.href = `#/super_admin/tipos_movimientos/crear`;
    if (e.target.closest('#editarTipoMovimiento')) {
        const id = e.target.closest('#editarTipoMovimiento').dataset.tipo_id;
        location.href = `#/super_admin/tipos_movimientos/editar/tipo_id=${id}`;
    }
    if (e.target.closest('#eliminarTipoMovimiento')) {
        await eliminar(e.target.closest('#eliminarTipoMovimiento'));
    }

    if(e.target.closest('.modal-exit--tiposMovimientos')) cerrarModal();
});
