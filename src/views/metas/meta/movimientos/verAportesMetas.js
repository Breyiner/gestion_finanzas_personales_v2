// userModal.js
import { get } from '../../../../helpers/api.js';
import { cerrarModal, mostrarModal } from '../../../../helpers/modalManagement.js';
import htmlContent from  './verAportesMetas.html?raw';
import { formatter } from '../../../../helpers/formateadorPrecio.js';
import { isAuthorize } from '../../../../helpers/auth.js';

let usuario_id = null;

export default async (parametros = null) => {

//   usuario_id = parseInt(localStorage.getItem('usuario_id'));

    // Crear y mostrar el modal
    mostrarModal(htmlContent);

    const {meta_id} = parametros;
    
    // Ahora configurar la funcionalidad
    if(isAuthorize('goal-transactions.index-own')) await configurarModalMovimientos(meta_id);
};

async function configurarModalMovimientos(idMeta) {
    
    const containerAportes = document.querySelector('.tile-container--modal');

    const {data} = await get(`goalTransactions/goal/${idMeta}`);
    
    console.log(data);
    
    if(isAuthorize('goal-transactions.store')) crearBotonNuevo(containerAportes, idMeta);
    
    crearMovimientos(containerAportes, data, "aporte");

}

function crearBotonNuevo(containerAportes, idMeta) {

    let containerButtons = document.createElement('div');
    containerButtons.style.display = 'flex';
    containerButtons.style.flexDirection = 'row';
    containerButtons.style.gap = '15px';

    const tipos = ['Ingreso', 'Retiro'];

    tipos.forEach((tipo, id) => {

        let btnNuevoAporte = document.createElement('button');
        btnNuevoAporte.setAttribute('type', 'button');
        btnNuevoAporte.setAttribute('id', 'nuevoAporte');
        btnNuevoAporte.setAttribute('data-meta_id', idMeta);
        btnNuevoAporte.setAttribute('data-tipo_movimiento_id', id + 1);
        btnNuevoAporte.classList.add('boton', 'boton-txt-mainColor', 'boton--grande', 'boton--borde-mainColor', 'boton--none-bg', 'boton--auto-heigth');
        btnNuevoAporte.textContent = `Registrar ${tipo}`;
        btnNuevoAporte.style.width = "100%";

        containerButtons.append(btnNuevoAporte);
    });

    containerAportes.append(containerButtons);
}

async function crearMovimientos(container, data, extraClass = "") {

    if (!data) {
        let sinRegistros = document.createElement('span');
        sinRegistros.textContent = "No hay registros";
        sinRegistros.classList.add('elemento-vacio');
        container.append(sinRegistros);
        return;
    }

    data.forEach(({id, goal_id, icon, color, name, created_at, amount}) => {
        
        let tileDetails = document.createElement('div');
        tileDetails.classList.add('tile', `tile--${extraClass}`);
        tileDetails.setAttribute('data-id', id);
        tileDetails.setAttribute('data-meta_id', goal_id);

        let tileInfo = document.createElement('div');
        tileInfo.classList.add('tile__info');

        let iconBox = document.createElement('div');
        iconBox.classList.add('tile__icon-box');

        let tileIcon = document.createElement('i');
        tileIcon.classList.add('tile__icon', icon);
        tileIcon.style.color = color;

        let tileContent = document.createElement('div');
        tileContent.classList.add('tile__content');

        let tileTitle = document.createElement('span');
        tileTitle.classList.add('tile__title');
        tileTitle.textContent = name;

        let tileDescription = document.createElement('span');
        tileDescription.classList.add('tile__description');
        tileDescription.textContent = created_at;

        let tileMonto = document.createElement('span');
        tileMonto.classList.add('tile__monto');
        tileMonto.style.color = color;
        tileMonto.textContent = formatter.format(amount);

        iconBox.append(tileIcon);
        tileContent.append(tileTitle, tileDescription);
        tileInfo.append(iconBox, tileContent);
        tileDetails.append(tileInfo, tileMonto);
    
        container.append(tileDetails);
    });

}