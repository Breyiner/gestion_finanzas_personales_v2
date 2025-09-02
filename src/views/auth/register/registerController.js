// Importa las funciones `error` y `success` desde el módulo de alertas para mostrar notificaciones al usuario
import { error, success } from "../../../helpers/alertas";
// Importa las funciones `get` y `post` desde el módulo de API para realizar solicitudes HTTP
import { get, post } from "../../../helpers/api";
// Importa funciones de validación para manejar datos de formularios, verificar correos, contraseñas y campos
import { datos, validarCampo, validarCampos, validarCorreo, validarMaximo, validarPassword, validarTexto } from "../../../helpers/validaciones";

/**
 * Inicializa el controlador de registro configurando el formulario.
 * @returns {Promise<void>} - Resuelve cuando se completa la configuración del formulario.
 */
export const registerController = async () => {
    // Llama a la función que configura el formulario de registro
    await configurarFormulario();
}

/**
 * Configura el formulario de registro llenando los selectores de géneros y ciudades, y gestionando validaciones.
 * @returns {Promise<void>} - Resuelve cuando se completa la configuración.
 */
async function configurarFormulario() {
    // Llena el selector de géneros con datos obtenidos del servidor
    await llenarGeneros();
    // Llena el selector de ciudades con datos obtenidos del servidor
    await llenarCiudades();
    // Configura las validaciones para los campos del formulario
    gestionarValidaciones();
}

/**
 * Llena el selector de ciudades con datos obtenidos de la API.
 * @returns {Promise<void>} - Resuelve cuando se completa el llenado del selector.
 */
async function llenarCiudades() {
    // Realiza una solicitud GET al endpoint 'cities' para obtener la lista de ciudades
    let { data } = await get('cities');
    // Obtiene el elemento del DOM con el ID 'ciudad' (selector de ciudades)
    let selectCiudades = document.querySelector('#ciudad');

    // Establece una opción inicial en el selector de ciudades
    selectCiudades.innerHTML = '<option value="">Seleccione...</option>';
    // Itera sobre los datos de ciudades para agregar cada una como una opción en el selector
    data.forEach(({ id, name }) => {
        // Agrega una opción al selector con el ID y nombre de la ciudad
        selectCiudades.innerHTML += `<option value="${id}">${name}</option>`;
    });
}

/**
 * Llena el selector de géneros con datos obtenidos de la API.
 * @returns {Promise<void>} - Resuelve cuando se completa el llenado del selector.
 */
async function llenarGeneros() {
    // Realiza una solicitud GET al endpoint 'genders' para obtener la lista de géneros
    let { data } = await get('genders');
    // Obtiene el elemento del DOM con el ID 'genero' (selector de géneros)
    let selectGeneros = document.querySelector('#genero');

    // Establece una opción inicial en el selector de géneros
    selectGeneros.innerHTML = '<option value="">Seleccione...</option>';
    // Itera sobre los datos de géneros para agregar cada uno como una opción en el selector
    data.forEach(({ id, name }) => {
        // Agrega una opción al selector con el ID y nombre del género
        selectGeneros.innerHTML += `<option value="${id}">${name}</option>`;
    });
}

/**
 * Configura las validaciones para los campos del formulario de registro.
 * @returns {void}
 */
