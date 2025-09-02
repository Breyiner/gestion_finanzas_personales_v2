import htmlContent from './editarCiudad.html?raw';
import { cerrarTodos, mostrarModal } from '../../../../helpers/modalManagement';
import { datos, validarCampo, validarCampos, validarMaximo, validarTexto } from '../../../../helpers/validaciones';
import { get, put } from '../../../../helpers/api';
import { isAuthorize } from '../../../../helpers/auth';
import { success } from '../../../../helpers/alertas';
import { errorModal } from '../../../../components/modales/modalError';

let city_id = null;

export default async (parametros = null) => {

    mostrarModal(htmlContent);

    const {ciudad_id} = parametros;
    city_id = ciudad_id;
    
    const formCiudad = document.querySelector('#form-editarCiudad');

    if(isAuthorize('cities.show')) {
    
        const {data} = await get(`cities/${ciudad_id}`);

        await llenarFormulario(formCiudad, data);
    }
    
    gestionarValidaciones();
}

async function llenarFormulario(formulario, usuarioData) {

    const campos = formulario.querySelectorAll('input, textarea, select');
    
    campos.forEach(async campo => {
        
        if(campo.getAttribute('name') in usuarioData)
            campo.value = usuarioData[campo.getAttribute('name')];
    });

}

function gestionarValidaciones() {

    let nombre = document.querySelector("#nombre");
    
    nombre.addEventListener('keydown', (e) => {
        validarTexto(e);
        validarMaximo(e, 30);
    })

    nombre.addEventListener('blur', (e) => validarCampo(e));
}

async function validarSubmit(e) {

    if(validarCampos(e)) {
        
        console.log(datos);
        let botonCrear = document.querySelector(('#btnEditarCiudad'));
        let textoOriginal = botonCrear.textContent;
        botonCrear.disabled = true;
        botonCrear.textContent = "cargando...";
        
        let response = await put(datos, `cities/${city_id}`);
        
        botonCrear.textContent = textoOriginal;
        botonCrear.disabled = false;

        if(response.success) {
            cerrarTodos();
            success(response.message);
            e.target.reset();
        }
        else {
            cerrarTodos();
            if(response.errors.length > 0)  {

                await errorModal(response.errors[0]);
                return;
            }
            await errorModal(response.message);
        }
    }

}

document.addEventListener('submit', async (e) => {
    e.preventDefault();

    if(e.target.closest('#form-editarCiudad')) await validarSubmit(e);
    
})