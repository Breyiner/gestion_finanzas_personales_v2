// userModal.js
import { get } from '../../../helpers/api.js';
import { cerrarModal, mostrarModal } from '../../../helpers/modalManagement.js';
import htmlContent from  './verMovimientos.html?raw';
import { formatter } from '../../../helpers/formateadorPrecio.js';
import { isAuthorize } from '../../../helpers/auth.js';

let mesActual = null;
let anioActual = null;
let usuario_id = null;

export default async (parametros = null) => {

    mesActual = new Date().getMonth() + 1;
    anioActual = new Date().getFullYear();
    usuario_id = parseInt(localStorage.getItem('user_id'));

    const {fecha} = parametros;
    const tipoMovimiento = parseInt(localStorage.getItem('id_tipo_movimiento'));
    
    // Crear y mostrar el modal
    mostrarModal(htmlContent);
        
    const tituloModal = document.querySelector('.modal-header__title');
    tituloModal.textContent = fecha;

    // Ahora configurar la funcionalidad
    await configurarModalMovimientos(fecha, tipoMovimiento);
};

async function configurarModalMovimientos(fecha, tipoMovimiento) {
    
    const containerMovimientos = document.querySelector('.tile-container--modal');

    if(!tipoMovimiento) {

        if(isAuthorize('goal-transactions.index-own')) {
            const {data} = await get(`goalTransactions/me?date=${fecha}`);
    
            console.log(data);
            
            crearMovimientos(containerMovimientos, data, "movimientoCalendario");
        }
    }
    
    else {
        const containerMovimientos = document.querySelector('.tile-container--modal');

        if(isAuthorize('transactions.store')) crearBotonNuevo(containerMovimientos, fecha);

        if(isAuthorize('transactions.index-own')) {
            const {data} = await get(`transactions/transactionTypes/${tipoMovimiento}/me?date=${fecha}`);
            console.log(data);
            
            crearMovimientos(containerMovimientos, data, "movimientoCalendario");
        }
    }

}

function crearBotonNuevo(container, fecha) {

    let btnNuevoMovimiento = document.createElement('button');
    btnNuevoMovimiento.setAttribute('type', 'button');
    btnNuevoMovimiento.setAttribute('id', 'nuevoMovimientoCalendario');
    btnNuevoMovimiento.setAttribute('data-fecha', fecha);
    btnNuevoMovimiento.classList.add('boton', 'boton-txt-mainColor', 'boton--grande', 'boton--borde-mainColor', 'boton--none-bg', 'boton--auto-heigth');
    btnNuevoMovimiento.textContent = "Registrar Movimiento";

    container.append(btnNuevoMovimiento);
}

function crearMovimientos(container, data, extraClass = "") {

    if (data.length == 0) {
        let sinRegistros = document.createElement('span');
        sinRegistros.textContent = "No hay registros";
        sinRegistros.classList.add('elemento-vacio');
        container.append(sinRegistros);
        return;
    }

    data.forEach(({id, icon, color, name, created_at, amount}) => {
        
        let tileDetails = document.createElement('div');
        tileDetails.classList.add('tile', `tile--${extraClass}`);
        tileDetails.setAttribute('data-id', id);

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