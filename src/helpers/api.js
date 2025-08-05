const urlBase = "http://localhost:8080/pruebaApi/api";

export const get = async (endpoint) => {
    let data = await fetch(`${urlBase}/${endpoint}`, {
        method: 'GET',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
        },
    });

    return await data.json();
}

export const post = async (datos, endpoint) => {
    let data = await fetch(`${urlBase}/${endpoint}`, {
        method: 'POST',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(datos)
    });

    console.log(data);
    

    return await data.json();
}

export const put = async (datos, endpoint) => {
  let data = await fetch(`${urlBase}/${endpoint}`, {
        method: 'PUT',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(datos)
    });

    return await data.json();
}

export const patch = async (datos, endpoint) => {
  let data = await fetch(`${urlBase}/${endpoint}`, {
        method: 'PATCH',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(datos)
    });

    return await data.json();
}

export const delet = async (endpoint) => {
  let data = await fetch(`${urlBase}/${endpoint}`, {
        method: 'DELETE',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json'
        }
    });

    return await data.json();
}