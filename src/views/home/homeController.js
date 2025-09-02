// Importa la función para cerrar modales desde el módulo de gestión de modales
import { cerrarModal } from '../../helpers/modalManagement';
// Importa la función `get` desde el módulo de API para realizar solicitudes HTTP
import { get } from '../../helpers/api';
// Importa la función para formatear precios
import { formatter } from '../../helpers/formateadorPrecio';
// Importa funciones para agregar y eliminar clases de elementos del DOM
import { addClass, deleteClass } from '../../helpers/modifyClass';
// Importa la función para animar valores numéricos en el DOM
import { animateValue } from '../../helpers/animacionValores';
// Importa la función para verificar autorizaciones del usuario
import { isAuthorize } from '../../helpers/auth';

// Variables globales para almacenar el mes, año y ID del usuario actuales, y el tipo de movimiento
let mesActual = null;
let anioActual = null;
let usuario_id = null;
let idTipoMovimiento = null;

/**
 * Inicializa el controlador de la página principal, configurando el resumen, el botón de nuevo movimiento y el switch de filtros.
 * @param {Object|null} [parametros=null] - Parámetros opcionales para la inicialización.
 * @returns {Promise<void>} - Resuelve cuando se completa la configuración de la página.
 */
export const homeController = async (parametros = null) => {
    // Establece el mes actual (suma 1 porque getMonth() devuelve 0-11)
    mesActual = new Date().getMonth() + 1;
    // Establece el año actual
    anioActual = new Date().getFullYear();
    // Obtiene el ID del usuario desde el almacenamiento local y lo convierte a entero
    usuario_id = parseInt(localStorage.getItem('user_id'));

    // Obtiene el contenedor del resumen del DOM
    const containerResumen = document.querySelector('.container-resumen');

    // Verifica si el usuario tiene permiso para ver su propio balance
    if (isAuthorize('balance.show-own')) {
        // Realiza una solicitud GET para obtener el resumen del balance del usuario para el mes y año actuales
        let infoResumen = await get(`balance/me?month=${mesActual}&year=${anioActual}`);
        // Extrae los datos del resumen de la respuesta
        let datosResumen = infoResumen.data;

        // Muestra los datos del resumen en la consola para depuración
        console.log(datosResumen);

        // Crea los elementos del resumen en el contenedor correspondiente
        createResumen(containerResumen, datosResumen);
    }

    // Obtiene el contenedor de la vista principal del DOM
    const containerView = document.querySelector('.container-inicio');

    // Verifica si el usuario tiene permiso para crear transacciones
    if (isAuthorize('transactions.store')) {
        // Crea el botón para registrar un nuevo movimiento
        crearNuevo(containerView);
    }

    // Obtiene el contenedor del switch de filtros del DOM
    const containerSwitch = document.querySelector('.container-switch');

    // Verifica si el usuario tiene permiso para listar tipos de transacciones
    if (isAuthorize('transaction-types.index')) {
        // Realiza una solicitud GET para obtener los tipos de transacciones con metas
        let infoSwitch = await get(`transactionTypes/whit-goals`);
        // Extrae los datos de los tipos de transacciones
        let datosSwitch = infoSwitch.data;

        // Almacena los tipos de transacciones en el almacenamiento local como JSON
        localStorage.setItem('transactionTypes', JSON.stringify(datosSwitch));

        // Crea el switch de filtros en el contenedor correspondiente
        createSwitch(containerSwitch, datosSwitch);

        // Configura las acciones del switch de filtros
        await switchAction();
    }
}

/**
 * Crea los elementos del resumen de movimientos en el contenedor especificado.
 * @param {HTMLElement} container - Contenedor donde se renderizarán los elementos del resumen.
 * @param {Array<Object>} data - Datos del resumen con icono, color, nombre y total.
 * @returns {void}
 */
