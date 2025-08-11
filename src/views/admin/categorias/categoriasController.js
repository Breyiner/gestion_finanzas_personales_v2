import { abrirModalNewCategoria } from "../../../components/modales/categorias/crearCategoria";
import { abrirModalEditCategoria } from "../../../components/modales/categorias/editarCategoria";
import { confirmModal } from "../../../components/modales/modalConfirm";
import { error, success } from "../../../helpers/alertas";
import { delet, get } from "../../../helpers/api";
import { cerrarModal } from "../../../helpers/modalManagement";

export const categoriasController = async () => {
  let containerTable = document.querySelector(".container-table");

  const { data } = await get("categorias/nombres");

  console.log(data);

  containerTable.innerHTML = "";
  createBtnNew(containerTable);
  crearTabla(containerTable, data);
};

function createBtnNew(container) {
  const btnNuevo = document.createElement("button");
  btnNuevo.classList.add("boton", "boton--verde");
  btnNuevo.setAttribute("type", "button");
  btnNuevo.setAttribute("id", "nuevaCategoria");
  btnNuevo.textContent = "Nueva Categoria";

  container.append(btnNuevo);
}

function crearTabla(container, data) {
  if (data.length == 0) {
    let sinRegistros = document.createElement("span");
    sinRegistros.textContent = "No hay registros";
    sinRegistros.classList.add("elemento-vacio");
    container.append(sinRegistros);
    return;
  }

  // creamos los elementos
  const table = document.createElement("table");
  const tableHeader = document.createElement("thead");
  const rowHeader = document.createElement("tr");
  const cellId = document.createElement("th");
  const cellNombre = document.createElement("th");
  const cellIcono = document.createElement("th");
  const cellTipoMovimiento = document.createElement("th");
  const cellEstado = document.createElement("th");
  const cellEditar = document.createElement("th");
  const cellEliminar = document.createElement("th");

  // dar clases a los elementos
  table.classList.add("tabla", "tabla--sinWidth");
  tableHeader.classList.add("tabla__header");
  cellId.classList.add("tabla__celda", "tabla__celda--header");
  cellNombre.classList.add("tabla__celda", "tabla__celda--header");
  cellIcono.classList.add("tabla__celda", "tabla__celda--header");
  cellTipoMovimiento.classList.add("tabla__celda", "tabla__celda--header");
  cellEditar.classList.add("tabla__celda", "tabla__celda--header");
  cellEliminar.classList.add("tabla__celda", "tabla__celda--header");

  // dar contenido
  cellId.textContent = "ID";
  cellNombre.textContent = "Nombre";
  cellIcono.textContent = "Icono";
  cellTipoMovimiento.textContent = "Tipo Mov.";
  cellEditar.textContent = "Editar";
  cellEliminar.textContent = "Eliminar";

  const tableBody = document.createElement("tbody");

  data.forEach(({ id, nombre, icono, tipo_movimiento }) => {
    // Crear cuerpo de la tabla
    const rowBody = document.createElement("tr");
    const cellIdBody = document.createElement("td");
    const cellNameBody = document.createElement("td");
    const cellIconoBody = document.createElement("td");
    const cellTipoMovimientoBody = document.createElement("td");
    const cellEditBody = document.createElement("td");
    const cellDeleteBody = document.createElement("td");

    //dar clases y atributos
    rowBody.setAttribute("data-categoria_id", id);
    rowBody.classList.add("tabla__fila");
    cellIdBody.classList.add("tabla__celda");
    cellNameBody.classList.add("tabla__celda");
    cellIconoBody.classList.add("tabla__celda");
    cellTipoMovimientoBody.classList.add("tabla__celda");
    cellEditBody.classList.add("tabla__celda");
    cellDeleteBody.classList.add("tabla__celda");

    //contenido celdas cuerpo
    cellIdBody.textContent = id;
    cellNameBody.textContent = nombre;
    cellTipoMovimientoBody.textContent = tipo_movimiento;
    
    let iconContent = document.createElement('i');
    iconContent.classList.add(icono, 'tabla__icon');
    
    cellIconoBody.append(iconContent);
    
    // crear botones
    const btnEditar = document.createElement("button");
    const btnEliminar = document.createElement("button");

    //dar clases y atributos
    btnEditar.classList.add("boton", "boton--azul");
    btnEliminar.classList.add("boton", "boton--rojo");
    btnEditar.setAttribute("data-categoria_id", id);
    btnEditar.setAttribute("id", "editarCategoria");
    btnEliminar.setAttribute("type", "button");
    btnEliminar.setAttribute("id", "eliminarCategoria");
    btnEliminar.setAttribute("data-categoria_id", id);

    // if(estado == "Inactivo") {
    //     btnEliminar.disabled = true;
    //     btnEliminar.classList.remove('boton--rojo');
    // }

    // dar contenido a los botones
    btnEditar.textContent = "Editar";
    btnEliminar.textContent = "Eliminar";

    cellEditBody.append(btnEditar);
    cellDeleteBody.append(btnEliminar);

    rowBody.append(
      cellIdBody,
      cellNameBody,
      cellIconoBody,
      cellTipoMovimientoBody,
      cellEditBody,
      cellDeleteBody
    );
    tableBody.append(rowBody);
  });

  rowHeader.append(cellId, cellNombre, cellIcono, cellTipoMovimiento, cellEditar, cellEliminar);
  tableHeader.append(rowHeader);

  table.append(tableHeader, tableBody);

  container.append(table);
}

async function configEdit(boton) {

    let idCategoria = boton.dataset.categoria_id;
    await abrirModalEditCategoria(idCategoria);

}

async function eliminar(boton) {
    
    let dataId = boton.dataset.categoria_id;
    

    const confirmacion = await confirmModal("¿Está seguro de eliminar la categoria?");
    if(confirmacion){
        const respuesta = await delet(`categorias/${dataId}`);
        
        if(!respuesta.success){
            console.log(respuesta);
            error(respuesta.message);
            return
        }
        
        await success(respuesta.message)
        categoriasController();
    }
}


document.addEventListener('click', async (e) => {

    if (e.target.closest('#nuevaCategoria')) await abrirModalNewCategoria();
    if (e.target.closest('#editarCategoria')) await configEdit(e.target.closest('#editarCategoria'));
    if (e.target.closest('#eliminarCategoria')) await eliminar(e.target.closest('#eliminarCategoria'));

    if(e.target.closest('.modal-exit--categorias')) cerrarModal();
})