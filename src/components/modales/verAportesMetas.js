// userModal.js
import { get } from '../../helpers/api';
import { cerrarModal, mostrarModal } from '../../helpers/modalManagement';
import htmlContent from  './verMovimientos.html?raw';
import { formatter } from '../../helpers/formateadorPrecio.js';

let usuario_id = null;

export const abrirModalAportes = async (idMeta) => {

  usuario_id = parseInt(localStorage.getItem('usuario_id'));

    // Crear y mostrar el modal
    mostrarModal(htmlContent);
    
    // Ahora configurar la funcionalidad
    await configurarModalAportes(idMeta);
};

async function configurarModalAportes(idMeta) {
    
    const containerAportes = document.querySelector('.tile-container--modal');

    const infoAportes = await get(`aportes/detallados/meta/${idMeta}/usuario/${usuario_id}`);
    
    const datos = infoAportes.data;
    

    crearBotonNuevo(containerAportes, idMeta);
    crearAportes(containerAportes, datos, "aporte");

}

function crearBotonNuevo(containerAportes, idMeta) {

    let btnNuevoAporte = document.createElement('button');
    btnNuevoAporte.setAttribute('type', 'button');
    btnNuevoAporte.setAttribute('id', 'nuevoAporte');
    btnNuevoAporte.setAttribute('data-meta_id', idMeta);
    btnNuevoAporte.classList.add('boton', 'boton-txt-mainColor', 'boton--grande', 'boton--borde-mainColor');
    btnNuevoAporte.textContent = "Registrar aporte";

    containerAportes.append(btnNuevoAporte);
}

async function crearAportes(container, data, extraClass = "") {

    if (!data) {
        let sinRegistros = document.createElement('span');
        sinRegistros.textContent = "No hay registros";
        sinRegistros.classList.add('elemento-vacio');
        container.append(sinRegistros);
        return;
    }

    data.forEach(({id, meta_id, icono, color, nombre, color_bg, fecha_creacion, monto}) => {
        
        let tileDetails = document.createElement('div');
        tileDetails.classList.add('tile', `tile--${extraClass}`);
        tileDetails.setAttribute('data-id', id);
        tileDetails.setAttribute('data-meta_id', meta_id);

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