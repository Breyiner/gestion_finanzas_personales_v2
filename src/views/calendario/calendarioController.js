import { Calendar } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import esLocale from '@fullcalendar/core/locales/es';


// Estructura de datos para citas médicas
const citasMedicas = [
    {
        id: 'cita-001',
        title: 'Juan Pérez - Consulta General',
        start: '2025-07-23T09:00:00',
        end: '2025-07-23T09:30:00',
        backgroundColor: '#3498db',
        extendedProps: {
            paciente: {
                nombre: 'Juan Pérez',
                cedula: '12345678',
                telefono: '+57 300 123 4567',
                email: 'juan@email.com',
                edad: 35,
                seguro: 'EPS Sanitas'
            },
            medico: {
                nombre: 'Dr. González',
                especialidad: 'Medicina General',
                consultorio: '201'
            },
            cita: {
                tipo: 'consulta_general',
                motivo: 'Dolor de cabeza recurrente',
                estado: 'confirmada',
                observaciones: 'Paciente con historial de migrañas',
                costo: 80000,
                copago: 15000
            }
        }
    }
];

// const calendar = new Calendar(calendarEl, {
//     events: citasMedicas,
    
//     eventClick: function(info) {
//         const paciente = info.event.extendedProps.paciente;
//         const medico = info.event.extendedProps.medico;
//         const cita = info.event.extendedProps.cita;
        
//         // Mostrar información detallada
//         mostrarDetallesCita({
//             evento: info.event,
//             paciente: paciente,
//             medico: medico,
//             cita: cita
//         });
//     },
    
//     eventDidMount: function(info) {
//         const estado = info.event.extendedProps.cita.estado;
        
//         // Cambiar color según estado
//         switch(estado) {
//             case 'confirmada':
//                 info.el.style.backgroundColor = '#27ae60';
//                 break;
//             case 'pendiente':
//                 info.el.style.backgroundColor = '#f39c12';
//                 break;
//             case 'cancelada':
//                 info.el.style.backgroundColor = '#e74c3c';
//                 break;
//         }
//     }
// });

function mostrarDetallesCita(datos) {
    const modal = document.getElementById('modal-cita');
    modal.innerHTML = `
        <h3>${datos.evento.title}</h3>
        <div class="paciente-info">
            <h4>Información del Paciente</h4>
            <p>Nombre: ${datos.paciente.nombre}</p>
            <p>Cédula: ${datos.paciente.cedula}</p>
            <p>Teléfono: ${datos.paciente.telefono}</p>
            <p>Seguro: ${datos.paciente.seguro}</p>
        </div>
        <div class="medico-info">
            <h4>Médico</h4>
            <p>${datos.medico.nombre} - ${datos.medico.especialidad}</p>
            <p>Consultorio: ${datos.medico.consultorio}</p>
        </div>
        <div class="cita-info">
            <h4>Detalles de la Cita</h4>
            <p>Motivo: ${datos.cita.motivo}</p>
            <p>Estado: ${datos.cita.estado}</p>
            <p>Costo: $${datos.cita.costo.toLocaleString()}</p>
            <p>Observaciones: ${datos.cita.observaciones}</p>
        </div>
    `;
    modal.style.display = 'block';
}



export const calendarioController = () =>{
    const calendarEl = document.getElementById('calendario');
    const calendar = new Calendar(calendarEl, {
    plugins: [dayGridPlugin, interactionPlugin],
    locale: esLocale,
    initialView: 'dayGridMonth',
    dayMaxEvents: 2,
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
    
    eventClick: function(info) {
      const paciente = info.event.extendedProps.paciente;
      const medico = info.event.extendedProps.medico;
      const cita = info.event.extendedProps.cita;
      
      // Mostrar información detallada
      mostrarDetallesCita({
          evento: info.event,
          paciente: paciente,
          medico: medico,
          cita: cita
      });
    },
    eventDidMount: function(info) {
        const estado = info.event.extendedProps.cita.estado;
        
        // Cambiar color según estado
        switch(estado) {
            case 'confirmada':
                info.el.style.backgroundColor = '#27ae60';
                break;
            case 'pendiente':
                info.el.style.backgroundColor = '#f39c12';
                break;
            case 'cancelada':
                info.el.style.backgroundColor = '#e74c3c';
                break;
        }
    },
    dateClick: function(info) {
        console.log('Fecha clickeada:', info.dateStr);
        console.log('Fecha como objeto:', info.date);
        console.log('Elemento HTML:', info.dayEl);
        console.log('Vista actual:', info.view.type);
        
        alert('Clickeaste en: ' + info.dateStr);
    }
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