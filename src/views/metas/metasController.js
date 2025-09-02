// Importa funciones para cerrar modales individuales y todos los modales
import { cerrarModal, cerrarTodos } from '../../helpers/modalManagement';
// Importa funciones para realizar solicitudes DELETE y GET a la API
import { delet, get } from '../../helpers/api';
// Importa la función para formatear precios
import { formatter } from '../../helpers/formateadorPrecio';
// Importa la función para verificar autorizaciones del usuario
import { isAuthorize } from '../../helpers/auth';
// Importa funciones para mostrar notificaciones de error y éxito
import { error, success } from '../../helpers/alertas';

// Variable global para almacenar el ID del usuario
let usuario_id = null;

/**
 * Inicializa el controlador de metas, configurando el contenedor y cargando las metas del usuario.
 * @param {Object|null} [parametros=null] - Parámetros opcionales para la inicialización.
 * @returns {Promise<void>} - Resuelve cuando se completa la configuración de la página de metas.
 */
export const metasController = async (parametros = null) => {
    // Obtiene el ID del usuario desde el almacenamiento local y lo convierte a entero
    usuario_id = parseInt(localStorage.getItem('user_id'));

    // Obtiene el contenedor de la vista de metas del DOM
    const containerView = document.querySelector('.container-metas');

    // Verifica si el usuario tiene permiso para crear metas
    if (isAuthorize('goals.store')) {
        // Crea el botón para registrar una nueva meta
        crearNuevo(containerView);
    }

    // Obtiene el contenedor de las metas del DOM
    const containerMetas = document.querySelector('.metas-container');

    // Verifica si el usuario tiene permiso para listar sus propias metas
    if (isAuthorize('goals.index-own')) {
        // Realiza una solicitud GET para obtener las metas del usuario
        let { data } = await get(`goals/me`);

        // Limpia el contenido del contenedor de metas
        containerMetas.innerHTML = "";

        // Carga las metas en el contenedor correspondiente
        await cargarMetas(containerMetas, data);
    }
}

/**
 * Carga las metas en el contenedor especificado, creando los elementos visuales.
 * @param {HTMLElement} container - Contenedor donde se renderizarán las metas.
 * @param {Array<Object>} data - Datos de las metas con ID, nombre, fecha límite, monto objetivo, progreso y mensaje.
 * @returns {Promise<void>} - Resuelve cuando se completa la carga de las metas.
 */
