import { get } from '../../../../../helpers/api';
import { cerrarModal, mostrarModal } from '../../../../../helpers/modalManagement';
import htmlContent from  './detallesAporteMeta.html?raw';


export default async (parametros = null) => {

    // Crear y mostrar el modal
    mostrarModal(htmlContent);
    
    const {id} = parametros;
    
    // Ahora configurar la funcionalidad
    await configurarModalAporte(id);
};

async function configurarModalAporte(idMovimiento) {

    const formulario = document.getElementById('form-detallesAporte');

    formEditable(formulario, false);

    const {data} = await get(`goalTransactions/${idMovimiento}`);

    await cargarFormulario(formulario, data);
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
}

document.addEventListener('click', e => {

    if(e.target.closest('#cerrarAporte')) cerrarModal();

});