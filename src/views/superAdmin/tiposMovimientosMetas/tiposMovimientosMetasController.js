import { get, delet } from '../../../helpers/api';
import { cerrarModal } from '../../../helpers/modalManagement';
import { isAuthorize } from '../../../helpers/auth';
import { confirm, error, success } from '../../../helpers/alertas';

export const tiposMovimientosMetaController = async () => {
    let containerTable = document.querySelector('.container-table');
    if (isAuthorize('goal-transaction-types.index')) {
        const { data } = await get('goalTransactionTypes');
        containerTable.innerHTML = "";
        if (isAuthorize('goal-transaction-types.store')) createBtnNew(containerTable);
        crearTabla(containerTable, data);
    }
};

function createBtnNew(container) {
    const btnNuevo = document.createElement('button');
    btnNuevo.classList.add('boton', 'boton--verde');
    btnNuevo.type = 'button';
    btnNuevo.id = 'crearTipoMovimientoMeta';
    btnNuevo.textContent = 'Nuevo Tipo de Movimiento Meta';
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

    const tableHeader = document.createElement('thead');
    tableHeader.classList.add('tabla__header');
    const rowHeader = document.createElement('tr');

    const headers = ['ID', 'Nombre', 'Color', 'Icono', 'Editar', 'Eliminar'];
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

        const cellId = document.createElement('td');
        cellId.classList.add('tabla__celda');
        cellId.textContent = item.id;

        const cellNombre = document.createElement('td');
        cellNombre.classList.add('tabla__celda');
        cellNombre.textContent = item.name;

        const cellColor = document.createElement('td');
        cellColor.classList.add('tabla__celda');
        if (item.color_id) {
            const { data: color } = await get(`colors/${item.color_id}`);
            cellColor.innerHTML = `<input type="color" value="${color.hex}" disabled style="border:none;background:none;width:32px;height:32px;vertical-align:middle;"> <span>${color.hex}</span>`;
        } else {
            cellColor.textContent = "-";
        }

        const cellIcon = document.createElement('td');
        cellIcon.classList.add('tabla__celda');
        if (item.icon_id) {
            const { data: icon } = await get(`icons/${item.icon_id}`);
            cellIcon.innerHTML = `<i class="${icon.icon}" style="font-size:30px"></i>`;
        } else {
            cellIcon.textContent = "-";
        }

        const cellEdit = document.createElement('td');
        cellEdit.classList.add('tabla__celda');
        if (isAuthorize('goal-transaction-types.update')) {
            const btnEditar = document.createElement('button');
            btnEditar.classList.add('boton','boton--azul');
            btnEditar.dataset.tipo_movimiento_meta_id = item.id;
            btnEditar.id = 'editarTipoMovimientoMeta';
            btnEditar.textContent = "Editar";
            cellEdit.append(btnEditar);
        }

        const cellDelete = document.createElement('td');
        cellDelete.classList.add('tabla__celda');
        if (isAuthorize('goal-transaction-types.destroy')) {
            const btnEliminar = document.createElement('button');
            btnEliminar.classList.add('boton','boton--rojo');
            btnEliminar.dataset.tipo_movimiento_meta_id = item.id;
            btnEliminar.id = 'eliminarTipoMovimientoMeta';
            btnEliminar.textContent = "Eliminar";
            cellDelete.append(btnEliminar);
        }

        row.append(cellId, cellNombre, cellColor, cellIcon, cellEdit, cellDelete);
        tableBody.append(row);
    }

    table.append(tableBody);
    container.append(table);
}

async function eliminar(boton){
    const id = boton.dataset.tipo_movimiento_meta_id;
    const confirmacion = await confirm("¿Está seguro de eliminar este tipo de movimiento meta?");
    if(confirmacion.isConfirmed){
        const res = await delet(`goalTransactionTypes/${id}`);
        if(!res.success){ error(res.message); return; }
        await success(res.message);
        tiposMovimientosMetaController();
    }
}

document.addEventListener('click', async (e)=>{
    if(e.target.closest('#crearTipoMovimientoMeta')) location.href = '#/super_admin/tipos_movimientos_meta/crear';
    if(e.target.closest('#editarTipoMovimientoMeta')){
        const id = e.target.closest('#editarTipoMovimientoMeta').dataset.tipo_movimiento_meta_id;
        location.href = `#/super_admin/tipos_movimientos_meta/editar/tipo_id=${id}`;
    }
    if(e.target.closest('#eliminarTipoMovimientoMeta')) await eliminar(e.target.closest('#eliminarTipoMovimientoMeta'));
    if(e.target.closest('.modal-exit--tiposMovimientosMeta')) cerrarModal();
});
