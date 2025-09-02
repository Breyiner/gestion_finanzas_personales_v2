import { delet, get, put } from '../../../helpers/api';
import { cerrarModal, cerrarTodos, mostrarModal } from '../../../helpers/modalManagement';
import htmlContent from  './detallesMeta.html?raw';
import { validarTexto, validarNumeros, validarCampo, validarCampos, validarMaximo, datos } from '../../../helpers/validaciones';
import { error, success } from '../../../helpers/alertas';
// import { homeController } from '../../views/home/homeController';
import { confirmModal } from '../../../components/modales/modalConfirm';
import { metasController } from '../metasController';
import { errorModal } from '../../../components/modales/modalError';
import { isAuthorize } from '../../../helpers/auth';


let usuario_id = null;

export default async (parametros = null) => {

//   usuario_id = localStorage.getItem('usuario_id');

    // Crear y mostrar el modal
    mostrarModal(htmlContent);
    
    const {id} = parametros;
    
    localStorage.setItem('meta_activa', id);
    // Ahora configurar la funcionalidad

    if(isAuthorize('goals.show-own')) await configurarModalMeta(id);
};

async function configurarModalMeta(idMeta) {

    const formulario = document.getElementById('form-detallesMeta');

    formEditable(formulario, false);

    const {data} = await get(`goals/${idMeta}`);

    console.log(data);
    
    data['completed'] ? data['completed'] = "Completada" : data['completed'] = "Incompleta";


    await cargarFormulario(formulario, data);

    // configurarValidaciones();

    // configurarEventos(formulario, meta);
}

function formEditable(form, editable) {
    
    const campos = form.querySelectorAll('input, textarea, select');

    campos.forEach(campo => campo.disabled = !editable);

}


async function cargarFormulario(formulario, data) {
    
    const campos = formulario.querySelectorAll('input, textarea, select');
    
    campos.forEach(async campo => {
        
        if(campo.getAttribute('name') in data)
            campo.value = data[campo.getAttribute('name')];
        
    });
    
    document.querySelector('.cant-aportes').textContent = data.total_transactions;
    document.getElementById('verMovimientosMeta').setAttribute('data-id_meta', data.id);
}

document.addEventListener('click', e => {

    if(e.target.closest('#cerrarMeta')) cerrarModal();

});