export function createResumen(container, data) {
    // Limpia el contenido del contenedor
    container.innerHTML = "";

    // Itera sobre los datos del resumen para crear cada elemento
    data.forEach(({ icon, color, name, total }) => {
        // Crea un contenedor para un movimiento del resumen
        let movimientoResumen = document.createElement('div');
        // Agrega la clase correspondiente al contenedor del movimiento
        movimientoResumen.classList.add('movimiento-resumen');

        // Crea un elemento para el icono del movimiento
        let iconoResumen = document.createElement('i');
        // Agrega las clases correspondientes al icono
        iconoResumen.classList.add(icon, 'movimiento-resumen__icono');

        // Crea un contenedor para la información del movimiento
        let informacionResumen = document.createElement('div');
        // Agrega la clase correspondiente al contenedor de información
        informacionResumen.classList.add('movimiento-resumen__info');

        // Crea un título para el movimiento
        let tituloResumen = document.createElement('h3');
        // Agrega la clase correspondiente al título
        tituloResumen.classList.add('movimiento-resumen__titulo');
        // Establece el texto del título con el nombre del movimiento
        tituloResumen.textContent = name;

        // Crea un elemento para el monto del movimiento
        let montoResumen = document.createElement('p');
        // Agrega la clase correspondiente al monto
        montoResumen.classList.add('movimiento-resumen__monto');
        // Anima el valor del monto para mostrarlo dinámicamente
        animateValue(montoResumen, total);

        // Agrega el título y el monto al contenedor de información
        informacionResumen.append(tituloResumen, montoResumen);

        // Agrega el icono y la información al contenedor del movimiento
        movimientoResumen.append(iconoResumen, informacionResumen);
        // Aplica el color de fondo al contenedor del movimiento
        movimientoResumen.style.backgroundColor = color;

        // Agrega el movimiento al contenedor principal
        container.append(movimientoResumen);
    });
}

/**
 * Crea el switch de filtros para los tipos de transacciones en el contenedor especificado.
 * @param {HTMLElement} container - Contenedor donde se renderizará el switch.
 * @param {Array<Object>} data - Datos de los tipos de transacciones con ID, nombre y color.
 * @returns {void}
 */
function createSwitch(container, data) {
    // Limpia el contenido del contenedor
    container.innerHTML = "";

    // Crea un contenedor para el switch de filtros
    let switchFilter = document.createElement('div');
    // Agrega la clase correspondiente al contenedor del switch
    switchFilter.classList.add('switch-filtro');

    // Itera sobre los datos de los tipos de transacciones
    data.forEach(({ id, name, color }, i) => {
        // Crea un input de tipo radio para el filtro
        let radio = document.createElement('input');
        // Agrega la clase correspondiente al input
        radio.classList.add('switch-filtro__radio');
        // Establece el tipo del input como radio
        radio.setAttribute('type', 'radio');
        // Establece el atributo name para agrupar los radios
        radio.setAttribute('name', 'radio-switch');
        // Establece un ID único para el radio
        radio.setAttribute('id', `radio-switch-${name.toLowerCase()}`);
        // Asocia el ID del tipo de transacción como dato
        radio.setAttribute('data-id', id);

        // Marca el primer radio como seleccionado por defecto
        if (i == 0) radio.setAttribute('checked', "");

        // Crea una etiqueta para el radio
        let labelRadio = document.createElement('label');
        // Asocia la etiqueta con el radio correspondiente
        labelRadio.setAttribute('for', `radio-switch-${name.toLowerCase()}`);
        // Agrega las clases correspondientes a la etiqueta
        labelRadio.classList.add('switch-filtro__name', 'switch-filtreo__name--inicio');
        // Asocia el ID del tipo de transacción como dato
        labelRadio.setAttribute('data-id', id);
        // Establece el texto de la etiqueta con el nombre del tipo
        labelRadio.textContent = name;

        // Agrega el radio y la etiqueta al contenedor del switch
        switchFilter.append(radio, labelRadio);
    });

    // Agrega el switch al contenedor principal
    container.append(switchFilter);
}

