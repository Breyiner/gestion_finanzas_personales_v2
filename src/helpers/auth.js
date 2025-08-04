export function isAuth() {

    if(localStorage.getItem('usuario_id')) return true;

    return false;

}

export function isAdmin() {

    const rolesPermitidos = [1];
    
    if(rolesPermitidos.includes(parseInt(localStorage.getItem('rol_id')))) return true;

    return false;

}