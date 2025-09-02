// Importar los controladores de las vistas
import { inicioAdminController } from "../views/admin/inicio/inicioAdminController";
import { usuariosController } from "../views/admin/usuarios/usuariosController";
import { loginController } from "../views/auth/login/loginController";
import { registerController } from "../views/auth/register/registerController";
import { calendarioController } from "../views/calendario/calendarioController";
import { historialController } from "../views/historial/historialController";
import { homeController } from "../views/home/homeController";
import { metasController } from "../views/metas/metasController";
import { perfilController } from "../views/perfil/perfilController";
import movimientos from "../views/home/movimientos/movimientosModal";
import movimiento from "../views/home/movimientos/movimiento/detallesMovimiento";
import crearMovimiento from "../views/home/movimientos/movimiento/crear/registrarMovimiento";
import detallesMeta from "../views/metas/meta/detallesMeta";
import movimientosMeta from "../views/metas/meta/movimientos/verAportesMetas";
import movimientoMeta from "../views/metas/meta/movimientos/movimiento/detallesAporteMeta";
import crearMovimientoMeta from "../views/metas/meta/movimientos/movimiento/crear/registrarAporte";
import crearMeta from "../views/metas/crear/crearMeta";
import movimientosCalendario from "../views/calendario/movimientos/movimientosModal";
import movimientoCalendario from "../views/calendario/movimientos/movimiento/detallesMovimiento";
import crearMovimientoCalendar from "../views/calendario/movimientos/crear/registrarMovimiento";
import createUsers from "../views/admin/usuarios/crear/crearUsuarios";
import updateUser from "../views/admin/usuarios/editar/editarUsuario";
import { usuariosController as usuariosSupAdminController } from "../views/superAdmin/usuarios/usuariosController";
import {ciudadesController} from "../views/superAdmin/ciudades/ciudadesController";
import createCiudad from "../views/superAdmin/ciudades/crear/crearCiudad";
import updateCiudad from "../views/superAdmin/ciudades/editar/editarCiudad";
import {generosController} from "../views/superAdmin/generos/generosController";
import createGenero from "../views/superAdmin/generos/crear/crearGenero";
import updateGenero from "../views/superAdmin/generos/editar/editarGenero";
import { coloresController } from "../views/superAdmin/colores/coloresController";
import createColor from "../views/superAdmin/colores/crear/crearColor";
import updateColor from "../views/superAdmin/colores/editar/editarColor";
import { estadosController } from "../views/superAdmin/estados/estadosController";
import createEstado from "../views/superAdmin/estados/crear/crearEstado";
import updateEstado from "../views/superAdmin/estados/editar/editarEstado";
import createEstadoMeta from "../views/superAdmin/estadosMetas/crear/crearEstadoMeta";
import editarEstadoMeta from "../views/superAdmin/estadosMetas/editar/editarEstadoMeta";
import {goalStatusesController} from "../views/superAdmin/estadosMetas/estadosMetasController";
import {tiposMovimientosController} from "../views/superAdmin/tiposMovimientos/tiposMovimientosController";
import createTipomovimiento from "../views/superAdmin/tiposMovimientos/crear/crearTipoMovimiento";
import editarTipomovimiento from "../views/superAdmin/tiposMovimientos/editar/editarTipoMovimiento";
import { tiposMovimientosMetaController } from "../views/superAdmin/tiposMovimientosMetas/tiposMovimientosMetasController";
import createTipoMovimientoMeta from "../views/superAdmin/tiposMovimientosMetas/crear/crearTipoMovimientoMeta";
import editarTipoMovimientoMeta from "../views/superAdmin/tiposMovimientosMetas/editar/editarTipoMovimientoMeta";
import { categoriasController } from "../views/superAdmin/categorias/categoriasController";
import createCategoria from "../views/superAdmin/categorias/crear/crearCategoria";
import editarCategoria from "../views/superAdmin/categorias/editar/editarCategoria";
import { rolesController } from "../views/superAdmin/roles/rolesController";
import createRole from "../views/superAdmin/roles/crear/crearRole";
import updateRole from "../views/superAdmin/roles/editar/editarRole";
import { permissionsController } from "../views/superAdmin/permisos/permisosController";
import createPermiso from "../views/superAdmin/permisos/crear/crearPermiso";
import updatePermiso from "../views/superAdmin/permisos/editar/editarPermiso";


