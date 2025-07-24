import { Calendar } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import esLocale from '@fullcalendar/core/locales/es';

import modalCrear from  '../../components/modales/registrarMovimientoCalendario.html?raw';
import modalMovimientos from  '../../components/modales/verMovimientosCalendario.html?raw';
import modalDetalles from  '../../components/modales/detallesMovimientoCalendario.html?raw';
import { cerrarModal, mostrarModal } from '../../helpers/modalManagement';

// Estructura de datos para citas médicas
const citasMedicas = [
    {
        title: 'Juan Pérez - Consulta General',
        start: '2025-07-24',
        allDay: true,
        color: '#ff6b6b', // Color de fondo
        textColor: 'white' // Color del texto
    }
];

export const calendarioController = () =>{
    const calendarEl = document.getElementById('calendario');
    const calendar = new Calendar(calendarEl, {
    plugins: [dayGridPlugin, interactionPlugin],
    locale: esLocale,
    initialView: 'dayGridMonth',
    dayMaxEvents: 2,
    validRange: {
        end: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 1)
    // Limita hasta el último día del mes actual
    },
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,dayGridWeek,dayGridDay'
    },
    buttonText: {
      today: 'Hoy',
      month: 'Mes',
      week: 'Semana',
      day: 'Día'
    },
    events: citasMedicas,
    dateClick: () => mostrarModal(modalMovimientos)
  });

  calendar.render();

  calendar.addEvent({
    title: 'Nuevo evento',
    start: '2025-07-20',
    allDay: true,
    color: '#ff6b6b', // Color de fondo
    textColor: 'white' // Color del texto
  });
};


document.addEventListener('click', (e) => {

    if (e.target.closest('#registarMovimiento')) mostrarModal(modalCrear);
    if (e.target.closest('.tile--movimientoCalendario')) mostrarModal(modalDetalles);

    if (e.target.closest('.modal-exit--calendario')) cerrarModal();
});
