import { delet, get, put } from '../../helpers/api';
import { cerrarModal, cerrarTodos, mostrarModal } from '../../helpers/modalManagement';
import htmlContent from  './detallesMovimiento.html?raw';
import { validarTexto, validarNumeros, validarCampo, validarCampos, validarMaximo, datos } from '../../helpers/validaciones';
import { error, success } from '../../helpers/alertas';
import { confirmModal } from './modalConfirm';
import { errorModal } from './modalError';

let funcControlador = null;
let usuario_id = null;

export const abrirModalDetallesMov = async (controlador, idMovimiento) => {

  usuario_id = parseInt(localStorage.getItem('usuario_id'));

    funcControlador = controlador;
    // Crear y mostrar el modal
    mostrarModal(htmlContent);
    
    
    // Ahora configurar la funcionalidad
    await configurarModalMovimiento(idMovimiento);
};

async function configurarModalMovimiento(idMovimiento) {

    const formulario = document.getElementById('form-detallesMovimiento');
    const infoMovimiento = await get(`movimientos/${idMovimiento}/usuario/${usuario_id}`);

    const [movimiento] = infoMovimiento.data; 
    console.log(movimiento);

    formEditable(formulario, false);

    await cargarTipos();

    await cargarFormulario(formulario, movimiento);

    configurarValidaciones();

    configurarEventos(formulario, movimiento);
}

async function cargarTipos() {
    const selectTipos = document.getElementById('tiposMovimiento');
    
    const {data} = await get(`tiposMovimiento`);
    
    selectTipos.innerHTML = '<option value="">Seleccione...</option>';
    data.forEach((tipo, i) => {
        if(i != 2)
            selectTipos.innerHTML += `<option value="${tipo.id}">${tipo.nombre}</option>`;
    });


    selectTipos.addEventListener('change', async () => await cargarCategorias(selectTipos.value))
}

async function cargarCategorias(idTipo) {
        
    const selectCategorias = document.getElementById('categoriasMovimiento');
    selectCategorias.innerHTML = "";

    if (!idTipo) return;

    const {data} = await get(`categorias/tipoMovimiento/${idTipo}`);
    
    selectCategorias.innerHTML = '<option value="">Seleccione...</option>';

    data.forEach(tipo => {
        
        selectCategorias.innerHTML += `<option value="${tipo.id}">${tipo.nombre}</option>`;
    });
}


async function cargarFormulario(formulario, data) {
    
    const campos = formulario.querySelectorAll('input, textarea, select');
    await cargarCategorias(data.tipo_movimiento_id);
    campos.forEach(async campo => {
        
        if(campo.getAttribute('name') in data)
            campo.value = data[campo.getAttribute('name')];
        
    });
}

function formEditable(form, editable) {
    
    const campos = form.querySelectorAll('input, textarea, select');

    campos.forEach(campo => campo.disabled = !editable);

}

function configurarValidaciones() {

    let nombre = document.getElementById('nombreMovimiento');
    let monto = document.getElementById('montoMovimiento');
    let descripcion = document.getElementById('descripcionMovimiento');
    const selectTipos = document.getElementById('tiposMovimiento');
    const selectCategorias = document.getElementById('categoriasMovimiento');


    nombre.addEventListener('keydown', (e) => {
        validarMaximo(e, 30);
        validarTexto(e);
    });
    monto.addEventListener('keydown', (e) => {
        validarMaximo(e, 10)
        validarNumeros(e);
    });
    descripcion.addEventListener('keydown', (e) => {
        validarMaximo(e, 50);
    });

    nombre.addEventListener("blur", validarCampo);
    monto.addEventListener("blur", validarCampo);
    selectTipos.addEventListener("blur", validarCampo);
    selectCategorias.addEventListener("blur", validarCampo);

}

function configurarEventos(formulario, movimiento) {
    let modoEdicion = false;
    const estadoOriginal = {...movimiento};
    
    document.getElementById('editarMovimiento').addEventListener('click', async (e) => {
        e.preventDefault();
        const btn = e.target;
        const textoOriginal = btn.textContent;
        
        if (modoEdicion) {

            // Validar y guardar usando tu sistema de validación
            if (validarCampos({ target: formulario })) {
                // Deshabilitar botón mientras guarda
                btn.disabled = true;
                btn.textContent = 'Guardando...';
                
                if (!isSame(estadoOriginal, formulario)) {
                    await actualizarMovimiento(datos, movimiento.id);
                    btn.disabled = false;
                    btn.textContent = textoOriginal;

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
            cambiarBoton(document.getElementById('eliminarMovimiento'), 'Cancelar', 'boton--rojo');
            modoEdicion = true;
        }
    });
    
    // Botón eliminar/cancelar
    document.getElementById('eliminarMovimiento').addEventListener('click', async (e) => {
        e.preventDefault();
        
        if (modoEdicion) {
            cargarFormulario(formulario, estadoOriginal);
            formEditable(formulario, false);
            restaurarBotones();
            modoEdicion = false;
        } else {
            await confirmarEliminacion(movimiento.id);
        }
    });
    
}

function cambiarBoton(btn, texto, clase) {
    btn.textContent = texto;
    btn.className = `boton ${clase}`;
}

function restaurarBotones() {
    cambiarBoton(document.getElementById('editarMovimiento'), 'Editar', 'boton--azul');
    cambiarBoton(document.getElementById('eliminarMovimiento'), 'Eliminar', 'boton--rojo');
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


async function actualizarMovimiento(datos, idMovimiento) {
    console.log('Datos a enviar:', datos);
    
    const response = await put(datos, `movimientos/${idMovimiento}/usuario/${usuario_id}`);
    
    if (response.success) {
        cerrarTodos();

        let confirmacion = await success(response.message);
        
        if(confirmacion.isConfirmed) await funcControlador();

    } else {
        
            if(response.data)  {
                await errorModal(response.data[0]);
                return;
            }
                await errorModal(response.message);

    }
}


async function confirmarEliminacion(idMovimiento) {

    let confirmacion = await confirmModal('¿Desea eliminar el movimiento?');
    
    if (confirmacion) {
        await eliminarMovimiento(idMovimiento);
    }
}


async function eliminarMovimiento(idMovimiento) {
    const response = await delet(`movimientos/soft/${idMovimiento}`);
    
    cerrarTodos();
    
    if (!response.success) {
        
        error(response.message)
        return;
    } 


    let confirmacion = await success(response.message);
            
    if(confirmacion.isConfirmed) await funcControlador();
}
