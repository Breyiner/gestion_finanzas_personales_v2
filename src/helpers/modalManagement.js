const app = document.querySelector('#app');
const modalesAbiertos = [];

export const mostrarModal = (contenido) => {

    let ultimo = modalesAbiertos[modalesAbiertos.length - 1];
    if(ultimo) ultimo.classList.add('invisible');

    const modalCreado = document.createElement('dialog');
    modalCreado.classList.add('modal');

    app.append(modalCreado);

    modalCreado.innerHTML = contenido;

    modalesAbiertos.push(modalCreado);
    modalCreado.showModal();
    
    requestAnimationFrame(() => modalCreado.classList.add('animationStart'));
};

export const cerrarModal = () => {
    let modalCerrar = modalesAbiertos.pop();
    modalCerrar.classList.add('animationEnd');
    setTimeout(() => {
        modalCerrar.close();
        app.removeChild(modalCerrar);

        let ultimo = modalesAbiertos[modalesAbiertos.length - 1];
        
        if(ultimo) ultimo.classList.remove('invisible');
    }, 400);
}