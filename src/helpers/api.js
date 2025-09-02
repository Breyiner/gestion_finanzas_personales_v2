import { error } from "./alertas";
import { getCookie } from "./getCookies";
import { cerrarTodos } from "./modalManagement";

const urlBase = "http://localhost:8000/api";


export const get = async (endpoint) => {
    try {
        let response = await fetch(`${urlBase}/${endpoint}`, {
            method: 'GET',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${getCookie('access_token')}`
            },
        });

        if (response.status === 401) {
            await refreshToken();
            response = await fetch(`${urlBase}/${endpoint}`, {
                method: 'GET',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${getCookie('access_token')}`
                },
            });

            if (response.status === 401) {
                cerrarTodos();
                error("Sesión expirada");
                window.location.href = '#/login';
                return null;
            }
        }

        return await response.json();
    } catch (error) {
        console.error('Error en GET:', error);
        return null;
    }
};

export const post = async (datos, endpoint) => {
    try {
        let response = await fetch(`${urlBase}/${endpoint}`, {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${getCookie('access_token')}`
            },
            body: JSON.stringify(datos)
        });

        if (response.status === 401) {
            await refreshToken();
            response = await fetch(`${urlBase}/${endpoint}`, {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${getCookie('access_token')}`
                },
                body: JSON.stringify(datos)
            });

            if (response.status === 401) {
                
                cerrarTodos();
                error("Sesión expirada");
                window.location.href = '#/login';
                return null;
            }
        }

        return await response.json();
    } catch (error) {
        console.error('Error en POST:', error);
        return null;
    }
};

export const put = async (datos, endpoint) => {
    try {
        let response = await fetch(`${urlBase}/${endpoint}`, {
            method: 'PUT',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${getCookie('access_token')}`
            },
            body: JSON.stringify(datos)
        });

        if (response.status === 401) {
            await refreshToken();
            response = await fetch(`${urlBase}/${endpoint}`, {
                method: 'PUT',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${getCookie('access_token')}`
                },
                body: JSON.stringify(datos)
            });

            if (response.status === 401) {
                
                cerrarTodos();
                error("Sesión expirada");
                window.location.href = '#/login';
                return null;
            }
        }

        return await response.json();
    } catch (error) {
        console.error('Error en PUT:', error);
        return null;
    }
};

export const patch = async (datos, endpoint) => {
    try {
        let response = await fetch(`${urlBase}/${endpoint}`, {
            method: 'PATCH',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${getCookie('access_token')}`
            },
            body: JSON.stringify(datos)
        });

        if (response.status === 401) {
            await refreshToken();
            response = await fetch(`${urlBase}/${endpoint}`, {
                method: 'PATCH',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${getCookie('access_token')}`
                },
                body: JSON.stringify(datos)
            });

            if (response.status === 401) {
                
                cerrarTodos();
                error("Sesión expirada");
                window.location.href = '#/login';
                return null;
            }
        }

        return await response.json();
    } catch (error) {
        console.error('Error en PATCH:', error);
        return null;
    }
};

export const delet = async (endpoint) => {
    try {
        let response = await fetch(`${urlBase}/${endpoint}`, {
            method: 'DELETE',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${getCookie('access_token')}`
            }
        });

        if (response.status === 401) {
            await refreshToken();
            response = await fetch(`${urlBase}/${endpoint}`, {
                method: 'DELETE',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${getCookie('access_token')}`
                }
            });

            if (response.status === 401) {
                
                cerrarTodos();
                error("Sesión expirada");
                window.location.href = '#/login';
                return null;
            }
        }

        return await response.json();
    } catch (error) {
        console.error('Error en DELETE:', error);
        return null;
    }
};

export const refreshToken = async () => {
    try {
        await fetch(`${urlBase}/refresh-token`, {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${getCookie('refresh_token')}`
            },
            body: JSON.stringify([])
        });
    } catch (error) {
        console.error('Error al refrescar token:', error);
    }
};