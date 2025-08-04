import { animateValue } from "../../../helpers/animacionValores";
import { get } from "../../../helpers/api"

export const inicioAdminController = async () => {

    // Cantidad de Usuarios
    let countUsersHTML = document.querySelector('.admin-info-card__valor--usuarios');
    let countUsers = (await get('usuarios/cantidad')).data;

    animateValue(countUsersHTML, countUsers.cantidad, false);
    

    // Cantidad de Movimientos
    let countMovsHTML = document.querySelector('.admin-info-card__valor--movimientos');
    let countMovs = (await get('movimientos/cantidad')).data;

    animateValue(countMovsHTML, countMovs.cantidad, false);
    

    // Cantidad de Metas
    let countMetasHTML = document.querySelector('.admin-info-card__valor--metas');
    let countMetas = (await get('metas/cantidad')).data;

    animateValue(countMetasHTML, countMetas.cantidad, false);
    

    // Cantidad de Aportes
    let countAportesHTML = document.querySelector('.admin-info-card__valor--aportes');
    let countAportes = (await get('aportes/cantidad')).data;

    animateValue(countAportesHTML, countAportes.cantidad, false);
    

}

