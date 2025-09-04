import Swal from 'sweetalert2';
import { error, loading, success } from '../../helpers/alertas';
import { post } from '../../helpers/api';
import headerHtml from  './header.html?raw';



export const renderHeader = (elememto) => {
    elememto.innerHTML = headerHtml
    
    cargarContenido();
}

function cargarContenido() {

    const nombreCompleto = `${localStorage.getItem('full_name')}`;

    let usernameHeader = document.querySelector('.profile__name');
    let usernameMenu = document.querySelector('.profile-menu__username');
    usernameHeader.textContent = nombreCompleto;
    usernameMenu.textContent = nombreCompleto;
}

async function logout() {

    loading('Cerrando sesión...');

    const response = await post([], 'logout');
    
    if(response.success) {
        Swal.close();
        success(response.message);
        localStorage.clear();
        window.location.href = '#/login';

        return;
    }

    else {
        Swal.close();
        error(response.message);
    }

}

const menuPlegable = () => {

  
  let checkbox = document.querySelector(".menu-plegable__checkbox");
  
  let sidebar = document.querySelector('.sidebar');
  
  if (screen.width > 900) sidebar.style.opacity = 1;

  if (checkbox.checked) {
    sidebar.style.opacity = 1;
    sidebar.style.zIndex = "99";
  }
  
  else {
    sidebar.style.opacity = 0;
    sidebar.style.zIndex = "-1";
  }

}

document.addEventListener('click', async (e) => {

  if (e.target.closest('#logoutUser')) await logout();
  if (e.target.closest('.menu-plegable')) menuPlegable();

})

window.addEventListener('resize', () => {

  let sidebar = document.querySelector('.sidebar');
  
  if (screen.width > 900) {
    sidebar.style.opacity = 1;
    sidebar.style.zIndex = "99";
  }
  else {
    sidebar.style.opacity = 0;
    sidebar.style.zIndex = "-1";
  }

})