async function cargarMetas(container, data) {
    // Verifica si no hay datos para mostrar
    if (data.length == 0) {
        // Crea un elemento para indicar que no hay registros
        let sinRegistros = document.createElement('span');
        // Establece el texto del elemento
        sinRegistros.textContent = "No hay registros";
        // Agrega la clase correspondiente al elemento
        sinRegistros.classList.add('elemento-vacio');
        // Agrega el elemento al contenedor
        container.append(sinRegistros);
        return;
    }

    // Itera sobre los datos de las metas
    data.forEach(({ id, name, due_date, target_amount, progress, message }) => {
        // Crea un contenedor para la meta
        const meta = document.createElement('div');
        // Agrega la clase correspondiente al contenedor
        meta.classList.add('meta');
        // Asocia el ID de la meta como dato
        meta.setAttribute('data-id', id);

        // Crea un contenedor para la información de la meta
        const metaInformacion = document.createElement('div');
        // Agrega la clase correspondiente al contenedor de información
        metaInformacion.classList.add('meta__informacion');

        // Crea un elemento para el nombre de la meta
        const metaNombre = document.createElement('span');
        // Agrega la clase correspondiente al nombre
        metaNombre.classList.add('meta__title');
        // Establece el texto del nombre
        metaNombre.textContent = name;

        // Crea un contenedor para la fila de información de la meta
        const metaRow = document.createElement('div');
        // Agrega la clase correspondiente a la fila
        metaRow.classList.add('meta__row');

        // Crea un elemento para el texto de la meta
        const metaTexto = document.createElement('p');
        // Agrega la clase correspondiente al texto
        metaTexto.classList.add('meta__text');
        // Establece el texto estático
        metaTexto.textContent = 'Meta:';

        // Crea un elemento para el monto objetivo de la meta
        const metaMonto = document.createElement('p');
        // Agrega la clase correspondiente al monto
        metaMonto.classList.add('meta__monto');
        // Formatea y establece el monto objetivo
        metaMonto.textContent = formatter.format(target_amount);

        // Crea un contenedor para la fila flexible de información
        const metaRowStyle = document.createElement('div');
        // Agrega las clases correspondientes a la fila flexible
        metaRowStyle.classList.add('meta__row', 'meta__row--flexible');

        // Crea un elemento para la fecha límite de la meta
        const metaLimite = document.createElement('span');
        // Establece el texto de la fecha límite o indica que es flexible
        if (due_date) metaLimite.textContent = `Fecha límite: ${formatearFecha(due_date)}`;
        else metaLimite.textContent = "Meta flexible";

        // Crea un contenedor para el gráfico de progreso
        const metaGrafico = document.createElement('div');
        // Agrega la clase correspondiente al contenedor del gráfico
        metaGrafico.classList.add('meta__grafico');

        // Crea un contenedor para la información de progreso
        const metaProgesoInfo = document.createElement('div');
        // Agrega la clase correspondiente al contenedor de progreso
        metaProgesoInfo.classList.add('meta__progreso-info');

        // Crea un elemento para el monto ahorrado
        const metaAhorrado = document.createElement('span');
        // Agrega la clase correspondiente al monto ahorrado
        metaAhorrado.classList.add('meta__ahorrado');
        // Formatea y establece el monto ahorrado
        metaAhorrado.textContent = formatter.format(progress);

        // Crea un elemento para el porcentaje de progreso
        const metaPorcentaje = document.createElement('span');
        // Agrega la clase correspondiente al porcentaje
        metaPorcentaje.classList.add('meta__porcentaje');
        // Calcula el porcentaje de progreso
        let porcentaje = Math.round((progress * 100) / target_amount);
        // Establece el porcentaje, manejando casos de NaN o valores mayores a 100
        metaPorcentaje.textContent = `${isNaN(porcentaje) ? 0 : porcentaje > 100 ? 100 : porcentaje}%`;

        // Crea una barra de progreso
        const progessBar = document.createElement('progress');
        // Agrega la clase correspondiente a la barra
        progessBar.classList.add('meta__progreso');
        // Establece el valor máximo de la barra (monto objetivo)
        progessBar.max = target_amount;
        // Establece el valor actual de la barra (progreso)
        progessBar.value = progress;

        // Crea un elemento para el mensaje de la meta
        const metaMensaje = document.createElement('span');
        // Agrega la clase correspondiente al mensaje
        metaMensaje.classList.add('meta__sugerencia');
        // Establece el texto del mensaje
        metaMensaje.textContent = message;

        // Agrega el texto y el monto a la fila de información
        metaRow.append(metaTexto, metaMonto);
        // Agrega la fecha límite a la fila flexible
        metaRowStyle.append(metaLimite);
        // Agrega el monto ahorrado y el porcentaje al contenedor de progreso
        metaProgesoInfo.append(metaAhorrado, metaPorcentaje);
        // Agrega la información de progreso, la barra y el mensaje al contenedor del gráfico
        metaGrafico.append(metaProgesoInfo, progessBar, metaMensaje);
        // Agrega el nombre, la fila, la fila flexible y el gráfico al contenedor de información
        metaInformacion.append(metaNombre, metaRow, metaRowStyle, metaGrafico);
        // Agrega la información al contenedor de la meta
        meta.append(metaInformacion);
        // Agrega la meta al contenedor principal
        container.append(meta);
    });
}

/**
 * Formatea una fecha en formato legible en español.
 * @param {string} fechaString - Fecha en formato de cadena.
 * @returns {string} - Fecha formateada en formato 'es-ES' (día, mes corto, año).
 */
