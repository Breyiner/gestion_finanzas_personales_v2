import { animateValue } from "../../../helpers/animacionValores";
import { get } from "../../../helpers/api"
import { isAuthorize } from "../../../helpers/auth";

export const inicioAdminController = async () => {

    // Cantidad de Usuarios
    if(isAuthorize('users.index')){
        let countUsersHTML = document.querySelector('.admin-info-card__valor--usuarios');
        let countUsers = (await get('users/count')).data;
        
    
        animateValue(countUsersHTML, countUsers, false);
    }
    
    if(isAuthorize('transactions.index')){
        // Cantidad de Movimientos
        let countMovsHTML = document.querySelector('.admin-info-card__valor--movimientos');
        let countMovs = (await get('transactions/count')).data;
        animateValue(countMovsHTML, countMovs, false);
    }

    
    if(isAuthorize('goals.index')){
        // Cantidad de Metas
        let countMetasHTML = document.querySelector('.admin-info-card__valor--metas');
        let countMetas = (await get('goals/count')).data;

        animateValue(countMetasHTML, countMetas, false);
    }
    
    if(isAuthorize('goal-transactions.index')){
        // Cantidad de Aportes
        let countAportesHTML = document.querySelector('.admin-info-card__valor--aportes');
        let countTransGoal = (await get('goalTransactions/count')).data;

        animateValue(countAportesHTML, countTransGoal, false);
    }

}

