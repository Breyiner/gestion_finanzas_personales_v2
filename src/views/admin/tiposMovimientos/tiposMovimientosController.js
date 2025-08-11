import { confirmModal } from "../../../components/modales/modalConfirm";
import { abrirModalNewTipo } from "../../../components/modales/tiposMovimientos/crearTipo";
import { abrirModalEditTipo } from "../../../components/modales/tiposMovimientos/editarTipo";
import { error, success } from "../../../helpers/alertas";
import { delet, get } from "../../../helpers/api";
import { cerrarModal } from "../../../helpers/modalManagement";

export const tiposMovimientosController = async () => {
  let containerTable = document.querySelector(".container-table");

  const { data } = await get("tiposMovimiento");

  console.log(data);

  containerTable.innerHTML = "";
  createBtnNew(containerTable);
  crearTabla(containerTable, data);
};

function createBtnNew(container) {
  const btnNuevo = document.createElement("button");
  btnNuevo.classList.add("boton", "boton--verde");
  btnNuevo.setAttribute("type", "button");
  btnNuevo.setAttribute("id", "nuevoTipo");
  btnNuevo.textContent = "Nuevo Tipo";

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
  const cellColor = document.createElement("th");
  const cellColorBg = document.createElement("th");
  const cellEditar = document.createElement("th");
  const cellEliminar = document.createElement("th");

  // dar clases a los elementos
  table.classList.add("tabla", "tabla--sinWidth");
  tableHeader.classList.add("tabla__header");
  cellId.classList.add("tabla__celda", "tabla__celda--header");
  cellNombre.classList.add("tabla__celda", "tabla__celda--header");
  cellIcono.classList.add("tabla__celda", "tabla__celda--header");
  cellColor.classList.add("tabla__celda", "tabla__celda--header");
  cellColorBg.classList.add("tabla__celda", "tabla__celda--header");
  cellEditar.classList.add("tabla__celda", "tabla__celda--header");
  cellEliminar.classList.add("tabla__celda", "tabla__celda--header");

  // dar contenido
  cellId.textContent = "ID";
  cellNombre.textContent = "Nombre";
  cellIcono.textContent = "Icono";
  cellColor.textContent = "Color";
  cellColorBg.textContent = "Color Fondo";
  cellEditar.textContent = "Editar";
  cellEliminar.textContent = "Eliminar";

  const tableBody = document.createElement("tbody");

  data.forEach(({ id, nombre, icono, color, color_bg }) => {
    // Crear cuerpo de la tabla
    const rowBody = document.createElement("tr");
    const cellIdBody = document.createElement("td");
    const cellNameBody = document.createElement("td");
    const cellIconoBody = document.createElement("td");
    const cellColorBody = document.createElement("td");
    const cellColorBgBody = document.createElement("td");
    const cellEditBody = document.createElement("td");
    const cellDeleteBody = document.createElement("td");

    //dar clases y atributos
    rowBody.setAttribute("data-tipo_movimiento_id", id);
    rowBody.classList.add("tabla__fila");
    cellIdBody.classList.add("tabla__celda");
    cellNameBody.classList.add("tabla__celda");
    cellIconoBody.classList.add("tabla__celda");
    cellColorBody.classList.add("tabla__celda");
    cellColorBgBody.classList.add("tabla__celda");
    cellEditBody.classList.add("tabla__celda");
    cellDeleteBody.classList.add("tabla__celda");

    //contenido celdas cuerpo
    cellIdBody.textContent = id;
    cellNameBody.textContent = nombre;

    let iconContent = document.createElement('i');
    iconContent.classList.add(icono, 'tabla__icon');
    cellIconoBody.append(iconContent);

    let containerColor = document.createElement('div');
    containerColor.style.backgroundColor = color;
    containerColor.classList.add('tabla__container-color');
    cellColorBody.append(containerColor);

    let containerColorBg = document.createElement('div');
    containerColorBg.style.backgroundColor = color_bg;
    containerColorBg.classList.add('tabla__container-color');
    cellColorBgBody.append(containerColorBg);

    // crear botones
    const btnEditar = document.createElement("button");
    const btnEliminar = document.createElement("button");

    //dar clases y atributos
    btnEditar.classList.add("boton", "boton--azul");
    btnEliminar.classList.add("boton", "boton--rojo");
    btnEditar.setAttribute("data-tipo_movimiento_id", id);
    btnEditar.setAttribute("id", "editarTipo");
    btnEliminar.setAttribute("type", "button");
    btnEliminar.setAttribute("id", "eliminarTipo");
    btnEliminar.setAttribute("data-tipo_movimiento_id", id);

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
      cellColorBody,
      cellColorBgBody,
      cellEditBody,
      cellDeleteBody
    );
    tableBody.append(rowBody);
  });

  rowHeader.append(cellId, cellNombre, cellIcono, cellColor, cellColorBg, cellEditar, cellEliminar);
  tableHeader.append(rowHeader);

  table.append(tableHeader, tableBody);

  container.append(table);
}

async function configEdit(boton) {

    let idTipoMovimiento = boton.dataset.tipo_movimiento_id;
    await abrirModalEditTipo(idTipoMovimiento);

}

async function eliminar(boton) {
    
    let dataId = boton.dataset.tipo_movimiento_id;
    

    const confirmacion = await confirmModal("¿Está seguro de eliminar el tipo de movimiento?");
    if(confirmacion){
        const respuesta = await delet(`tiposMovimiento/${dataId}`);
        
        if(!respuesta.success){
            console.log(respuesta);
            error(respuesta.message);
            return
        }
        
        await success(respuesta.message)
        tiposMovimientosController();
    }
}


document.addEventListener('click', async (e) => {

    if (e.target.closest('#nuevoTipo')) await abrirModalNewTipo();
    if (e.target.closest('#editarTipo')) await configEdit(e.target.closest('#editarTipo'));
  if (e.target.closest('#eliminarTipo')) await eliminar(e.target.closest('#eliminarTipo'));

    if(e.target.closest('.modal-exit--tipos')) cerrarModal();
})