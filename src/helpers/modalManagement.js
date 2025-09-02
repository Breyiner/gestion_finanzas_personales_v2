// const app = document.querySelector('#app');
// let modalesAbiertos = [];

import { getRutaBaseActual } from "../router/router";

// export const mostrarModal = (contenido) => {

//     let ultimo = modalesAbiertos[modalesAbiertos.length - 1];
//     if(ultimo) ultimo.classList.add('invisible');

//     const modalCreado = document.createElement('dialog');
//     modalCreado.classList.add('modal');

//     app.append(modalCreado);

//     modalCreado.innerHTML = contenido;

//     modalesAbiertos.push(modalCreado);
//     modalCreado.showModal();
    
//     requestAnimationFrame(() => modalCreado.classList.add('animationStart'));
// };

// export const cerrarModal = () => {
//     let modalCerrar = modalesAbiertos.pop();
//     modalCerrar.classList.add('animationEnd');
//     setTimeout(() => {
//         modalCerrar.close();
//         app.removeChild(modalCerrar);

//         let ultimo = modalesAbiertos[modalesAbiertos.length - 1];
        
//         if(ultimo) ultimo.classList.remove('invisible');
//     }, 400);
// }

// export const cerrarTodos = () => {
//     let modalCerrar = modalesAbiertos.pop();
//     modalCerrar.classList.add('animationEnd');

//     setTimeout(() => {
//         modalCerrar.close();
//         app.removeChild(modalCerrar);
        
//         modalesAbiertos.forEach(modal => app.removeChild(modal));
//         modalesAbiertos = [];

//     }, 400);
// }
    
const app = document.querySelector('#app');
let modalesAbiertos = [];
let rutasModales = []; // Para guardar las rutas de los modales

export const mostrarModal = (contenido) => {
    const rutaActual = location.hash;
    
    // SIMPLIFICACIÓN: No cachear modales, siempre crear uno nuevo
    // Pero antes cerrar cualquier modal existente para la misma ruta
    const modalExistente = modalesAbiertos.find(modal => modal.dataset.rutaModal === rutaActual);
    if (modalExistente) {
        // Remover modal existente
        const index = modalesAbiertos.indexOf(modalExistente);
        const indexRuta = rutasModales.indexOf(rutaActual);
        
        modalesAbiertos.splice(index, 1);
        if (indexRuta > -1) rutasModales.splice(indexRuta, 1);
        
        modalExistente.close();
        app.removeChild(modalExistente);
    }

    // Ocultar el último modal si existe
    let ultimo = modalesAbiertos[modalesAbiertos.length - 1];
    if(ultimo) ultimo.classList.add('invisible');

    // Siempre crear un nuevo modal
    const modalCreado = document.createElement('dialog');
    modalCreado.classList.add('modal');
    
    // Guardar la ruta actual del modal
    modalCreado.dataset.rutaModal = rutaActual;
    rutasModales.push(rutaActual);

    app.append(modalCreado);
    modalCreado.innerHTML = contenido;

    modalesAbiertos.push(modalCreado);
    modalCreado.showModal();
    
    requestAnimationFrame(() => modalCreado.classList.add('animationStart'));
};

// El resto de las funciones permanecen igual
export const cerrarModal = () => {
    if (modalesAbiertos.length === 0) return;

    let modalCerrar = modalesAbiertos.pop();
    const rutaCerrar = rutasModales.pop();
    
    modalCerrar.classList.add('animationEnd');
    
    setTimeout(() => {
        modalCerrar.close();
        app.removeChild(modalCerrar);

        let ultimo = modalesAbiertos[modalesAbiertos.length - 1];
        
        if(ultimo) {
            ultimo.classList.remove('invisible');
            const rutaModalAnterior = rutasModales[rutasModales.length - 1];
            if (rutaModalAnterior && location.hash !== rutaModalAnterior) {
                history.replaceState(null, '', rutaModalAnterior);
                window.dispatchEvent(new HashChangeEvent('hashchange'));
            }
        } else {
            const rutaBase = getRutaBaseActual();
            if (location.hash !== rutaBase) {
                location.hash = rutaBase;
            }
        }
    }, 400);
};

export const cerrarTodos = () => {
    if (modalesAbiertos.length === 0) return;

    let modalCerrar = modalesAbiertos.pop();
    modalCerrar.classList.add('animationEnd');

    setTimeout(() => {
        modalCerrar.close();
        app.removeChild(modalCerrar);
        
        modalesAbiertos.forEach(modal => {
            modal.close();
            app.removeChild(modal);
        });
        modalesAbiertos = [];
        rutasModales = []; // Limpiar rutas de modales

        // Volver a la ruta base
        const rutaBase = getRutaBaseActual();
        if (location.hash !== rutaBase) {
            location.hash = rutaBase;
        }
    }, 400);
};

// Función para verificar si hay modales abiertos
export const hayModalesAbiertos = () => {
    return modalesAbiertos.length > 0;
};

// Función para obtener el número de modales abiertos
export const contarModalesAbiertos = () => {
    return modalesAbiertos.length;
};

// Función para limpiar modales duplicados o huérfanos
export const limpiarModales = () => {
    const modalesToRemove = [];
    
    modalesAbiertos.forEach((modal, index) => {
        if (!modal.open || !app.contains(modal)) {
            modalesToRemove.push(index);
        }
    });
    
    // Remover en orden inverso para no afectar los índices
    modalesToRemove.reverse().forEach(index => {
        modalesAbiertos.splice(index, 1);
        rutasModales.splice(index, 1);
    });
};