import { delet, get, put } from '../../helpers/api';
import { cerrarModal, cerrarTodos, mostrarModal } from '../../helpers/modalManagement';
import htmlContent from  './detallesAporteMeta.html?raw';
import { validarTexto, validarNumeros, validarCampo, validarCampos, validarMaximo, datos } from '../../helpers/validaciones';
import { error, success } from '../../helpers/alertas';
import { confirmModal } from './modalConfirm';
import { metasController } from '../../views/metas/metasController';


export const abrirModalDetallesAporte = async (idAporte, idMeta) => {
    // Crear y mostrar el modal
    mostrarModal(htmlContent);
    
    
    // Ahora configurar la funcionalidad
    await configurarModalAporte(idAporte, idMeta);
};

async function configurarModalAporte(idAporte, idMeta) {

    const formulario = document.getElementById('form-detallesAporte');
    const infoAporte = await get(`aportes/${idAporte}`);

    const aporte = infoAporte.data; 

    formEditable(formulario, false);


    await cargarFormulario(formulario, aporte); 

    configurarValidaciones();

    configurarEventos(formulario, aporte);
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



function configurarValidaciones() {

    let monto = document.getElementById('montoAporte');
    let descripcion = document.getElementById('descripcionAporte');


    monto.addEventListener('keydown', (e) => {
        validarMaximo(e, 10)
        validarNumeros(e);
    });
    descripcion.addEventListener('keydown', (e) => {
        validarMaximo(e, 50)
    });

    monto.addEventListener("blur", validarCampo);
    descripcion.addEventListener("blur", validarCampo);

}

function configurarEventos(formulario, aporte) {
    let modoEdicion = false;
    const estadoOriginal = {...aporte};
    
    document.getElementById('editarAporte').addEventListener('click', async (e) => {
        e.preventDefault();
        const btn = e.target;
        
        if (modoEdicion) {

            // Validar y guardar usando tu sistema de validación
            if (validarCampos({ target: formulario })) {
                
                // Deshabilitar botón mientras guarda
                btn.disabled = true;
                btn.textContent = 'Guardando...';
                
                if (!isSame(estadoOriginal, formulario)) {
                    await actualizarAporte(datos, aporte.id, aporte.meta_id);
                }
                
                formEditable(formulario, false);
                restaurarBotones();
                modoEdicion = false;

                btn.disabled = false;
            }
        } else {
            // Activar edición
            formEditable(formulario, true);
            cambiarBoton(btn, 'Guardar', 'boton--verde');
            cambiarBoton(document.getElementById('eliminarAporte'), 'Cancelar', 'boton--rojo');
            modoEdicion = true;
        }
    });
    
    // Botón eliminar/cancelar
    document.getElementById('eliminarAporte').addEventListener('click', async (e) => {
        e.preventDefault();
        
        if (modoEdicion) {
            cargarFormulario(formulario, estadoOriginal);
            formEditable(formulario, false);
            restaurarBotones();
            modoEdicion = false;
        } else {
            await confirmarEliminacion(aporte);
        }
    });
    
}

function cambiarBoton(btn, texto, clase) {
    btn.textContent = texto;
    btn.className = `boton ${clase}`;
}

function restaurarBotones() {
    cambiarBoton(document.getElementById('editarAporte'), 'Editar', 'boton--azul');
    cambiarBoton(document.getElementById('eliminarAporte'), 'Eliminar', 'boton--rojo');
}

function isSame(estadoOriginal, formEditado) {

    const campos = formEditado.querySelectorAll('input, select, textarea');
    let iguales = false;

    let coincidencias = 0;

    campos.forEach(campo => {

        if(campo.value == estadoOriginal[campo.getAttribute('name')]) coincidencias++;
    })

    if(coincidencias == campos.length) iguales = true;

    return iguales;
    
}


async function actualizarAporte(datos, idAporte, idMeta) {
    console.log('Datos a enviar:', datos);
    
    const datosCorregidos = datos;

    delete datosCorregidos.fecha_creacion;

    const response = await put(datosCorregidos, `aportes/${idAporte}/meta/${idMeta}`);
    
    cerrarTodos();
    if (response.success) {

        let confirmacion = await success(response.message);
        
        if(confirmacion.isConfirmed) await metasController();

    } else {
        
        error(response.message);

    }
}


async function confirmarEliminacion(aporte) {

    let confirmacion = await confirmModal('¿Desea eliminar el aporte?');
    
    if (confirmacion) {
        await eliminarAporte(aporte.id, aporte.meta_id);
    }
}


async function eliminarAporte(idAporte, idMeta) {
    const response = await delet(`aportes/soft/${idAporte}`);
    
    cerrarTodos();
    
    if (!response.success) {
        
        error(response.message)
        return;
    } 


    let confirmacion = await success(response.message);
            
    if(confirmacion.isConfirmed) await metasController();
}