// userModal.js
import { get } from '../../helpers/api';
import { cerrarModal, mostrarModal } from '../../helpers/modalManagement';
import htmlContent from  './verMovimientos.html?raw';
import { formatter } from '../../helpers/formateadorPrecio.js';

const mesActual = new Date().getMonth() + 1;
const usuario_id = parseInt(localStorage.getItem('usuario_id'));

export const abrirModalMovimientos = async (idCategoria, idTipoMovimiento) => {
    // Crear y mostrar el modal
    mostrarModal(htmlContent);
    
    // Ahora configurar la funcionalidad
    await configurarModalMovimiento(idCategoria, idTipoMovimiento);
};

async function configurarModalMovimiento(idCategoria, idTipoMovimiento) {
    
    const containerMovimientos = document.querySelector('.tile-container--modal');
    let datos = [];

    if(idTipoMovimiento != 3) {

        const infoMovimientos = await get(`movimientos/categoria/${idCategoria}/usuario/${usuario_id}/tipoMovimiento/${idTipoMovimiento}/mes/${mesActual}`);
    
        datos = infoMovimientos.data;

        crearMovimientos(containerMovimientos, datos, "movimiento");
    }
    
    else {
        let idMeta = idCategoria;
        const infoAportes = await get(`aportes/detallados/meta/${idMeta}/usuario/${usuario_id}/mes/${mesActual}`);
        
        datos = infoAportes.data;
        crearMovimientos(containerMovimientos, datos);
    }

}

async function crearMovimientos(container, data, extraClass = "") {

    data.forEach(({id, icono, color, nombre, color_bg, fecha_creacion, monto}) => {
        
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
        tileDescription.textContent = fecha_creacion;

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