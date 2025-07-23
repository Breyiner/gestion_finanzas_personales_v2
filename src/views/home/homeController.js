import modalCrear from  '../../components/modales/registrarMovimiento.html?raw';
import modalMovimientos from  '../../components/modales/verMovimientos.html?raw';
import modalDetalles from  '../../components/modales/registrarMovimiento.html?raw';
import { cerrarModal, mostrarModal } from '../../helpers/modalManagement';

export const homeController = () => {
    
}

document.addEventListener('click', async (e) => {

    if (e.target.closest('#nuevoMovimiento')) mostrarModal(modalCrear);
    if (e.target.closest('.tile--categoria')) mostrarModal(modalMovimientos);
    if (e.target.closest('.tile--movimiento')) mostrarModal(modalDetalles);


    if (e.target.closest('.modal-exit')) await cerrarModal();
});