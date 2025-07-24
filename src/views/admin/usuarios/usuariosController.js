import modalCrear from  '../../../components/modales/crearUsuario.html?raw';
import modalEditar from  '../../../components/modales/editarUsuario.html?raw';
import { cerrarModal, mostrarModal } from '../../../helpers/modalManagement';

export const usuariosController = () => {
    
}

document.addEventListener('click', async (e) => {

    if (e.target.closest('#crearUsuario')) mostrarModal(modalCrear);
    if (e.target.closest('.editarUsuario')) mostrarModal(modalEditar);


    if (e.target.closest('.modal-exit--usuario')) cerrarModal();
});