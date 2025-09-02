import { Calendar } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import esLocale from '@fullcalendar/core/locales/es';

import { createResumen } from '../home/homeController';
import { addClass, deleteClass } from '../../helpers/modifyClass';
import { get } from '../../helpers/api';
import { abrirModalMovimientosCal } from '../../components/modales/verMovimientosCalendario';
import { abrirModalNewMovimiento } from '../../components/modales/registrarMovimiento';
import abrirModalDetallesMov from '../home/movimientos/movimiento/detallesMovimiento';
import { isAuthorize } from '../../helpers/auth';
import { cerrarModal } from '../../helpers/modalManagement';

let usuario_id = null;
let calendar =  null;
let numberMes = null;
let anioCalendar = null;
let tipoMovimiento = null;
let fechaSeleccionada = null;
let idTipoMovimiento = null;


export const calendarioController = async (parametros = null) => {

  usuario_id = parseInt(localStorage.getItem('user_id'));
  numberMes = new Date().getMonth() + 1;

  await createCalendar();

  const containerSwitch = document.querySelector('.container-switch');

  if(isAuthorize('transaction-types.index')){
  
    let infoSwitch = await get(`transactionTypes/whit-goals`);
    let datosSwitch = infoSwitch.data;

    localStorage.setItem('transactionTypes', JSON.stringify(datosSwitch));

    createSwitch(containerSwitch, datosSwitch);

    await switchAction();
      
    await mangementResumen();
  }


};


async function createCalendar() {
  const calendarEl = document.getElementById('calendario');

  calendar = new Calendar(calendarEl, {
    plugins: [dayGridPlugin, interactionPlugin],
    locale: esLocale,
    initialView: 'dayGridMonth',
    dayMaxEvents: 1,
    validRange: {
      end: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 1)
    },
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth'
    },
    buttonText: {
      today: 'Hoy',
      month: 'Mes',
      week: 'Semana',
      day: 'Día'
    },
    datesSet: async (info) => {
      numberMes = info.view.currentStart.getMonth() + 1;
      anioCalendar = info.view.currentStart.getFullYear();
      await mangementResumen();
      await switchAction();
    },
    eventClick: (info) => {
      info.jsEvent.stopPropagation();
      info.jsEvent.preventDefault();
    },
    eventDidMount: (info) => {
      info.el.style.pointerEvents = 'none';
    },
    dateClick: async (info) => {
      fechaSeleccionada = info.dateStr;
      localStorage.setItem('fecha_calendario', fechaSeleccionada);
      await gestionarDia(fechaSeleccionada)
    },

    events: []
  });

  calendar.render();
}

async function switchAction() {

  let tiposData = JSON.parse(localStorage.getItem('transactionTypes'));

  let radioCheck = document.querySelector('.switch-filtro__radio:checked');
  let labels = document.querySelectorAll('.switch-filtro__name');

  labels.forEach(label => deleteClass(label, 'checkeado'));

  let idTipo = radioCheck.dataset.id;

  const {color} = tiposData.find(tipo => tipo.id == idTipo);


  const labelCheck = [...labels].find(label => label.dataset.id == idTipo);

  if(labelCheck.dataset.id == idTipo) {
      
    addClass(labelCheck, 'checkeado');
    labelCheck.style.setProperty('--colorTipo', color);
  }
  
  idTipoMovimiento = idTipo;

  localStorage.setItem('id_tipo_movimiento', idTipoMovimiento);

  if(idTipo == 0) {
      
    if(isAuthorize('goals.index-own')){
        
      const {data} = await get(`goalTransactions/me/period?month=${numberMes}&year=${anioCalendar}`);
  
      await gestionarMovimientosCalendario(data);

    }
  }
  else {

    if(isAuthorize('transaction-categories.index-own')) {


      const {data} = await get(`transactions/me/transactionTypes/${idTipoMovimiento}/period?month=${numberMes}&year=${anioCalendar}`);
      
      await gestionarMovimientosCalendario(data);
    }
  }
}

function createSwitch (container, data) {

    container.innerHTML = "";

    let switchFilter = document.createElement('div');
    switchFilter.classList.add('switch-filtro');
    
    data.forEach(({id, name, color}, i) => {
        
        let radio = document.createElement('input');
        radio.classList.add('switch-filtro__radio');
        radio.setAttribute('type', 'radio');
        radio.setAttribute('name', 'radio-switch');
        radio.setAttribute('id', `radio-switch-${name.toLowerCase()}`);
        radio.setAttribute('data-id', id);

        if(i == 0) radio.setAttribute('checked', "");

        let labelRadio = document.createElement('label');
        labelRadio.setAttribute('for', `radio-switch-${name.toLowerCase()}`);
        labelRadio.classList.add('switch-filtro__name', 'switch-filtreo__name--calendario');
        labelRadio.setAttribute('data-id', id);
        labelRadio.textContent = name;

        switchFilter.append(radio, labelRadio);
    });

    container.append(switchFilter);
}

async function mangementResumen() {
  
  const containerResumen = document.querySelector('.container-resumen-calendario');

  if(isAuthorize('balance.show-own')) {
  
    let infoResumen = await get(`balance/me?month=${numberMes}&year=${anioCalendar}`);
    let datosResumen = infoResumen.data;
    
    createResumen(containerResumen, datosResumen);
  }

}

async function gestionarMovimientosCalendario(data) {

  const movimientos = [];

  data.forEach(({id, name, color, created_at}) => {
    
    movimientos.push(
      {
        title: name,
        start: created_at,
        allDay: true,
        color: color,
        textColor: 'white'
      }
    )

  })

  calendar.removeAllEvents();
  calendar.addEventSource(movimientos);
}

async function gestionarDia(fecha) {

  if(isAuthorize('calendar.access')) location.href = `#/calendario/movimientos/fecha=${fecha}`;
}

const detallesModal = async (movimiento) => {

  const idMovimiento = movimiento.dataset.id;

  if(idTipoMovimiento != 0 && isAuthorize('calendar.access')) location.href = `#/calendario/movimientos/movimiento/movimiento_id=${idMovimiento}`;

  if(idTipoMovimiento == 0 && isAuthorize('calendar.access')) location.href = `#/calendario/movimientos/movimiento/movimiento_meta_id=${idMovimiento}`;

  // await abrirModalDetallesMov( calendarioController, idMovimiento);
    
}

document.addEventListener('click', async (e) => {

  if(e.target.closest('.switch-filtreo__name--calendario') && isAuthorize('transaction-types.index')) 
    requestAnimationFrame(async () => await switchAction());

  if (e.target.closest('#nuevoMovimientoCalendario') && isAuthorize('transactions.store'))
    location.href = `#/calendario/movimientos/crear`;

  if (e.target.closest('.tile--movimientoCalendario')) await detallesModal(e.target.closest('.tile--movimientoCalendario'));

  if (e.target.closest('.modal-exit--calendario')) cerrarModal();
});