function formatearFecha(fechaString) {
    // Crea un objeto Date a partir de la cadena de fecha
    let fecha = new Date(fechaString);
    // Ajusta la fecha sumando un día para corregir posibles desfases
    fecha.setDate(fecha.getDate() + 1);

    // Define las opciones para formatear la fecha (año numérico, mes corto, día numérico)
    const opciones = { year: 'numeric', month: 'short', day: 'numeric' };

    // Formatea la fecha según las opciones y el idioma español
    return fecha.toLocaleDateString('es-ES', opciones);
}

/**
 * Crea el botón para registrar una nueva meta en el contenedor especificado.
 * @param {HTMLElement} container - Contenedor donde se renderizará el botón.
 * @returns {void}
 */
function crearNuevo(container) {
    // Crea un botón para registrar una nueva meta
    let buttonCreate = document.createElement('button');
    // Agrega la clase correspondiente al botón
    buttonCreate.classList.add('nuevo');
    // Establece un ID único para el botón
    buttonCreate.setAttribute('id', 'nuevaMeta');

    // Crea un icono para el botón
    let iconoButton = document.createElement('i');
    // Agrega las clases correspondientes al icono
    iconoButton.classList.add('ri-add-line', 'nuevo__icono');

    // Agrega el icono al botón
    buttonCreate.append(iconoButton);

    // Agrega el botón al contenedor principal
    container.append(buttonCreate);
}

/**
 * Redirige a la página de detalles de una meta seleccionada.
 * @param {HTMLElement} meta - Elemento de la meta seleccionada.
 * @returns {Promise<void>} - Resuelve cuando se completa la redirección.
 */
async function detallesMeta(meta) {
    // Obtiene el ID de la meta desde los datos del elemento
    let idMeta = meta.dataset.id;

    // Verifica si el usuario tiene permiso para ver sus propias metas
    if (isAuthorize('goals.show-own')) {
        // Redirige a la página de detalles de la meta con el ID correspondiente
        location.href = `#/metas/meta/id=${idMeta}`;
    }
}

/**
 * Redirige a la página de movimientos de una meta seleccionada.
 * @param {HTMLElement} btnVerAportes - Botón para ver los aportes de la meta.
 * @returns {Promise<void>} - Resuelve cuando se completa la redirección.
 */
async function verAportes(btnVerAportes) {
    // Obtiene el ID de la meta desde los datos del botón
    let idMeta = btnVerAportes.dataset.id_meta;

    // Verifica si el usuario tiene permiso para ver las transacciones de sus metas
    if (isAuthorize('goal-transactions.index-own')) {
        // Redirige a la página de movimientos de la meta con el ID correspondiente
        location.href = `#/metas/meta/movimientos/meta_id=${idMeta}`;
    }
}

/**
 * Redirige a la página de detalles de un aporte seleccionado.
 * @param {HTMLElement} aporte - Elemento del aporte seleccionado.
 * @returns {Promise<void>} - Resuelve cuando se completa la redirección.
 */
async function detallesAporte(aporte) {
    // Obtiene el ID del aporte desde los datos del elemento
    let idAporte = aporte.dataset.id;
    // Obtiene el ID de la meta desde los datos del elemento
    let idMeta = aporte.dataset.meta_id;

    // Verifica si el usuario tiene permiso para ver las transacciones de sus metas
    if (isAuthorize('goal-transactions.show-own')) {
        // Redirige a la página de detalles del aporte con el ID correspondiente
        location.href = `#/metas/meta/movimientos/movimiento/id=${idAporte}`;
    }
}

/**
 * Redirige a la página para crear un nuevo aporte para una meta.
 * @param {HTMLElement} btnNuevoAporte - Botón para crear un nuevo aporte.
 * @returns {Promise<void>} - Resuelve cuando se completa la redirección.
 */
