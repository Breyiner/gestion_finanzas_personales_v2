export const addClass = (elemento, classElemento) => {
    if (!elemento.classList.contains(classElemento)) elemento.classList.add(classElemento);
}

export const deleteClass = (elemento, classElemento) => {
    elemento.classList.remove(classElemento);
}