import { cerrarModal, cerrarTodos, mostrarModal } from '../../helpers/modalManagement';
import html from './modalConfirm.html?raw';

export const confirmModal = (titulo) => {
    return new Promise((resolve) => {
        mostrarModal(html);
        
        document.querySelector('.confirm__title').textContent = titulo;

        document.querySelector('#confirm').addEventListener('click', () => confirm(resolve));
        document.querySelector('#cancel').addEventListener('click', () => cancel(resolve));
    });
};


function confirm(resolve) {
    cerrarTodos();
    resolve(true);
};

function cancel(resolve) {
    cerrarModal();
    resolve(false);
};