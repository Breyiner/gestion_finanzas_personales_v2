import { get, put } from '../../../../helpers/api';
import { cerrarTodos, mostrarModal } from '../../../../helpers/modalManagement';
import { datos, validarCampo, validarCampos, validarMaximo, validarTexto } from '../../../../helpers/validaciones';
import { generosController } from '../generosController';
import { errorModal } from '../../../../components/modales/modalError';
import htmlContent from './editarGenero.html?raw';
import { isAuthorize } from '../../../../helpers/auth';
import { success } from '../../../../helpers/alertas';

let generoId = null;

export default async (parametros = null) => {
    const { genero_id } = parametros || {};
    if (!isAuthorize('genders.update')) {
        await errorModal('No tienes permisos para editar géneros.');
        return;
    }
    if (!genero_id) return;
    generoId = genero_id;
    mostrarModal(htmlContent);
    gestionarValidaciones();

    const formulario = document.getElementById('form-editarGenero');

    if (!isAuthorize('genders.show')) {
    
        const infoGenero = await get(`genders/${genero_id}`);
        const genero = infoGenero.data;
        cargarFormulario(formulario, genero);
    }
}

function gestionarValidaciones() {
    let nombre = document.querySelector("#nombreGenero");
    nombre.addEventListener('keydown', (e) => {
        validarTexto(e);
        validarMaximo(e, 30);
    });
    nombre.addEventListener('blur', (e) => validarCampo(e));
}

async function validarSubmit(e) {
    if(validarCampos(e)) {
        let botonEditar = document.querySelector('#btnEditarGenero');
        let textoOriginal = botonEditar.textContent;
        botonEditar.disabled = true;
        botonEditar.textContent = "cargando...";
        let response = await put(datos, `genders/${generoId}`);
        botonEditar.textContent = textoOriginal;
        botonEditar.disabled = false;
        if(response.success) {
            cerrarTodos();
            let confirmacion = success(response.message);
            e.target.reset();
            if((await confirmacion).isConfirmed) generosController();
        } else {
            if(response.errors.length > 0)  {
                await errorModal(response.errors[0]);
                return;
            }
            await errorModal(response.message);
        }
    }
}

async function cargarFormulario(formulario, data) {
    const campos = formulario.querySelectorAll('input, textarea, select');
    campos.forEach(async campo => {
        if(campo.getAttribute('name') in data)
            campo.value = data[campo.getAttribute('name')];
    });
}

document.addEventListener('submit', async (e) => {
    e.preventDefault();
    if(e.target.closest('#form-editarGenero')) await validarSubmit(e);
});
