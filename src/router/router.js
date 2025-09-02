
import { renderHeader } from "../components/header/header";
import { renderHeaderAdmin } from "../components/headerAdmin/headerAdmin";
import { renderSidebar } from "../components/sidebar/sidebar";
import { renderSidebarAdmin } from "../components/sidebarAdmin/sidebarAdmin";
import { addClass, deleteClass } from "../helpers/modifyClass";
import { routes } from "./routes";
import { isAdmin, isAuth, isAuthorize } from "../helpers/auth";
import { cerrarTodos, limpiarModales, mostrarModal } from "../helpers/modalManagement";
import { renderSidebarSuperAdmin } from "../components/sidebarSuperAdmin/sidebarSuperAdmin";
import { renderHeaderSuperAdmin } from "../components/headerSuperAdmin/headerSuperAdmin";

let layoutCargado = false;
let layoutActual = null;

// Para manejar el historial de rutas sin modales
let rutaBaseActual = null;

export const router = async (layout, header, sidebar, app) => {
    const hash = location.hash.slice(1);
    let arregloHash = hash.split("/");
    const [ruta, parametros] = recorrerRutas(routes, arregloHash);

    console.log(ruta);
    

    if (!ruta) {
        limpiarLayout(layout, header, sidebar, app);
        app.innerHTML = `<h2>Ruta no encontrada</h2>`;
        return;
    }

    // Destructuring de la configuración
    const { private: esPrivada, layout: tieneLayout, permissions, modal } = ruta.config;

    // Verificar autenticación
    if (esPrivada && !isAuth()) {
        location.hash = "#/login";
        return;
    }

    // Verificar permisos específicos
    if (!tienePermisos(permissions)) {
        limpiarLayout(layout, header, sidebar, app);
        app.innerHTML = `<h2>No tienes permisos para acceder a esta sección</h2>`;
        return;
    }

    // *** MANEJO DE MODALES ***
    if (modal) {
        // Guardar la ruta base si aún no tenemos una
        if (!rutaBaseActual) {
            rutaBaseActual = encontrarRutaBase(arregloHash);
        }
        limpiarModales();
        // Ejecutar el controlador
        await ruta.controller(parametros);
        return;
    }

    // *** MANEJO DE RUTAS NORMALES ***
    
    // Si es una ruta normal (no modal), actualizar la ruta base
    rutaBaseActual = hash || "";

    // Determinar tipo de layout basado en permisos
    const tipoLayout = determinarTipoLayout(permissions);

    // Manejar layout
    if (tieneLayout && (!layoutCargado || layoutActual !== tipoLayout)) {
        cargarLayout(layout, header, sidebar, app, tipoLayout);
    } 
    else if (!tieneLayout) {
        limpiarLayout(layout, header, sidebar, app);
    }

    // Cargar vista solo si tiene path
    if (ruta.path) {
        // cerrarTodos();
        await cargarVista(ruta.path, app);
    }
    
    await ruta.controller(parametros);
};

// Función para encontrar la ruta base (sin el modal)
const encontrarRutaBase = (arregloHash) => {
    // Si la ruta es inicio/movimientos, la ruta base es inicio
    if (arregloHash.length >= 2) {
        const rutaBase = arregloHash[0] === "" ? arregloHash[1] : arregloHash[0];
        return `#/${rutaBase}`;
    }
    return "#/";
};

// Función para obtener la ruta base actual (para usar en cerrar modales)
export const getRutaBaseActual = () => {
    return rutaBaseActual || "#/";
};

// Función para determinar el tipo de layout basado en permisos
const determinarTipoLayout = (permissions) => {
    if (permissions.includes('super-admin')) {
        return 'super-admin';
    }
    if (permissions.includes('admin')) {
        return 'admin';
    }
    return 'user';
};