function gestionarValidaciones() {
    // Obtiene el elemento del DOM con el ID 'nombre' (campo de entrada para el nombre)
    let nombre = document.querySelector("#nombre");
    // Obtiene el elemento del DOM con el ID 'apellido' (campo de entrada para el apellido)
    let apellido = document.querySelector("#apellido");
    // Obtiene el elemento del DOM con el ID 'ciudad' (selector de ciudades)
    let ciudades = document.querySelector('#ciudad');
    // Obtiene el elemento del DOM con el ID 'genero' (selector de géneros)
    let generos = document.querySelector('#genero');
    // Obtiene el elemento del DOM con el ID 'correo' (campo de entrada para el correo)
    let correo = document.querySelector("#correo");
    // Obtiene el elemento del DOM con el ID 'contrasena' (campo de entrada para la contraseña)
    let contrasena = document.querySelector("#contrasena");

    // Agrega un evento 'keydown' al campo de nombre para validar el texto y longitud
    nombre.addEventListener('keydown', (e) => {
        // Valida que el texto ingresado contenga solo caracteres permitidos
        validarTexto(e);
        // Valida que el texto ingresado no supere los 30 caracteres
        validarMaximo(e, 30);
    });

    // Agrega un evento 'keydown' al campo de apellido para validar el texto y longitud
    apellido.addEventListener('keydown', (e) => {
        // Valida que el texto ingresado contenga solo caracteres permitidos
        validarTexto(e);
        // Valida que el texto ingresado no supere los 30 caracteres
        validarMaximo(e, 30);
    });

    // Agrega un evento 'keydown' al campo de correo para limitar la longitud máxima
    correo.addEventListener('keydown', (e) => {
        // Valida que el texto ingresado no supere los 30 caracteres
        validarMaximo(e, 30);
    });

    // Agrega un evento 'keydown' al campo de contraseña para limitar la longitud máxima
    contrasena.addEventListener('keydown', (e) => {
        // Valida que el texto ingresado no supere los 20 caracteres
        validarMaximo(e, 20);
    });

    // Agrega un evento 'blur' al campo de nombre para validar su contenido cuando pierde el foco
    nombre.addEventListener('blur', (e) => {
        // Verifica que el campo no esté vacío
        validarCampo(e);
    });

    // Agrega un evento 'blur' al campo de apellido para validar su contenido cuando pierde el foco
    apellido.addEventListener('blur', (e) => {
        // Verifica que el campo no esté vacío
        validarCampo(e);
    });

    // Agrega un evento 'blur' al selector de ciudades para validar su contenido cuando pierde el foco
    ciudades.addEventListener('blur', (e) => {
        // Verifica que se haya seleccionado una ciudad
        validarCampo(e);
    });

    // Agrega un evento 'blur' al selector de géneros para validar su contenido cuando pierde el foco
    generos.addEventListener('blur', (e) => {
        // Verifica que se haya seleccionado un género
        validarCampo(e);
    });

    // Agrega un evento 'blur' al campo de correo para validar su contenido cuando pierde el foco
    correo.addEventListener('blur', (e) => {
        // Verifica que el campo no esté vacío
        validarCampo(e);
        // Valida que el contenido del campo sea un correo electrónico válido
        validarCorreo(e);
    });

    // Agrega un evento 'blur' al campo de contraseña para validar su contenido cuando pierde el foco
    contrasena.addEventListener('blur', (e) => {
        // Verifica que el campo no esté vacío
        validarCampo(e);
    });

    // Agrega un evento 'input' al campo de contraseña para validar su contenido mientras se escribe
    contrasena.addEventListener('input', (e) => {
        // Valida que la contraseña cumpla con los criterios establecidos (fuerza, formato, etc.)
        validarPassword(e);
    });
}

/**
 * Valida y procesa el envío del formulario de registro, enviando los datos al servidor.
 * @param {Event} e - Evento del formulario enviado.
 * @returns {Promise<void>} - Resuelve cuando se completa el procesamiento del formulario.
 */
async function validarSubmit(e) {
    // Verifica si todos los campos del formulario cumplen con las validaciones
    if (validarCampos(e)) {
        // Obtiene el botón de registro del formulario
        let botonRegister = document.querySelector('.form__button');
        // Guarda el texto original del botón para restaurarlo luego
        let textoOriginal = botonRegister.textContent;
        // Deshabilita el botón para evitar múltiples envíos mientras se procesa la solicitud
        botonRegister.disabled = true;
        // Cambia el texto del botón para indicar que está cargando
        botonRegister.textContent = "cargando...";

        // Envía una solicitud POST al endpoint 'register' con los datos del formulario
        let response = await post(datos, 'register');

        // Muestra la respuesta del servidor en la consola para depuración
        console.log(response);
        // Muestra los datos enviados en la consola para depuración
        console.log(datos);

        // Restaura el texto original del botón
        botonRegister.textContent = textoOriginal;
        // Habilita nuevamente el botón para permitir nuevas interacciones
        botonRegister.disabled = false;

        // Verifica si la respuesta del servidor indica un registro exitoso
        if (response.success) {
            // Muestra una notificación de éxito con el mensaje devuelto por el servidor
            let confirmacion = success(response.message);
            // Resetea el formulario para limpiar los campos
            e.target.reset();
            // Espera a que el usuario confirme la notificación de éxito
            if ((await confirmacion).isConfirmed) {
                // Redirige al usuario a la página de login
                window.location.href = "#/login";
            }
        } else {
            // Verifica si la respuesta contiene errores específicos
            if (response.errors) {
                // Muestra el primer error devuelto por el servidor en una notificación
                error(response.errors[0]);
                return;
            }

            // Muestra el mensaje de error general devuelto por el servidor
            error(response.message);
        }
    } else {
        // Muestra un mensaje de error si los campos del formulario no son válidos
        error('Debe llenar los campos correctamente');
    }
}

// Agrega un evento 'submit' al documento para capturar el envío del formulario
document.addEventListener('submit', async (e) => {
    // Evita el comportamiento por defecto del formulario (recargar la página)
    e.preventDefault();

    // Verifica si el formulario enviado tiene la clase 'form--register'
    if (e.target.classList.contains('form--register')) {
        // Llama a la función que valida y procesa el formulario de registro
        await validarSubmit(e);
    }
});