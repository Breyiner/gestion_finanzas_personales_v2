import { error, success } from "../../../helpers/alertas";
import { post } from "../../../helpers/api";
import { isAdmin } from "../../../helpers/auth";
import { datos, validarCampo, validarCampos, validarCorreo, validarMaximo, validarPassword } from "../../../helpers/validaciones";

export const loginController = () => {
    
    gestionarValidaciones();
    
}

function gestionarValidaciones() {
    
    let correo = document.querySelector("#correo");
    let contrasena = document.querySelector("#contrasena");

    correo.addEventListener('keydown', (e) => {
        validarMaximo(e, 30);
    })

    contrasena.addEventListener('keydown', (e) => {
        validarMaximo(e, 20);
    })

    correo.addEventListener('blur', (e) => {
        validarCampo(e);
        validarCorreo(e);
    });

    contrasena.addEventListener('blur', (e) => {
        validarCampo(e);
        validarPassword(e);
    });
}

async function validarSubmit(e) {

    if(validarCampos(e)) {
        
        let botonLogin = document.querySelector(('.form__button'));
        let textoOriginal = botonLogin.textContent;
        botonLogin.disabled = true;
        botonLogin.textContent = "cargando...";

        let response = await post(datos, 'usuarios/login');

        botonLogin.textContent = textoOriginal;
        botonLogin.disabled = false;

        if(response.success) {

            let {data:{id, nombre, apellido, rol_id}} = response;

            localStorage.setItem('usuario_id', id);
            localStorage.setItem('nombre', nombre);
            localStorage.setItem('apellido', apellido);
            localStorage.setItem('rol_id', rol_id);

            let confirmacion = success(response.message);

            e.target.reset();

            if((await confirmacion).isConfirmed) {

                isAdmin() ? window.location.href = "#/admin" : window.location.href = "#/inicio";
            }
        }
        else {
            if(response.data)  {
                error(response.data[0]);
                return;
            }
            
            error(response.message);
        }
    }

}


document.addEventListener('submit', async (e) => {
    e.preventDefault();

    if(e.target.classList.contains('form--login')) await validarSubmit(e);
})