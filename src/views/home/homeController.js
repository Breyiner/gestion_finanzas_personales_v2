import { cerrarModal } from '../../helpers/modalManagement';
import { get } from '../../helpers/api';
import { formatter } from '../../helpers/formateadorPrecio';
import { addClass, deleteClass } from '../../helpers/modifyClass';
import { abrirModalNewMovimiento } from '../../components/modales/registrarMovimiento';
import { abrirModalMovimientos } from '../../components/modales/verMovimientos';
import { abrirModalDetallesMov } from '../../components/modales/detallesMovimiento';

export const homeController = async () => {
    
    const containerResumen = document.querySelector('.container-resumen');
    let infoResumen = await get(`dashboard/completo/usuario/1/mes/7`);

    let datosResumen = infoResumen.data;
    
    createResumen(containerResumen, datosResumen);


    const containerSwitch = document.querySelector('.container-switch');
    let infoSwitch = await get(`tiposMovimiento`);

    let datosSwitch = infoSwitch.data;

    createSwitch(containerSwitch, datosSwitch);

    await switchAction();
}

function createResumen (container, data) {
    container.innerHTML = "";

    data.forEach(({icono, color, nombre, total}) => {
        console.log(formatter.format(total));
        
        let movimientoResumen = document.createElement('div');
        movimientoResumen.classList.add('movimiento-resumen');

        let iconoResumen = document.createElement('i');
        iconoResumen.classList.add(icono, 'movimiento-resumen__icono');

        let informacionResumen = document.createElement('div');
        informacionResumen.classList.add('movimiento-resumen__info');

        let tituloResumen = document.createElement('h3');
        tituloResumen.classList.add('movimiento-resumen__titulo');
        tituloResumen.textContent = nombre;
        
        let montoResumen = document.createElement('p');
        montoResumen.classList.add('movimiento-resumen__monto');
        montoResumen.textContent = formatter.format(total);

        informacionResumen.append(tituloResumen, montoResumen);

        movimientoResumen.append(iconoResumen, informacionResumen);
        movimientoResumen.style.backgroundColor = color;
        
        container.append(movimientoResumen);
    });

}

function createSwitch (container, data) {

    container.innerHTML = "";

    let switchFilter = document.createElement('div');
    switchFilter.classList.add('switch-filtro');
    
    data.forEach(({id, nombre, color}, i) => {
        
        let radio = document.createElement('input');
        radio.classList.add('switch-filtro__radio');
        radio.setAttribute('type', 'radio');
        radio.setAttribute('name', 'radio-switch');
        radio.setAttribute('id', `radio-switch-${nombre.toLowerCase()}`);
        radio.setAttribute('data-id', id);

        if(i == 0) radio.setAttribute('checked', "");

        let labelRadio = document.createElement('label');
        labelRadio.setAttribute('for', `radio-switch-${nombre.toLowerCase()}`);
        labelRadio.classList.add('switch-filtro__name');
        labelRadio.setAttribute('data-id', id);
        labelRadio.textContent = nombre;

        switchFilter.append(radio, labelRadio);
    });

    container.append(switchFilter);
}

function createCategoriaDetails (container, data) {

    container.innerHTML = "";

    data.forEach(({id, tipo_movimiento_id, icono, color, nombre, color_bg, cantidad, total}) => {        
        
        let tileDetails = document.createElement('div');
        tileDetails.classList.add('tile', 'tile--categoria');
        tileDetails.setAttribute('data-id', id);
        tileDetails.setAttribute('data-tipo_movimiento', tipo_movimiento_id);

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
        tileDescription.textContent = `${cantidad} movimientos`;

        let tileMonto = document.createElement('span');
        tileMonto.classList.add('tile__monto');
        tileMonto.style.color = color;
        tileMonto.textContent = formatter.format(total);

        iconBox.append(tileIcon);
        tileContent.append(tileTitle, tileDescription);
        tileInfo.append(iconBox, tileContent);
        tileDetails.append(tileInfo, tileMonto);

        container.append(tileDetails);
    })

}

async function switchAction() {

    let infoTipo = await get(`tiposMovimiento`);
    let tiposData = infoTipo.data;
    

    let radioCheck = document.querySelector('.switch-filtro__radio:checked');
    let labels = document.querySelectorAll('.switch-filtro__name');

    labels.forEach(label => deleteClass(label, 'checkeado'));

    let idTipo = radioCheck.dataset.id;
    
    const containerCategorias = document.querySelector('.tile-container');
    let infoDetalles;
    let datosDetalles;

    const {color} = tiposData.find(tipo => tipo.id == idTipo);
    

    const labelCheck = [...labels].find(label => label.dataset.id == idTipo);
    
    if(labelCheck.dataset.id == idTipo) {
        
        addClass(labelCheck, 'checkeado');
        labelCheck.style.setProperty('--colorTipo', color);
    }

    containerCategorias.innerHTML = "";
    if(idTipo != 3) {
        infoDetalles = await get(`dashboard/categorias/usuario/1/mes/7/tipo/${idTipo}`);

        datosDetalles = infoDetalles.data;

    }
    else if(idTipo == 3) {
        infoDetalles = await get(`dashboard/metas/detalle/usuario/1/mes/7`);

        datosDetalles = infoDetalles.data;
    }
    createCategoriaDetails(containerCategorias, datosDetalles);
}


const verMovimientos = async (categoria) => {
    
    const idCategoria = categoria.dataset.id;
    const idTipoMovimiento = categoria.dataset.tipo_movimiento;

    await abrirModalMovimientos(idCategoria, idTipoMovimiento);
    
    
}

const detallesModal = async (movimiento) => {

    const idMovimiento = movimiento.dataset.id;

    console.log(idMovimiento);

    await abrirModalDetallesMov(idMovimiento);
    
}

document.addEventListener('click', async (e) => {

    if(e.target.closest('.switch-filtro__name')) setTimeout(async () => await switchAction(), 0);

    if (e.target.closest('#nuevoMovimiento')) await abrirModalNewMovimiento();
    if (e.target.closest('.tile--categoria')) await verMovimientos(e.target.closest('.tile--categoria'));
    if (e.target.closest('.tile--movimiento')) await detallesModal(e.target.closest('.tile--movimiento'));


    if (e.target.closest('.modal-exit--inicio')) cerrarModal();
});