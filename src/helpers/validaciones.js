const teclasEspeciales = ["Backspace", "Tab", "Enter", "ArrowLeft", "ArrowRight", "Delete"];

export const validarTexto = (event) => {
  const key = event.key;
  const regex = /^[\D]*$/i;

  if (!regex.test(key) && !teclasEspeciales.includes(key)) { 

    event.preventDefault();
  }
};

export const validarNumeros = (event) => {
    const key = event.key;
    const regex = /^[\d]*$/i;

    if (!regex.test(key) && !teclasEspeciales.includes(key)) { 

        event.preventDefault();
    }
}

export const validarCampo = (event) => {

  let campo = event.target;

  if (((campo.tagName == "INPUT" || campo.tagName == "TEXTAREA") && campo.value.trim() == "") || (campo.tagName == "SELECT" && campo.selectedIndex == 0)) {
    agregarError(campo.parentElement);
    return false;
  }

  if (campo.parentElement.className.includes('error'))
    quitarError(campo.parentElement);

  return true;
};

export const agregarError = (campo, mensaje = "El campo es obligatorio.") => {
  campo.classList.add('error');
  campo.style.setProperty('--error-message', `"${mensaje}"`);
};


export const quitarError = (campo) => {
  campo.classList.remove('error');
};

export const validarMaximo = (event, maximo) => {
  const key = event.key;
  if (!teclasEspeciales.includes(key) && event.target.value.length >= maximo) event.preventDefault(); 
};

export const datos = {};
export const validarCampos = (event) => {

  let valido = true;

  const campos = [...event.target].filter((elemento) => elemento.hasAttribute("required") && (elemento.tagName == "INPUT" || elemento.tagName == "TEXTAREA" || elemento.tagName == "SELECT") || elemento.value);

  campos.forEach((campo) => {
    if (!validarCampo({ target: campo })) valido = false;

    if(!isNaN(campo.value)) 
        datos[campo.getAttribute("name")] = Number(campo.value);
    else 
        datos[campo.getAttribute("name")] = campo.value;
  });

  return valido;
};