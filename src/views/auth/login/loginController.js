// Importa las funciones `error` y `success` desde el módulo de alertas para mostrar notificaciones al usuario
import { error, success } from "../../../helpers/alertas";
// Importa la función `post` desde el módulo de API para realizar solicitudes HTTP
import { post } from "../../../helpers/api";
// Importa la función `isAdmin` para verificar si el usuario tiene permisos de administrador
import { isAdmin } from "../../../helpers/auth";
// Importa funciones de validación para manejar datos de formularios y verificar correos, contraseñas y campos
import { datos, validarCampo, validarCampos, validarCorreo, validarMaximo, validarPassword } from "../../../helpers/validaciones";

/**
 * Inicializa el controlador de login configurando las validaciones del formulario.
 * @returns {void}
 */
export const loginController = () => {
    // Llama a la función que gestiona las validaciones de los campos del formulario
    gestionarValidaciones();
}

/**
 * Configura las validaciones para los campos de correo y contraseña asociando eventos.
 * @returns {void}
 */
function gestionarValidaciones() {
    // Obtiene el elemento del DOM con el ID "correo" (campo de entrada para el correo)
    let correo = document.querySelector("#correo");
    // Obtiene el elemento del DOM con el ID "contrasena" (campo de entrada para la contraseña)
    let contrasena = document.querySelector("#contrasena");

    // Agrega un evento 'keydown' al campo de correo para limitar la longitud máxima del texto
    correo.addEventListener('keydown', (e) => {
        // Valida que el texto ingresado no supere los 30 caracteres
        validarMaximo(e, 30);
    });

    // Agrega un evento 'keydown' al campo de contraseña para limitar la longitud máxima del texto
    contrasena.addEventListener('keydown', (e) => {
        // Valida que el texto ingresado no supere los 20 caracteres
        validarMaximo(e, 20);
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
 * Valida y procesa el envío del formulario de login, enviando los datos al servidor.
 * @param {Event} e - Evento del formulario enviado.
 * @returns {Promise<void>} - Resuelve cuando se completa el procesamiento del formulario.
 */
async function validarSubmit(e) {
    // Verifica si todos los campos del formulario cumplen con las validaciones
    if (validarCampos(e)) {
        // Obtiene el botón de login del formulario
        let botonLogin = document.querySelector('.form__button');
        // Guarda el texto original del botón para restaurarlo luego
        let textoOriginal = botonLogin.textContent;
        // Deshabilita el botón para evitar múltiples envíos mientras se procesa la solicitud
        botonLogin.disabled = true;
        // Cambia el texto del botón para indicar que está cargando
        botonLogin.textContent = "cargando...";

        // Envía una solicitud POST al endpoint 'login' con los datos del formulario
        let response = await post(datos, 'login');

        // Restaura el texto original del botón
        botonLogin.textContent = textoOriginal;
        // Habilita nuevamente el botón para permitir nuevas interacciones
        botonLogin.disabled = false;

        // Verifica si la respuesta del servidor indica un login exitoso
        if (response.success) {
            // Extrae los datos del usuario (id, nombre completo, rol y permisos) de la respuesta
            let { data: { id, full_name, role_id, permissions } } = response;

            // Almacena el ID del usuario en el almacenamiento local
            localStorage.setItem('user_id', id);
            // Almacena el nombre completo del usuario en el almacenamiento local
            localStorage.setItem('full_name', full_name);
            // Almacena los permisos del usuario en el almacenamiento local
            localStorage.setItem('permissions', permissions);
            // Almacena el ID del rol del usuario en el almacenamiento local
            localStorage.setItem('role_id', role_id);

            // Muestra la respuesta del servidor en la consola para depuración
            console.log(response);

            // Muestra una notificación de éxito con el mensaje devuelto por el servidor
            let confirmacion = success(response.message);

            // Resetea el formulario para limpiar los campos
            e.target.reset();

            // Espera a que el usuario confirme la notificación de éxito
            if ((await confirmacion).isConfirmed) {
                // Obtiene el ID del rol del usuario desde el almacenamiento local
                let role_id = localStorage.getItem('role_id');

                // Redirige al usuario a una página según su rol: super_admin, admin o inicio
                role_id == 1 ? window.location.href = "#/super_admin" : role_id == 2 ? window.location.href = "#/admin" : window.location.href = "#/inicio";
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

    // Verifica si el formulario enviado es el de login (con ID 'form-login')
    if (e.target.closest('#form-login')) {
        // Llama a la función que valida y procesa el formulario de login
        await validarSubmit(e);
    }
});