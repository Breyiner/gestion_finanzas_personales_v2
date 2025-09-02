import { delet, get } from '../../../helpers/api';
import { cerrarModal } from '../../../helpers/modalManagement';
import { isAuthorize } from '../../../helpers/auth';
import { confirm, error, success } from '../../../helpers/alertas';

export const permissionsController = async () => {
    const containerTable = document.querySelector('.container-table');

    if (isAuthorize('permissions.index')) {
        const { data } = await get('permissions');
        containerTable.innerHTML = "";

        if (isAuthorize('permissions.store')) createBtnNew(containerTable);

        crearTabla(containerTable, data);
    }
};

function createBtnNew(container) {
    const btnNuevo = document.createElement('button');
    btnNuevo.classList.add('boton', 'boton--verde');
    btnNuevo.type = 'button';
    btnNuevo.id = 'crearPermission';
    btnNuevo.textContent = "Nuevo Permiso";
    container.append(btnNuevo);
}

function crearTabla(container, data) {
    if (data.length === 0) {
        const sinRegistros = document.createElement('span');
        sinRegistros.textContent = "No hay registros";
        sinRegistros.classList.add('elemento-vacio');
        container.append(sinRegistros);
        return;
    }

    const table = document.createElement('table');
    table.classList.add('tabla');

    const thead = document.createElement('thead');
    thead.classList.add('tabla__header');
    const trHead = document.createElement('tr');

    ['ID', 'Nombre', 'Descripción', 'Editar', 'Eliminar'].forEach(txt => {
        const th = document.createElement('th');
        th.textContent = txt;
        th.classList.add('tabla__celda', 'tabla__celda--header');
        trHead.append(th);
    });

    thead.append(trHead);
    table.append(thead);

    const tbody = document.createElement('tbody');

    data.forEach(({ id, name, description }) => {
        const tr = document.createElement('tr');
        tr.classList.add('tabla__fila');
        tr.dataset.permissionId = id;

        const tdId = document.createElement('td');
        const tdNombre = document.createElement('td');
        const tdDescripcion = document.createElement('td');
        const tdEditar = document.createElement('td');
        const tdEliminar = document.createElement('td');

        tdId.classList.add('tabla__celda');
        tdNombre.classList.add('tabla__celda');
        tdDescripcion.classList.add('tabla__celda');
        tdEditar.classList.add('tabla__celda');
        tdEliminar.classList.add('tabla__celda');

        tdId.textContent = id;
        tdNombre.textContent = name;
        tdDescripcion.textContent = description || '-';

        // estilos para cortar palabras
        tdDescripcion.style.width = "250px";
        tdDescripcion.style.overflow = "hidden";
        tdDescripcion.style.textOverflow = "ellipsis";
        tdDescripcion.style.whiteSpace = "nowrap";

        if (isAuthorize('permissions.update')) {
            const btnEditar = document.createElement('button');
            btnEditar.classList.add('boton', 'boton--azul');
            btnEditar.dataset.permission_id = id;
            btnEditar.id = 'editarPermission';
            btnEditar.textContent = "Editar";
            tdEditar.append(btnEditar);
        }

        if (isAuthorize('permissions.destroy')) {
            const btnEliminar = document.createElement('button');
            btnEliminar.classList.add('boton', 'boton--rojo');
            btnEliminar.type = 'button';
            btnEliminar.id = 'eliminarPermission';
            btnEliminar.dataset.permission_id = id;
            btnEliminar.textContent = "Eliminar";
            tdEliminar.append(btnEliminar);
        }

        tr.append(tdId, tdNombre, tdDescripcion, tdEditar, tdEliminar);
        tbody.append(tr);
    });

    table.append(tbody);
    container.append(table);
}

async function eliminar(boton) {
    const id = boton.dataset.permissionid;
    const confirmacion = await confirm("¿Está seguro de eliminar el permiso?");

    if (confirmacion.isConfirmed) {
        const res = await delet(`permissions/${id}`);
        if (!res.success) {
            error(res.message);
            return;
        }
        await success(res.message);
        permissionsController();
    }
}

document.addEventListener('click', async e => {
    if (e.target.closest('#crearPermission'))
        location.href = '#/super_admin/permissions/crear';

    if (e.target.closest('#editarPermission')) {
        const id = e.target.closest('#editarPermission').dataset.permission_id;
        location.href = `#/super_admin/permissions/editar/permission_id=${id}`;
    }

    if (e.target.closest('#eliminarPermission'))
        await eliminar(e.target.closest('#eliminarPermission'));

    if (e.target.closest('.modal-exit--permissions')) cerrarModal();
});
