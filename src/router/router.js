import { renderHeader } from "../components/header/header";
import { renderHeaderAdmin } from "../components/headerAdmin/headerAdmin";
import { renderSidebar } from "../components/sidebar/sidebar";
import { renderSidebarAdmin } from "../components/sidebarAdmin/sidebarAdmin";
import { addClass, deleteClass } from "../helpers/modifyClass";
import { routes } from "./routes"
// import { isAuth } from "../helpers/auth";

let layoutCargado = false;

export const router = async (layout, header, sidebar, app) => {
    const hash = location.hash.slice(1);

    let arregloHash = hash.split("/");
    const [ruta, parametros] = recorrerRutas(routes, arregloHash);

    if(!ruta) {
        header.innerHTML = "";
        sidebar.innerHTML = "";
        deleteClass(layout, 'layout');
        deleteClass(header, 'header');
        deleteClass(sidebar, 'sidebar');
        deleteClass(app, 'app');
        layoutCargado = false;
        app.innerHTML = `<h2>Ruta no encontrada</h2>`;
        return;
    }

    // if(ruta.private){
    //     location.hash = "#/login";
    //     return;
    // }

    if(ruta.layout && !layoutCargado) {
        addClass(layout, 'layout');
        addClass(header, 'header');
        addClass(sidebar, 'sidebar');
        addClass(app, 'app');
        renderHeader(header);
        renderSidebar(sidebar);
        layoutCargado = true;
    } 
    else if (!ruta.layout){
        header.innerHTML = "";
        sidebar.innerHTML = "";
        deleteClass(layout, 'layout');
        deleteClass(header, 'header');
        deleteClass(sidebar, 'sidebar');
        deleteClass(app, 'app');
        layoutCargado = false;
    }

    if(ruta.admin) {
        renderSidebarAdmin(sidebar);
        renderHeaderAdmin(header);
        layoutCargado = false;
    }

    await cargarVista(ruta.path, app);
    await ruta.controller(parametros);
}

const recorrerRutas = (routes, arregloHash) => {
    
    let parametros = {};

    for (const key in routes) {

        if (arregloHash.length == 4){
            let parametrosSeparados = arregloHash[3].split("&");

            parametrosSeparados.forEach((parametro) => {
                let claveValor = parametro.split("=");
                
                parametros[claveValor[0]] = claveValor[1];
            });
            
            console.log(parametros);
            arregloHash.pop();
        }

        if (arregloHash.length == 1 && arregloHash[0] == "") {
            return [routes[key], parametros];
        }

        if (key == arregloHash[1]) { 
            for(const elemento in routes[key]){
                // console.log(routes[key][arregloHash[2]]);
                
                if(typeof routes[key][elemento] == "object"){
                    
                    return arregloHash.length == 2 ? 
                        [routes[key][elemento], parametros] :
                        [routes[key][arregloHash[2]], parametros];
                }
            }
            return [routes[key], parametros];            
        }
    }
    return null;
}

const cargarVista = async (path, elemento) => {
    console.log(path, elemento);
    const seccion = await fetch(`./src/views/${path}`);
    if (!seccion.ok) throw new Error("No pudimos leer el archivo");
    const html = await seccion.text();
    elemento.innerHTML =  html;
}