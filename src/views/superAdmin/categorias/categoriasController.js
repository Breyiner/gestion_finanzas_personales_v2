import { delet, get } from '../../../helpers/api';
import { cerrarModal } from '../../../helpers/modalManagement';
import { isAuthorize } from '../../../helpers/auth';
import { confirm, error, success } from '../../../helpers/alertas';

export const categoriasController = async () => {
    let containerTable = document.querySelector('.container-table');

    if (isAuthorize('transaction-categories.index')) {
        const { data } = await get('transactionCategories');
        containerTable.innerHTML = "";

        if (isAuthorize('transaction-categories.store')) createBtnNew(containerTable);

        console.log(data);
        await crearTabla(containerTable, data);
    }
};

function createBtnNew(container) {
    const btnNuevo = document.createElement('button');
    btnNuevo.classList.add('boton', 'boton--verde');
    btnNuevo.type = 'button';
    btnNuevo.id = 'crearCategoria';
    btnNuevo.textContent = "Nueva Categoría";
    container.append(btnNuevo);
}

async function crearTabla(container, data) {
    if (data.length === 0) {
        const sinRegistros = document.createElement('span');
        sinRegistros.textContent = "No hay registros";
        sinRegistros.classList.add('elemento-vacio');
        container.append(sinRegistros);
        return;
    }

    const { data: tiposMovimientos } = await get('transactionTypes');
    const { data: iconos } = await get('icons');
    const table = document.createElement('table');
    const thead = document.createElement('thead');
    thead.classList.add('tabla__header');
    const trHead = document.createElement('tr');

    ['ID', 'Nombre', 'Icono', 'Tipo Movimiento', 'Editar', 'Eliminar'].forEach(txt => {
        const th = document.createElement('th');
        th.textContent = txt;
        th.classList.add('tabla__celda', 'tabla__celda--header');
        trHead.append(th);
    });

    thead.append(trHead);
    table.append(thead);

    const tbody = document.createElement('tbody');

    for (const { id, name, icon_id, transaction_type_id } of data) {

        console.log(id);

        const tr = document.createElement('tr');
        tr.classList.add('tabla__fila');
        tr.dataset.categoriaId = id;

        const tdId = document.createElement('td');
        const tdNombre = document.createElement('td');
        const tdIcono = document.createElement('td');
        const tdTipo = document.createElement('td');
        const tdEditar = document.createElement('td');
        const tdEliminar = document.createElement('td');

        tdId.classList.add('tabla__celda');
        tdNombre.classList.add('tabla__celda');
        tdIcono.classList.add('tabla__celda');
        tdTipo.classList.add('tabla__celda');
        tdEditar.classList.add('tabla__celda');
        tdEliminar.classList.add('tabla__celda');

        tdId.textContent = id;
        tdNombre.textContent = name;


        const icono = iconos.find(i => i.id === icon_id);
        tdIcono.innerHTML = icono ? `<i class="${icono.icon}" style="font-size:30px;"></i>` : '-';

        const tipo = tiposMovimientos.find(t => t.id === transaction_type_id);
        tdTipo.textContent = tipo ? tipo.name : '-';

        if (isAuthorize('transaction-categories.update')) {
            const btnEditar = document.createElement('button');
            btnEditar.classList.add('boton', 'boton--azul');
            btnEditar.dataset.categoria_id = id;
            btnEditar.id = 'editarCategoria';
            btnEditar.textContent = "Editar";
            tdEditar.append(btnEditar);
        }

        if (isAuthorize('transaction-categories.destroy')) {
            const btnEliminar = document.createElement('button');
            btnEliminar.classList.add('boton', 'boton--rojo');
            btnEliminar.type = 'button';
            btnEliminar.id = 'eliminarCategoria';
            btnEliminar.dataset.categoria_id = id;
            btnEliminar.textContent = "Eliminar";
            tdEliminar.append(btnEliminar);
        }

        tr.append(tdId, tdNombre, tdIcono, tdTipo, tdEditar, tdEliminar);
        tbody.append(tr);
    }

    table.append(tbody);
    table.classList.add('tabla');
    console.log(table);
    container.append(table);
}

async function eliminar(boton) {
    const id = boton.dataset.categoria_id;
    const confirmacion = await confirm("¿Está seguro de eliminar la categoría?");

    if (confirmacion.isConfirmed) {
        const res = await delet(`transactionCategories/${id}`);
        if (!res.success) {
            error(res.message);
            return;
        }
        await success(res.message);
        categoriasController();
    }
}

document.addEventListener('click', async e => {
    if (e.target.closest('#crearCategoria'))
        location.href = '#/super_admin/categorias/crear';

    if (e.target.closest('#editarCategoria')) {
        const id = e.target.closest('#editarCategoria').dataset.categoria_id;
        location.href = `#/super_admin/categorias/editar/categoria_id=${id}`;
    }

    if (e.target.closest('#eliminarCategoria'))
        await eliminar(e.target.closest('#eliminarCategoria'));

    if (e.target.closest('.modal-exit--categorias')) cerrarModal();
});
