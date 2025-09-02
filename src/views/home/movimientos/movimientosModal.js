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

    const {categoria_id, meta_id} = parametros;
    

    // Crear y mostrar el modal
    mostrarModal(htmlContent);
    
    // Ahora configurar la funcionalidad
    await configurarModalMovimiento(categoria_id, meta_id);
};

async function configurarModalMovimiento(categoria_id, meta_id) {
    
    const containerMovimientos = document.querySelector('.tile-container--modal');

    if(meta_id) {

        if(isAuthorize('goal-transactions.index-own')) {
            const {data} = await get(`goalTransactions/goal/${meta_id}/period?month=${mesActual}&year=${anioActual}`);
    
            console.log(data);
            
            crearMovimientos(containerMovimientos, data, "movimiento");
        }
    }
    
    else {
        
        if(isAuthorize('transactions.index-own')) {
            const {data} = await get(`transactions/me/category/${categoria_id}/period?month=${mesActual}&year=${anioActual}`);
            console.log(data);
            
            crearMovimientos(containerMovimientos, data, "movimiento");
        }
    }

}

function crearMovimientos(container, data, extraClass = "") {

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