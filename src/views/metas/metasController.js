import { cerrarModal } from '../../helpers/modalManagement';
import { get } from '../../helpers/api';
import { formatter } from '../../helpers/formateadorPrecio';
import { abrirModalDetallesMeta } from '../../components/modales/detallesMeta';
import { abrirModalNewMeta } from '../../components/modales/crearMeta';
import { abrirModalAportes } from '../../components/modales/verAportesMetas';
import { abrirModalDetallesAporte } from '../../components/modales/detallesAporteMeta';
import { abrirModalNewAporte } from '../../components/modales/registrarAporte';

export const metasController = async () => {
    
    const containerMetas = document.querySelector('.container-metas');
    containerMetas.innerHTML = "";

    let {data} = await get(`metas/resumen/usuario/1`);
    

    await cargarMetas(containerMetas, data);

}

async function cargarMetas(container, data) {

    data.forEach(({id, nombre, fecha_limite, monto, total, mensaje}) => {
        
        const meta = document.createElement('div');
        meta.classList.add('meta');
        meta.setAttribute('data-id', id);
        
        const metaInformacion = document.createElement('div');
        metaInformacion.classList.add('meta__informacion');

        const metaNombre = document.createElement('span');
        metaNombre.classList.add('meta__title');
        metaNombre.textContent = nombre;

        const metaRow = document.createElement('div');
        metaRow.classList.add('meta__row');

        const metaTexto = document.createElement('p');
        metaTexto.classList.add('meta__text');
        metaTexto.textContent = 'Meta:';

        const metaMonto = document.createElement('p');
        metaMonto.classList.add('meta__monto');
        metaMonto.textContent = formatter.format(monto);

        const metaRowStyle = document.createElement('div');
        metaRowStyle.classList.add('meta__row', 'meta__row--flexible');

        const metaLimite = document.createElement('span');
        if(fecha_limite) metaLimite.textContent = `Fecha límite: ${formatearFecha(fecha_limite)}`;
        else metaLimite.textContent = "Meta flexible";

        const metaGrafico = document.createElement('div');
        metaGrafico.classList.add('meta__grafico');

        const metaProgesoInfo = document.createElement('div');
        metaProgesoInfo.classList.add('meta__progreso-info');

        const metaAhorrado = document.createElement('span');
        metaAhorrado.classList.add('meta__ahorrado');
        metaAhorrado.textContent = formatter.format(total);

        const metaPorcentaje = document.createElement('span');
        metaPorcentaje.classList.add('meta__porcentaje');
        let porcentaje = Math.round((total*100)/monto);
        metaPorcentaje.textContent = `${ isNaN(porcentaje) ? 0 : porcentaje }%`;

        const progessBar = document.createElement('progress');
        progessBar.classList.add('meta__progreso');
        progessBar.max = monto;
        progessBar.value = total;

        const metaMensaje = document.createElement('span');
        metaMensaje.classList.add('meta__sugerencia');
        metaMensaje.textContent = mensaje;

        metaRow.append(metaTexto, metaMonto);
        metaRowStyle.append(metaLimite);

        metaProgesoInfo.append(metaAhorrado, metaPorcentaje);
        metaGrafico.append(metaProgesoInfo, progessBar, metaMensaje);

        metaInformacion.append(metaNombre, metaRow, metaRowStyle, metaGrafico);

        meta.append(metaInformacion);

        container.append(meta);
    });

}


function formatearFecha(fechaString) {
    let fecha = new Date(fechaString);
    fecha.setDate(fecha.getDate() + 1);

    const opciones = { year: 'numeric', month: 'short', day: 'numeric' };

    return fecha.toLocaleDateString('es-ES', opciones);
}

async function detallesMeta(meta) {
    
    let idMeta = meta.dataset.id;

    await abrirModalDetallesMeta(idMeta);

}

async function verAportes(btnVerAportes) {
    
    let idMeta = btnVerAportes.dataset.id_meta;

    await abrirModalAportes(idMeta);
}

async function detallesAporte(aporte) {

    let idAporte = aporte.dataset.id;
    let idMeta= aporte.dataset.meta_id;

    await abrirModalDetallesAporte(idAporte, idMeta);
}

async function nuevoAporte(btnNuevoAporte) {

    let idMeta = btnNuevoAporte.dataset.meta_id;
    await abrirModalNewAporte(idMeta)
}

document.addEventListener('click', async (e) => {

    if (e.target.closest('#nuevaMeta')) await abrirModalNewMeta();
    if (e.target.closest('.meta')) await detallesMeta(e.target.closest('.meta'));
    if (e.target.closest('#verAportes')) await verAportes(e.target.closest('#verAportes'));
    if (e.target.closest('.tile--aporte')) await detallesAporte(e.target.closest('.tile--aporte'));
    if (e.target.closest('#nuevoAporte')) await nuevoAporte(e.target.closest('#nuevoAporte'));
    

    if (e.target.closest('.modal-exit--metas')) cerrarModal();
});