// Configuraciones predefinidas
const publicRoute = { private: false, layout: false, permissions: [], modal: false };
const userRoute = { private: true, layout: true, permissions: ['user'], modal: false };
const adminRoute = { private: true, layout: true, permissions: ['admin'], modal: false };
const superAdminRoute = { private: true, layout: true, permissions: ['super-admin'], modal: false };

// Configuraciones para modales
const userModal = { private: true, layout: false, permissions: ['user'], modal: true };
const adminModal = { private: true, layout: false, permissions: ['admin'], modal: true };
const superAdminModal = { private: true, layout: false, permissions: ['super-admin'], modal: true };

export const routes = {
     "": {
          path: "auth/login/index.html",
          controller: loginController,
          config: publicRoute
     },
     login: {
          path: "auth/login/index.html",
          controller: loginController,
          config: publicRoute
     },
     register: {
          path: "auth/register/index.html",
          controller: registerController,
          config: publicRoute
     },
     inicio: {
          "": {
               path: "home/index.html",
               controller: homeController,
               config: { ...userRoute, permissions: [...userRoute.permissions, 'home.access'] }
          },
          movimientos: {
               "": {
                    // Sin path porque el contenido se genera en el controlador
                    controller: movimientos,
                    config: { ...userModal, permissions: [...userModal.permissions, 'home.access'] }
               },
               movimiento: {
                    "": {
                         // Sin path porque el contenido se genera en el controlador
                         controller: movimiento,
                         config: { ...userModal, permissions: [...userModal.permissions, 'home.access'] }
                    },
                    crear: {
                         // Sin path porque el contenido se genera en el controlador
                         controller: crearMovimiento,
                         config: { ...userModal, permissions: [...userModal.permissions, 'home.access'] }
                    }
                    
               }
          }
     },
     metas: {
          "": {
               path: "metas/index.html",
               controller: metasController,
               config: { ...userRoute, permissions: [...userRoute.permissions, 'goals.access'] }
          },
          meta: {
               "": {
                    // Sin path porque el contenido se genera en el controlador
                    controller: detallesMeta,
                    config: { ...userModal, permissions: [...userModal.permissions, 'goals.access'] }
               },
               movimientos: {
                    "": {
                         // Sin path porque el contenido se genera en el controlador
                         controller: movimientosMeta,
                         config: { ...userModal, permissions: [...userModal.permissions, 'goals.access'] }
                    },
                    movimiento: {
                         "": {
                              // Sin path porque el contenido se genera en el controlador
                              controller: movimientoMeta,
                              config: { ...userModal, permissions: [...userModal.permissions, 'goals.access'] }
                         },
                         crear: {
                              // Sin path porque el contenido se genera en el controlador
                              controller: crearMovimientoMeta,
                              config: { ...userModal, permissions: [...userModal.permissions, 'goals.access'] }
                         }
                         
                    }
               }
          },
          crear: { 
               // Sin path porque el contenido se genera en el controlador
               controller: crearMeta,
               config: { ...userModal, permissions: [...userModal.permissions, 'goals.access'] }
          }
     },
     calendario: {
          "": {
               path: "calendario/index.html",
               controller: calendarioController,
               config: { ...userRoute, permissions: [...userRoute.permissions, 'calendar.access'] }
          },
          movimientos: {
               "": {
                    // Sin path porque el contenido se genera en el controlador
                    controller: movimientosCalendario,
                    config: { ...userModal, permissions: [...userModal.permissions, 'calendar.access'] }
               },
               movimiento: {
                    // Sin path porque el contenido se genera en el controlador
                    controller: movimientoCalendario,
                    config: { ...userModal, permissions: [...userModal.permissions, 'calendar.access'] } 
               },
               crear: {
                    // Sin path porque el contenido se genera en el controlador
                    controller: crearMovimientoCalendar,
                    config: { ...userModal, permissions: [...userModal.permissions, 'calendar.access'] }
               }
          }
     },
     historial: {
          path: "historial/index.html",
          controller: historialController,
          config: { ...userRoute, permissions: [...userRoute.permissions, 'history.access'] }
     },
     perfil: {
          path: "perfil/index.html",
          controller: perfilController,
          config: { ...userRoute, permissions: [...userRoute.permissions, 'profile.access'] }
     },
     admin: {
          "": {
               path: "admin/inicio/index.html",
               controller: inicioAdminController,
               config: { ...adminRoute, permissions: [...adminRoute.permissions, 'admin.access'] }
          },
          inicio: {
               path: "admin/inicio/index.html",
               controller: inicioAdminController,
               config: { ...adminRoute, permissions: [...adminRoute.permissions, 'admin.access'] }
          },
          usuarios: {
               "": {
                    path: "admin/usuarios/index.html",
                    controller: usuariosController,
                    config: { ...adminRoute, permissions: [...adminRoute.permissions, 'users.access'] }
               },
               crear: {

                    controller: createUsers,
                    config: { ...adminModal, permissions: [...adminModal.permissions, 'users.access'] }
               },
               editar: {

                    controller: updateUser,
                    config: { ...adminModal, permissions: [...adminModal.permissions, 'users.access'] }
               }
          },
          perfil: {
               path: "perfil/index.html",
               controller: perfilController,
               config: { ...adminRoute, permissions: [...adminRoute.permissions, 'profile.access'] }
          }
     },
     super_admin: {
          "": {
               path: "admin/inicio/index.html",
               controller: inicioAdminController,
               config: { ...superAdminRoute, permissions: [...superAdminRoute.permissions, 'super-admin.access'] }
          },
          inicio: {
               path: "admin/inicio/index.html",
               controller: inicioAdminController,
               config: { ...superAdminRoute, permissions: [...superAdminRoute.permissions, 'super-admin.access'] }
          },
          usuarios: {
               "": {
                    path: "superAdmin/usuarios/index.html",
                    controller: usuariosSupAdminController,
                    config: { ...superAdminRoute, permissions: [...superAdminRoute.permissions, 'users.access'] }
               },
               crear: {

                    controller: createUsers,
                    config: { ...superAdminModal, permissions: [...superAdminModal.permissions, 'users.access'] }
               },
               editar: {

                    controller: updateUser,
                    config: { ...superAdminModal, permissions: [...superAdminModal.permissions, 'users.access'] }
               }
          },
          ciudades: {
               "": {
                    path: "superAdmin/ciudades/index.html",
                    controller: ciudadesController,
                    config: { ...superAdminRoute, permissions: [...superAdminRoute.permissions, 'cities.access'] }
               },
               crear: {
                    controller: createCiudad,
                    config: { ...superAdminModal, permissions: [...superAdminModal.permissions, 'cities.access'] }
               },
               editar: {
                    controller: updateCiudad,
                    config: { ...superAdminModal, permissions: [...superAdminModal.permissions, 'cities.access'] }
               }
          },
          generos: {
               "": {
                    path: "superAdmin/generos/index.html",
                    controller: generosController,
                    config: { ...superAdminRoute, permissions: [...superAdminRoute.permissions, 'genders.access'] }
               },
               crear: {
                    controller: createGenero,
                    config: { ...superAdminModal, permissions: [...superAdminModal.permissions, 'genders.access'] }
               },
               editar: {
                    controller: updateGenero,
                    config: { ...superAdminModal, permissions: [...superAdminModal.permissions, 'genders.access'] }
               }
          },
          colores: {
               "": {
                    path: "superAdmin/colores/index.html",
                    controller: coloresController,
                    config: { ...superAdminRoute, permissions: [...superAdminRoute.permissions, 'colors.access'] }
               },
               crear: {
                    controller: createColor,
                    config: { ...superAdminModal, permissions: [...superAdminModal.permissions, 'colors.access'] }
               },
               editar: {
                    controller: updateColor,
                    config: { ...superAdminModal, permissions: [...superAdminModal.permissions, 'colors.access'] }
               }
          },
          estados: {
               "": {
                    path: "superAdmin/estados/index.html",
                    controller: estadosController,
                    config: { ...superAdminRoute, permissions: [...superAdminRoute.permissions, 'statuses.access'] }
               },
               crear: {
                    controller: createEstado,
                    config: { ...superAdminModal, permissions: [...superAdminModal.permissions, 'statuses.access'] }
               },
               editar: {
                    controller: updateEstado,
                    config: { ...superAdminModal, permissions: [...superAdminModal.permissions, 'statuses.access'] }
               }
          },
          estados_metas: {
               "": {
                    path: "superAdmin/estadosMetas/index.html",
                    controller: goalStatusesController,
                    config: { ...superAdminRoute, permissions: [...superAdminRoute.permissions, 'goal-statuses.access'] }
               },
               crear: {
                    controller: createEstadoMeta,
                    config: { ...superAdminModal, permissions: [...superAdminModal.permissions, 'goal-statuses.access'] }
               },
               editar: {
                    controller: editarEstadoMeta,
                    config: { ...superAdminModal, permissions: [...superAdminModal.permissions, 'goal-statuses.access'] }
               }
          },
          tipos_movimientos: {
               "": {
                    path: "superAdmin/tiposMovimientos/index.html",
                    controller: tiposMovimientosController,
                    config: { ...superAdminRoute, permissions: [...superAdminRoute.permissions, 'transaction-types.access'] }
               },
               crear: {
                    controller: createTipomovimiento,
                    config: { ...superAdminModal, permissions: [...superAdminModal.permissions, 'transaction-types.access'] }
               },
               editar: {
                    controller: editarTipomovimiento,
                    config: { ...superAdminModal, permissions: [...superAdminModal.permissions, 'transaction-types.access'] }
               }
          },
          tipos_movimientos_meta: {
               "": {
                    path: "superAdmin/tiposMovimientosMetas/index.html",
                    controller: tiposMovimientosMetaController,
                    config: { ...superAdminRoute, permissions: [...superAdminRoute.permissions, 'goal-transaction-types.access'] }
               },
               crear: {
                    controller: createTipoMovimientoMeta,
                    config: { ...superAdminModal, permissions: [...superAdminModal.permissions, 'goal-transaction-types.access'] }
               },
               editar: {
                    controller: editarTipoMovimientoMeta,
                    config: { ...superAdminModal, permissions: [...superAdminModal.permissions, 'goal-transaction-types.access'] }
               }
          },
          categorias: {
               "": {
                    path: "superAdmin/categorias/index.html",
                    controller: categoriasController,
                    config: { ...superAdminRoute, permissions: [...superAdminRoute.permissions, 'transaction-categories.access'] }
               },
               crear: {
                    controller: createCategoria,
                    config: { ...superAdminModal, permissions: [...superAdminModal.permissions, 'transaction-categories.access'] }
               },
               editar: {
                    controller: editarCategoria,
                    config: { ...superAdminModal, permissions: [...superAdminModal.permissions, 'transaction-categories.access'] }
               }
          },
          roles: {
               "": {
                    path: "superAdmin/roles/index.html",
                    controller: rolesController,
                    config: { ...superAdminRoute, permissions: [...superAdminRoute.permissions, 'roles.access'] }
               },
               crear: {
                    controller: createRole,
                    config: { ...superAdminModal, permissions: [...superAdminModal.permissions, 'roles.access'] }
               },
               editar: {
                    controller: updateRole,
                    config: { ...superAdminModal, permissions: [...superAdminModal.permissions, 'roles.access'] }
               }
          },
          permisos: {
               "": {
                    path: "superAdmin/permisos/index.html",
                    controller: permissionsController,
                    config: { ...superAdminRoute, permissions: [...superAdminRoute.permissions, 'permissions.access'] }
               },
               crear: {
                    controller: createPermiso,
                    config: { ...superAdminModal, permissions: [...superAdminModal.permissions, 'permissions.access'] }
               },
               editar: {
                    "": {
                         controller: updatePermiso,
                         config: { ...superAdminModal, permissions: [...superAdminModal.permissions, 'permissions.access'] }
                    }
               }
          },
          perfil: {
               path: "perfil/index.html",
               controller: perfilController,
               config: { ...superAdminRoute, permissions: [...superAdminRoute.permissions, 'profile.access'] }
          }
     }
};