/**
 * Crea los detalles de las categorías en el contenedor especificado.
 * @param {HTMLElement} container - Contenedor donde se renderizarán los detalles de las categorías.
 * @param {Array<Object>} data - Datos de las categorías con ID, icono, nombre, color, total de transacciones y suma.
 * @returns {void}
 */
function createCategoriaDetails(container, data) {
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

    // Muestra los datos en la consola para depuración
    console.log(data);

    // Itera sobre los datos de las categorías
    data.forEach(({ id, icon, name, color, total_transactions, sum_transactions }) => {
        // Crea un contenedor para el detalle de la categoría
        let tileDetails = document.createElement('div');
        // Agrega las clases correspondientes al contenedor
        tileDetails.classList.add('tile', 'tile--categoria');
        // Asocia el ID de la categoría como dato
        tileDetails.setAttribute('data-id', id);

        // Crea un contenedor para la información de la categoría
        let tileInfo = document.createElement('div');
        // Agrega la clase correspondiente al contenedor de información
        tileInfo.classList.add('tile__info');

        // Crea un contenedor para el icono
        let iconBox = document.createElement('div');
        // Agrega la clase correspondiente al contenedor del icono
        iconBox.classList.add('tile__icon-box');

        // Crea el icono de la categoría
        let tileIcon = document.createElement('i');
        // Agrega las clases correspondientes al icono
        tileIcon.classList.add('tile__icon', icon);
        // Aplica el color al icono
        tileIcon.style.color = color;

        // Crea un contenedor para el contenido de la categoría
        let tileContent = document.createElement('div');
        // Agrega la clase correspondiente al contenedor de contenido
        tileContent.classList.add('tile__content');

        // Crea un elemento para el título de la categoría
        let tileTitle = document.createElement('span');
        // Agrega la clase correspondiente al título
        tileTitle.classList.add('tile__title');
        // Establece el texto del título con el nombre de la categoría
        tileTitle.textContent = name;

        // Crea un elemento para la descripción de la categoría
        let tileDescription = document.createElement('span');
        // Agrega la clase correspondiente a la descripción
        tileDescription.classList.add('tile__description');
        // Establece el texto de la descripción con el número de movimientos
        tileDescription.textContent = `${total_transactions} movimientos`;

        // Crea un elemento para el monto de la categoría
        let tileMonto = document.createElement('span');
        // Agrega la clase correspondiente al monto
        tileMonto.classList.add('tile__monto');
        // Aplica el color al monto
        tileMonto.style.color = color;
        // Formatea y establece el monto total de las transacciones
        tileMonto.textContent = formatter.format(sum_transactions);

        // Agrega el icono al contenedor del icono
        iconBox.append(tileIcon);
        // Agrega el título y la descripción al contenedor de contenido
        tileContent.append(tileTitle, tileDescription);
        // Agrega el contenedor del icono y el contenido al contenedor de información
        tileInfo.append(iconBox, tileContent);
        // Agrega la información y el monto al contenedor del detalle
        tileDetails.append(tileInfo, tileMonto);

        // Agrega el detalle al contenedor principal
        container.append(tileDetails);
    });
}

/**
 * Configura las acciones del switch de filtros, actualizando las categorías según el tipo seleccionado.
 * @returns {Promise<void>} - Resuelve cuando se completa la actualización de las categorías.
 */
