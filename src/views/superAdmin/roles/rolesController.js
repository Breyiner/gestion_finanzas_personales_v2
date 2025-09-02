import { delet, get } from '../../../helpers/api';
import { cerrarModal } from '../../../helpers/modalManagement';
import { isAuthorize } from '../../../helpers/auth';
import { confirm, error, success } from '../../../helpers/alertas';

export const rolesController = async () => {
    const containerTable = document.querySelector('.container-table');

    if (isAuthorize('roles.index')) {
        const { data } = await get('roles');
        containerTable.innerHTML = "";

        if (isAuthorize('roles.store')) createBtnNew(containerTable);

        crearTabla(containerTable, data);
    }
};

function createBtnNew(container) {
    const btnNuevo = document.createElement('button');
    btnNuevo.classList.add('boton', 'boton--verde');
    btnNuevo.type = 'button';
    btnNuevo.id = 'crearRole';
    btnNuevo.textContent = "Nuevo Rol";
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

    ['ID', 'Nombre', 'Editar', 'Eliminar'].forEach(txt => {
        const th = document.createElement('th');
        th.textContent = txt;
        th.classList.add('tabla__celda', 'tabla__celda--header');
        trHead.append(th);
    });

    thead.append(trHead);
    table.append(thead);

    const tbody = document.createElement('tbody');

    data.forEach(({ id, name }) => {
        const tr = document.createElement('tr');
        tr.classList.add('tabla__fila');
        tr.dataset.roleId = id;

        const tdId = document.createElement('td');
        const tdNombre = document.createElement('td');
        const tdEditar = document.createElement('td');
        const tdEliminar = document.createElement('td');

        tdId.classList.add('tabla__celda');
        tdNombre.classList.add('tabla__celda');
        tdEditar.classList.add('tabla__celda');
        tdEliminar.classList.add('tabla__celda');

        tdId.textContent = id;
        tdNombre.textContent = name;

        if (isAuthorize('roles.update')) {
            const btnEditar = document.createElement('button');
            btnEditar.classList.add('boton', 'boton--azul');
            btnEditar.dataset.role_id = id;
            btnEditar.id = 'editarRole';
            btnEditar.textContent = "Editar";
            tdEditar.append(btnEditar);
        }

        if (isAuthorize('roles.destroy')) {
            const btnEliminar = document.createElement('button');
            btnEliminar.classList.add('boton', 'boton--rojo');
            btnEliminar.type = 'button';
            btnEliminar.id = 'eliminarRole';
            btnEliminar.dataset.role_id = id;
            btnEliminar.textContent = "Eliminar";
            tdEliminar.append(btnEliminar);
        }

        tr.append(tdId, tdNombre, tdEditar, tdEliminar);
        tbody.append(tr);
    });

    table.append(tbody);
    container.append(table);
}

async function eliminar(boton) {
    const id = boton.dataset.role_id;
    const confirmacion = await confirm("¿Está seguro de eliminar el rol?");

    if (confirmacion.isConfirmed) {
        const res = await delet(`roles/${id}`);
        if (!res.success) {
            error(res.message);
            return;
        }
        await success(res.message);
        rolesController();
    }
}

document.addEventListener('click', async e => {
    if (e.target.closest('#crearRole'))
        location.href = '#/super_admin/roles/crear';

    if (e.target.closest('#editarRole')) {
        const id = e.target.closest('#editarRole').dataset.role_id;
        location.href = `#/super_admin/roles/editar/role_id=${id}`;
    }

    if (e.target.closest('#eliminarRole'))
        await eliminar(e.target.closest('#eliminarRole'));

    if (e.target.closest('.modal-exit--roles')) cerrarModal();
});