const cargarLayout = (layout, header, sidebar, app, tipoLayout) => {
    addClass(layout, 'layout');
    addClass(header, 'header');
    addClass(sidebar, 'sidebar');
    addClass(app, 'app');
    
    switch (tipoLayout) {
        case 'super-admin':
            renderHeaderSuperAdmin(header);
            renderSidebarSuperAdmin(sidebar);
            break;
        case 'admin':
            renderHeaderAdmin(header);
            renderSidebarAdmin(sidebar);
            break;
        default:
            renderHeader(header);
            renderSidebar(sidebar);
    }
    
    layoutCargado = true;
    layoutActual = tipoLayout;
};

const limpiarLayout = (layout, header, sidebar, app) => {
    header.innerHTML = "";
    sidebar.innerHTML = "";
    deleteClass(layout, 'layout');
    deleteClass(header, 'header');
    deleteClass(sidebar, 'sidebar');
    deleteClass(app, 'app');
    layoutCargado = false;
    layoutActual = null;
};

const recorrerRutas = (routes, arregloHash, esLlamadaRecursiva = false) => {
    let parametros = {};

    // Procesar parámetros solo en la primera llamada
    if (!esLlamadaRecursiva && arregloHash.length > 0) {
        const ultimoElemento = arregloHash[arregloHash.length - 1];
        
        // Verificar si el último elemento contiene parámetros (tiene =)
        if (ultimoElemento && ultimoElemento.includes("=")) {
            let parametrosSeparados = ultimoElemento.split("&");

            parametrosSeparados.forEach((parametro) => {
                let claveValor = parametro.split("=");
                parametros[claveValor[0]] = claveValor[1];
            });
            
            console.log("Parámetros procesados:", parametros);
            arregloHash = [...arregloHash]; // Crear copia para no mutar el original
            arregloHash.pop(); // Remover los parámetros del array
            console.log("Array después de quitar parámetros:", arregloHash);
        }
    }

    // Ruta raíz vacía (#/ o #)
    if ((arregloHash.length == 1 && arregloHash[0] == "") || 
        (arregloHash.length == 2 && arregloHash[0] == "" && arregloHash[1] == "") ||
        arregloHash.length == 0) {
        return [routes[""], parametros];
    }

    // Obtener la ruta real (ignorando el primer elemento vacío si existe)
    const rutaActual = arregloHash[0] === "" ? arregloHash[1] : arregloHash[0];
    const resto = arregloHash[0] === "" ? arregloHash.slice(2) : arregloHash.slice(1);

    console.log("Buscando ruta:", rutaActual, "resto:", resto);

    // Buscar ruta
    for (const key in routes) {
        if (key == rutaActual) { 
            console.log("Encontré la clave:", key, "tipo:", typeof routes[key]);
            // Si es una ruta con sub-rutas (contenedor)
            if (typeof routes[key] === "object" && !routes[key].path && !routes[key].controller) {
                console.log("Es un contenedor, llamando recursivamente");
                // Llamada recursiva con el resto de segmentos
                const [rutaRecursiva, parametrosRecursivos] = recorrerRutas(routes[key], resto, true);
                // Combinar parámetros de ambas llamadas
                return [rutaRecursiva, { ...parametros, ...parametrosRecursivos }];
            }
            // Ruta final encontrada
            console.log("Ruta final encontrada");
            return [routes[key], parametros];            
        }
    }
    console.log("No se encontró la ruta");
    return [null, parametros];
};


// Función para verificar permisos específicos
const tienePermisos = (permisosRequeridos) => {
    if (!permisosRequeridos || permisosRequeridos.length === 0) {
        return true; // Ruta pública
    }
    
    // Si es un solo permiso, verificarlo directamente
    if (permisosRequeridos.length === 1) {
        return isAuthorize(permisosRequeridos[0]);
    }
    
    // Si son múltiples permisos, verificar que tenga todos
    return permisosRequeridos.every(permiso => isAuthorize(permiso));
};

const cargarVista = async (path, elemento) => {
    console.log(path, elemento);
    const seccion = await fetch(`./src/views/${path}`);
    if (!seccion.ok) throw new Error("No pudimos leer el archivo");
    const html = await seccion.text();
    elemento.innerHTML = html;
};