async function switchAction() {
    // Obtiene los tipos de transacciones almacenados en el almacenamiento local
    let tiposData = JSON.parse(localStorage.getItem('transactionTypes'));

    // Obtiene el radio seleccionado del switch de filtros
    let radioCheck = document.querySelector('.switch-filtro__radio:checked');
    // Obtiene todas las etiquetas de los filtros
    let labels = document.querySelectorAll('.switch-filtro__name');

    // Elimina la clase 'checkeado' de todas las etiquetas
    labels.forEach(label => deleteClass(label, 'checkeado'));

    // Obtiene el ID del tipo de transacción seleccionado
    let idTipo = radioCheck.dataset.id;

    // Obtiene el contenedor de categorías del DOM
    const containerCategorias = document.querySelector('.tile-container');
    let infoDetalles;
    let datosDetalles;

    // Busca el color correspondiente al tipo de transacción seleccionado
    const { color } = tiposData.find(tipo => tipo.id == idTipo);

    // Busca la etiqueta correspondiente al tipo seleccionado
    const labelCheck = [...labels].find(label => label.dataset.id == idTipo);

    // Verifica si la etiqueta coincide con el tipo seleccionado
    if (labelCheck.dataset.id == idTipo) {
        // Agrega la clase 'checkeado' a la etiqueta seleccionada
        addClass(labelCheck, 'checkeado');
        // Aplica el color del tipo como variable CSS
        labelCheck.style.setProperty('--colorTipo', color);
    }

    // Limpia el contenido del contenedor de categorías
    containerCategorias.innerHTML = "";
    // Establece el ID del tipo de movimiento actual
    idTipoMovimiento = idTipo;
    // Verifica si el tipo seleccionado es 0 (metas)
    if (idTipo == 0) {
        // Oculta el botón para crear un nuevo movimiento
        ocultarNuevo();

        // Verifica si el usuario tiene permiso para ver sus propias metas
        if (isAuthorize('goals.index-own')) {
            // Realiza una solicitud GET para obtener el resumen de metas del usuario
            infoDetalles = await get(`goals/me/summary?month=${mesActual}&year=${anioActual}`);
            // Extrae los datos del resumen de metas
            datosDetalles = infoDetalles.data;
            // Muestra los datos en la consola para depuración
            console.log(datosDetalles);
        }
    } else {
        // Muestra el botón para crear un nuevo movimiento
        mostrarNuevo();

        // Verifica si el usuario tiene permiso para listar categorías de transacciones propias
        if (isAuthorize('transaction-categories.index-own')) {
            // Realiza una solicitud GET para obtener las categorías del tipo de transacción seleccionado
            infoDetalles = await get(`transactionCategories/me/transactionTypes/${idTipoMovimiento}/period?month=${mesActual}&year=${anioActual}`);
            // Extrae los datos de las categorías
            datosDetalles = infoDetalles.data;
        }
    }

    // Crea los detalles de las categorías en el contenedor correspondiente
    createCategoriaDetails(containerCategorias, datosDetalles);
}

/**
 * Crea el botón para registrar un nuevo movimiento en el contenedor especificado.
 * @param {HTMLElement} container - Contenedor donde se renderizará el botón.
 * @returns {void}
 */
