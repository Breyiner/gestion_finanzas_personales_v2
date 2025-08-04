import { Calendar } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import esLocale from '@fullcalendar/core/locales/es';

import { createResumen } from '../home/homeController';
import { addClass, deleteClass } from '../../helpers/modifyClass';
import { get } from '../../helpers/api';
import { abrirModalMovimientosCal } from '../../components/modales/verMovimientosCalendario';
import { abrirModalNewMovimiento } from '../../components/modales/registrarMovimiento';
import { abrirModalDetallesMov } from '../../components/modales/detallesMovimiento';

let usuario_id = null;
let calendar =  null;
let numberMes = null;
let tipoMovimiento = null;
let fechaSeleccionada = null;


export const calendarioController = async () => {

  usuario_id = parseInt(localStorage.getItem('usuario_id'));
  numberMes = new Date().getMonth() + 1;

  const containerSwitch = document.querySelector('.container-switch');

  let infoSwitch = await get(`tiposMovimiento`);

  let datosSwitch = infoSwitch.data;
  
  await createCalendar();
  createSwitch(containerSwitch, datosSwitch);
  await switchAction();

  await mangementResumen();

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
      await gestionarDia(fechaSeleccionada)
    },

    events: []
  });

  calendar.render();
}

async function switchAction() {

    let infoTipo = await get(`tiposMovimiento`);
    let tiposData = infoTipo.data;
    

    let radioCheck = document.querySelector('.switch-filtro__radio:checked');
    let labels = document.querySelectorAll('.switch-filtro__name');

    labels.forEach(label => deleteClass(label, 'checkeado'));

    let idTipo = radioCheck.dataset.id;

    const {color} = tiposData.find(tipo => tipo.id == idTipo);
    

    const labelCheck = [...labels].find(label => label.dataset.id == idTipo);
    
    if(labelCheck.dataset.id == idTipo) {
        
        addClass(labelCheck, 'checkeado');
        labelCheck.style.setProperty('--colorTipo', color);
        tipoMovimiento = idTipo;
    }

    if(idTipo != 3) {
  
      const {data} = await get(`movimientos/usuario/${usuario_id}/tipoMovimiento/${idTipo}/mes/${numberMes}`)
      await obtenerMovimientosCalendario(data);
    }
      else if(idTipo == 3) {
        const {data} = await get(`aportes/usuario/${usuario_id}/mes/${numberMes}`);

        await obtenerMovimientosCalendario(data);
    }
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
        labelRadio.classList.add('switch-filtro__name', 'switch-filtreo__name--calendario');
        labelRadio.setAttribute('data-id', id);
        labelRadio.textContent = nombre;

        switchFilter.append(radio, labelRadio);
    });

    container.append(switchFilter);
}

async function mangementResumen() {
  
  const containerResumen = document.querySelector('.container-resumen-calendario');
  let infoResumen = await get(`dashboard/completo/usuario/${usuario_id}/mes/${numberMes}`);

  let datosResumen = infoResumen.data;
  
  createResumen(containerResumen, datosResumen);

}

async function obtenerMovimientosCalendario(data) {

  const movimientos = [];

  data.forEach(({id, nombre, color, fecha_creacion}) => {
    
    movimientos.push(
      {
        title: nombre,
        start: fecha_creacion,
        allDay: true,
        color: color, // Color de fondo
        textColor: 'white' // Color del texto
      }
    )

  })

  calendar.removeAllEvents();
  calendar.addEventSource(movimientos);
}

async function gestionarDia(fecha) {
  await abrirModalMovimientosCal(fecha, tipoMovimiento);  
}

const detallesModal = async (movimiento) => {

  const idMovimiento = movimiento.dataset.id;

  console.log(idMovimiento);

  await abrirModalDetallesMov( calendarioController, idMovimiento);
    
}

document.addEventListener('click', async (e) => {

    if(e.target.closest('.switch-filtreo__name--calendario')) await switchAction();
    if (e.target.closest('#nuevoMovimientoCalendario')) await abrirModalNewMovimiento(calendarioController, fechaSeleccionada);
    if (e.target.closest('.tile--movimientoCalendario')) await detallesModal(e.target.closest('.tile--movimientoCalendario'));
    // if (e.target.closest('#registarMovimiento')) mostrarModal(modalCrear);

    // if (e.target.closest('.modal-exit--calendario')) cerrarModal();
});