async function nuevoAporte(btnNuevoAporte) {
    // Obtiene el ID de la meta desde los datos del botón
    let idMeta = btnNuevoAporte.dataset.meta_id;
    // Obtiene el ID del tipo de movimiento desde los datos del botón
    let idTipoMovimiento = btnNuevoAporte.dataset.tipo_movimiento_id;

    // Almacena el ID de la meta en el almacenamiento local
    localStorage.setItem('id_meta', idMeta);
    // Almacena el ID del tipo de movimiento en el almacenamiento local
    localStorage.setItem('id_tipo_movimiento_meta', idTipoMovimiento);

    // Verifica si el usuario tiene permiso para crear transacciones de metas
    if (isAuthorize('goal-transactions.store')) {
        // Redirige a la página para crear un nuevo aporte
        location.href = `#/metas/meta/movimientos/movimiento/crear`;
    }
}

/**
 * Elimina una meta seleccionada y recarga el controlador de metas.
 * @param {HTMLElement} boton - Botón que desencadena la eliminación.
 * @returns {Promise<void>} - Resuelve cuando se completa la eliminación.
 */
async function eliminarMeta(boton) {
    // Obtiene el ID de la meta activa desde el almacenamiento local
    const meta_id = localStorage.getItem('meta_activa');

    // Guarda el texto original del botón para restaurarlo después
    const txt = boton.textContent;

    // Deshabilita el botón para evitar múltiples clics
    boton.disabled = true;
    // Cambia el texto del botón para indicar que está cargando
    boton.textContent = "cargando...";

    // Realiza una solicitud DELETE para eliminar la meta de forma segura
    const res = await delet(`goals/${meta_id}/safe`);

    // Restaura el texto original del botón
    boton.textContent = txt;
    // Habilita nuevamente el botón
    boton.disabled = false;

    // Cierra todos los modales activos
    cerrarTodos();
    // Verifica si la eliminación no fue exitosa
    if (!res.success) {
        // Muestra un mensaje de error con la respuesta del servidor
        error(res.message);
        return;
    }
    // Muestra un mensaje de éxito con la respuesta del servidor
    await success(res.message);
    // Recarga el controlador de metas para actualizar la vista
    metasController();
}

// Agrega un evento 'click' al documento para manejar interacciones del usuario
document.addEventListener('click', async (e) => {
    // Verifica si se hizo clic en el botón para crear una nueva meta
    if (e.target.closest('#nuevaMeta') && isAuthorize('goals.store')) {
        // Redirige a la página para crear una nueva meta
        location.href = `#/metas/crear`;
    }

    // Verifica si se hizo clic en una meta
    if (e.target.closest('.meta')) {
        // Llama a la función para mostrar los detalles de la meta
        await detallesMeta(e.target.closest('.meta'));
    }

    // Verifica si se hizo clic en el botón para ver los movimientos de una meta
    if (e.target.closest('#verMovimientosMeta')) {
        // Llama a la función para mostrar los aportes de la meta
        await verAportes(e.target.closest('#verMovimientosMeta'));
    }

    // Verifica si se hizo clic en un aporte
    if (e.target.closest('.tile--aporte')) {
        // Llama a la función para mostrar los detalles del aporte
        await detallesAporte(e.target.closest('.tile--aporte'));
    }

    // Verifica si se hizo clic en el botón para crear un nuevo aporte
    if (e.target.closest('#nuevoAporte')) {
        // Llama a la función para crear un nuevo aporte
        await nuevoAporte(e.target.closest('#nuevoAporte'));
    }

    // Verifica si se hizo clic en el botón para eliminar una meta
    if (e.target.closest('#eliminarMeta')) {
        // Llama a la función para eliminar la meta
        await eliminarMeta(e.target.closest('#eliminarMeta'));
    }

    // Verifica si se hizo clic en el botón para cerrar un modal
    if (e.target.closest('.modal-exit--metas')) {
        // Cierra el modal activo
        cerrarModal();
    }
});