function crearNuevo(container) {
    // Crea un botón para registrar un nuevo movimiento
    let buttonCreate = document.createElement('button');
    // Agrega la clase correspondiente al botón
    buttonCreate.classList.add('nuevo');
    // Establece un ID único para el botón
    buttonCreate.setAttribute('id', 'nuevoMovimiento');

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
 * Muestra el botón para crear un nuevo movimiento.
 * @returns {void}
 */
function mostrarNuevo() {
    // Obtiene el botón de nuevo movimiento del DOM
    let btnNuevo = document.querySelector('#nuevoMovimiento');

    // Elimina la clase 'invisible' para mostrar el botón
    deleteClass(btnNuevo, 'invisible');
}

/**
 * Oculta el botón para crear un nuevo movimiento.
 * @returns {void}
 */
function ocultarNuevo() {
    // Obtiene el botón de nuevo movimiento del DOM
    let btnNuevo = document.querySelector('#nuevoMovimiento');

    // Agrega la clase 'invisible' para ocultar el botón
    addClass(btnNuevo, 'invisible');
}

/**
 * Redirige a la página de movimientos según la categoría o meta seleccionada.
 * @param {HTMLElement} tileCard - Elemento de la tarjeta seleccionada.
 * @returns {Promise<void>} - Resuelve cuando se completa la redirección.
 */
const verMovimientos = async (tileCard) => {
    // Obtiene el ID de la categoría o meta desde los datos del elemento
    const id = tileCard.dataset.id;
    // Muestra el ID en la consola para depuración
    console.log(id);

    // Verifica si el tipo de movimiento es 0 (metas) y si el usuario tiene permiso
    if (idTipoMovimiento == 0 && isAuthorize('home.access')) {
        // Redirige a la página de movimientos de metas con el ID correspondiente
        location.href = `#/inicio/movimientos/meta_id=${id}`;
    }

    // Verifica si el tipo de movimiento no es 0 (categorías) y si el usuario tiene permiso
    if (idTipoMovimiento != 0 && isAuthorize('home.access')) {
        // Redirige a la página de movimientos de categorías con el ID correspondiente
        location.href = `#/inicio/movimientos/categoria_id=${id}`;
    }
}

/**
 * Redirige a la página de detalles de un movimiento según el tipo seleccionado.
 * @param {HTMLElement} movimiento - Elemento del movimiento seleccionado.
 * @returns {Promise<void>} - Resuelve cuando se completa la redirección.
 */
const detallesModal = async (movimiento) => {
    // Obtiene el ID del movimiento desde los datos del elemento
    const idMovimiento = movimiento.dataset.id;
    // Muestra el ID del tipo de movimiento en la consola para depuración
    console.log(idTipoMovimiento);

    // Verifica si el tipo de movimiento no es 0 (categorías) y si el usuario tiene permiso
    if (idTipoMovimiento != 0 && isAuthorize('home.access')) {
        // Redirige a la página de detalles del movimiento con el ID correspondiente
        location.href = `#/inicio/movimientos/movimiento/movimiento_id=${idMovimiento}`;
    }

    // Verifica si el tipo de movimiento es 0 (metas) y si el usuario tiene permiso
    if (idTipoMovimiento == 0 && isAuthorize('home.access')) {
        // Redirige a la página de detalles del movimiento de meta con el ID correspondiente
        location.href = `#/inicio/movimientos/movimiento/movimiento_meta_id=${idMovimiento}`;
    }
}

/**
 * Redirige a la página para crear un nuevo movimiento.
 * @returns {Promise<void>} - Resuelve cuando se completa la redirección.
 */
const crearMovimiento = async () => {
    // Almacena el ID del tipo de movimiento en el almacenamiento local
    localStorage.setItem('id_tipo_movimiento', idTipoMovimiento);

    // Verifica si el usuario tiene permiso para acceder a la página principal
    if (isAuthorize('home.access')) {
        // Redirige a la página para crear un nuevo movimiento
        location.href = `#/inicio/movimientos/movimiento/crear`;
    }
}

// Agrega un evento 'click' al documento para manejar interacciones del usuario
document.addEventListener('click', async (e) => {
    // Verifica si se hizo clic en una etiqueta del switch de filtros
    if (e.target.closest('.switch-filtreo__name--inicio')) {
        // Ejecuta la acción del switch en el próximo ciclo de animación
        requestAnimationFrame(async () => await switchAction());
    }

    // Verifica si se hizo clic en el botón de nuevo movimiento
    if (e.target.closest('#nuevoMovimiento')) {
        // Llama a la función para crear un nuevo movimiento
        await crearMovimiento();
    }

    // Verifica si se hizo clic en una tarjeta de categoría
    if (e.target.closest('.tile--categoria')) {
        // Llama a la función para ver los movimientos de la categoría
        await verMovimientos(e.target.closest('.tile--categoria'));
    }

    // Verifica si se hizo clic en una tarjeta de movimiento
    if (e.target.closest('.tile--movimiento')) {
        // Llama a la función para mostrar los detalles del movimiento
        await detallesModal(e.target.closest('.tile--movimiento'));
    }

    // Verifica si se hizo clic en el botón para cerrar un modal
    if (e.target.closest('.modal-exit--inicio')) {
        // Cierra el modal activo
        cerrarModal();
    }
});