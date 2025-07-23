import modalCrear from  '../../components/modales/crearMeta.html?raw';
import modalDetallesMeta from  '../../components/modales/detallesMeta.html?raw';
import modalAportesMeta from  '../../components/modales/verAportesMetas.html?raw';
import modalDetallesAporte from  '../../components/modales/detallesAporteMeta.html?raw';
import { cerrarModal, mostrarModal } from '../../helpers/modalManagement';

export const metasController = () => {
    
}

document.addEventListener('click', async (e) => {

    if (e.target.closest('#nuevaMeta')) mostrarModal(modalCrear);
    if (e.target.closest('.meta')) mostrarModal(modalDetallesMeta);
    if (e.target.closest('.allAportes')) mostrarModal(modalAportesMeta);
    if (e.target.closest('.tile--aporteMeta')) mostrarModal(modalDetallesAporte);


    if (e.target.closest('.modal-exit--metas')) await cerrarModal();
});