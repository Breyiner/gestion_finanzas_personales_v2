import { cerrarModal, cerrarTodos, mostrarModal } from '../../helpers/modalManagement';
import html from './modalError.html?raw';

export const errorModal = (titulo) => {
    return new Promise((resolve) => {
        mostrarModal(html);
        
        document.querySelector('.modal-error__title').textContent = titulo;

        document.querySelector('#error').addEventListener('click', () => error(resolve));
    });
};


function error(resolve) {
    cerrarModal();
    resolve(true);
};