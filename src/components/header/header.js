import headerHtml from  './header.html?raw';



export const renderHeader = (elememto) => {
    elememto.innerHTML = headerHtml
    
    cargarContenido();
}

function cargarContenido() {

    const nombreCompleto = `${localStorage.getItem('nombre')} ${localStorage.getItem('apellido')}`;

    let usernameHeader = document.querySelector('.profile__name');
    let usernameMenu = document.querySelector('.profile-menu__username');
    usernameHeader.textContent = nombreCompleto;
    usernameMenu.textContent = nombreCompleto;
}

function logout() {

    localStorage.clear();
    window.location.href = '#/login';

}

document.addEventListener('click', (e) => {

    if(e.target.closest('#logout')) logout();

})