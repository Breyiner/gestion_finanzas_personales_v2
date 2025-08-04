// userModal.js
import { get } from '../../helpers/api';
import { cerrarModal, mostrarModal } from '../../helpers/modalManagement';
import htmlContent from  './verMovimientos.html?raw';
import { formatter } from '../../helpers/formateadorPrecio.js';

let usuario_id = null;

export const abrirModalMovimientosCal = async (fecha, idTipoMovimiento) => {

  usuario_id = parseInt(localStorage.getItem('usuario_id'));

    // Crear y mostrar el modal
    mostrarModal(htmlContent);
    
    const tituloModal = document.querySelector('.modal-header__title');
    tituloModal.textContent = fecha;

    // Ahora configurar la funcionalidad
    await configurarModalMovimientos(fecha, idTipoMovimiento);
};

async function configurarModalMovimientos(fecha, idTipoMovimiento) {
    
    const containerMovimientos = document.querySelector('.tile-container--modal');
    let datos = [];

    crearBotonNuevo(containerMovimientos, fecha);

    if(idTipoMovimiento != 3) {
        
        const infoMovimientos = await get(`movimientos/usuario/${usuario_id}/tipoMovimiento/${idTipoMovimiento}/fecha/${fecha}`);
    
        console.log(infoMovimientos);
        
        datos = infoMovimientos.data;

        crearMovimientos(containerMovimientos, datos, "movimientoCalendario");
    }
    
    else {
        // let idMeta = idCategoria;
        // const infoMovimientos = await get(`Movimientos/detallados/meta/${idMeta}/usuario/1/mes/7`);
        
        // datos = infoMovimientos.data;
        // crearMovimientos(containerMovimientos, datos);
    }

}

function crearBotonNuevo(container, fecha) {

    let btnNuevoMovimiento = document.createElement('button');
    btnNuevoMovimiento.setAttribute('type', 'button');
    btnNuevoMovimiento.setAttribute('id', 'nuevoMovimientoCalendario');
    btnNuevoMovimiento.setAttribute('data-fecha', fecha);
    btnNuevoMovimiento.classList.add('boton', 'boton-txt-mainColor', 'boton--grande', 'boton--borde-mainColor');
    btnNuevoMovimiento.textContent = "Registrar Movimiento";

    container.append(btnNuevoMovimiento);
}

async function crearMovimientos(container, data, extraClass = "") {

    if (data.length == 0) {
        let sinRegistros = document.createElement('span');
        sinRegistros.textContent = "No hay registros";
        sinRegistros.classList.add('elemento-vacio');
        container.append(sinRegistros);
        return;
    }

    data.forEach(({id, icono, color, nombre, color_bg, categoria, monto}) => {
        
        let tileDetails = document.createElement('div');
        tileDetails.classList.add('tile', `tile--${extraClass}`);
        tileDetails.setAttribute('data-id', id);

        let tileInfo = document.createElement('div');
        tileInfo.classList.add('tile__info');

        let iconBox = document.createElement('div');
        iconBox.classList.add('tile__icon-box');
        iconBox.style.backgroundColor = color_bg;

        let tileIcon = document.createElement('i');
        tileIcon.classList.add('tile__icon', icono);
        tileIcon.style.color = color;

        let tileContent = document.createElement('div');
        tileContent.classList.add('tile__content');

        let tileTitle = document.createElement('span');
        tileTitle.classList.add('tile__title');
        tileTitle.textContent = nombre;

        let tileDescription = document.createElement('span');
        tileDescription.classList.add('tile__description');
        tileDescription.textContent = categoria;

        let tileMonto = document.createElement('span');
        tileMonto.classList.add('tile__monto');
        tileMonto.style.color = color;
        tileMonto.textContent = formatter.format(monto);

        iconBox.append(tileIcon);
        tileContent.append(tileTitle, tileDescription);
        tileInfo.append(iconBox, tileContent);
        tileDetails.append(tileInfo, tileMonto);
    
        container.append(tileDetails);
    });

}