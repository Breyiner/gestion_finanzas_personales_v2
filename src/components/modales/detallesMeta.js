import { delet, get, put } from '../../helpers/api';
import { cerrarModal, cerrarTodos, mostrarModal } from '../../helpers/modalManagement';
import htmlContent from  './detallesMeta.html?raw';
import { validarTexto, validarNumeros, validarCampo, validarCampos, validarMaximo, datos } from '../../helpers/validaciones';
import { error, success } from '../../helpers/alertas';
import { homeController } from '../../views/home/homeController';
import { confirmModal } from './modalConfirm';
import { metasController } from '../../views/metas/metasController';


let usuario_id = null;

export const abrirModalDetallesMeta = async (idMeta) => {

  usuario_id = localStorage.getItem('usuario_id');

    // Crear y mostrar el modal
    mostrarModal(htmlContent);
    
    
    // Ahora configurar la funcionalidad
    await configurarModalMeta(idMeta);
};

async function configurarModalMeta(idMeta) {

    const formulario = document.getElementById('form-detallesMeta');
    const infoMeta = await get(`metas/${idMeta}/usuario/${usuario_id}/detalles`);

    const meta = infoMeta.data; 
    console.log(meta);

    formEditable(formulario, false);


    await cargarFormulario(formulario, meta);

    configurarValidaciones();

    configurarEventos(formulario, meta);
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
    
    document.querySelector('.cant-aportes').textContent = data.cantidad_aportes;
    document.getElementById('verAportes').setAttribute('data-id_meta', data.id);
}



function configurarValidaciones() {

    let nombre = document.getElementById('nombreMeta');
    let monto = document.getElementById('montoMeta');
    let descripcion = document.getElementById('descripcionMeta');


    nombre.addEventListener('keydown', (e) => {
        validarMaximo(e, 30);
        validarTexto(e);
    });
    monto.addEventListener('keydown', (e) => {
        validarMaximo(e, 10)
        validarNumeros(e);
    });
    descripcion.addEventListener('keydown', (e) => {
        validarMaximo(e, 50)
        validarTexto(e);
    });

    nombre.addEventListener("blur", validarCampo);
    monto.addEventListener("blur", validarCampo);
    descripcion.addEventListener("blur", validarCampo);

}

function configurarEventos(formulario, meta) {
    let modoEdicion = false;
    const estadoOriginal = {...meta};
    
    document.getElementById('editarMeta').addEventListener('click', async (e) => {
        e.preventDefault();
        const btn = e.target;
        
        if (modoEdicion) {

            // Validar y guardar usando tu sistema de validación
            if (validarCampos({ target: formulario })) {
                console.log(datos);
                
                // Deshabilitar botón mientras guarda
                btn.disabled = true;
                btn.textContent = 'Guardando...';
                
                if (!isSame(estadoOriginal, formulario)) {
                    await actualizarMeta(datos, meta.id);
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
            cambiarBoton(document.getElementById('eliminarMeta'), 'Cancelar', 'boton--rojo');
            modoEdicion = true;
        }
    });
    
    // Botón eliminar/cancelar
    document.getElementById('eliminarMeta').addEventListener('click', async (e) => {
        e.preventDefault();
        
        if (modoEdicion) {
            cargarFormulario(formulario, estadoOriginal);
            formEditable(formulario, false);
            restaurarBotones();
            modoEdicion = false;
        } else {
            await confirmarEliminacion(meta.id);
        }
    });
    
}

function cambiarBoton(btn, texto, clase) {
    btn.textContent = texto;
    btn.className = `boton ${clase}`;
}

function restaurarBotones() {
    cambiarBoton(document.getElementById('editarMeta'), 'Editar', 'boton--azul');
    cambiarBoton(document.getElementById('eliminarMeta'), 'Eliminar', 'boton--rojo');
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


async function actualizarMeta(datos, idMeta) {
    console.log('Datos a enviar:', datos);
    
    const datosCorregidos = datos;

    delete datosCorregidos.total;
    delete datosCorregidos.fecha_creacion;
    delete datosCorregidos.estado;
    
    if(!datosCorregidos.fecha_limite) datosCorregidos.fecha_limite = null;
    console.log(datosCorregidos);
    

    const response = await put(datosCorregidos, `metas/${idMeta}/usuario/${usuario_id}`);
    
    cerrarTodos();
    if (response.success) {

        let confirmacion = await success(response.message);
        
        if(confirmacion.isConfirmed) await metasController();

    } else {
        
        error(response.message);

    }
}


async function confirmarEliminacion(idMeta) {

    let confirmacion = await confirmModal('¿Desea eliminar la meta?');
    
    if (confirmacion) {
        await eliminarMeta(idMeta);
    }
}


async function eliminarMeta(idMeta) {
    const response = await delet(`metas/${idMeta}/usuario/${usuario_id}`);
    
    cerrarTodos();
    
    if (!response.success) {
        
        error(response.message)
        return;
    } 


    let confirmacion = await success(response.message);
            
    if(confirmacion.isConfirmed) await metasController();
}
