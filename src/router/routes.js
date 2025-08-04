import { inicioAdminController } from "../views/admin/inicio/inicioAdminController";
import { usuariosController } from "../views/admin/usuarios/usuariosController";
import { loginController } from "../views/auth/login/loginController";
import { registerController } from "../views/auth/register/registerController";
import { calendarioController } from "../views/calendario/calendarioController";
import { historialController } from "../views/historial/historialController";
import { homeController } from "../views/home/homeController";
import { metasController } from "../views/metas/metasController";
import { perfilController } from "../views/perfil/perfilController";

export const routes = {
     "": {
          path: "auth/login/index.html",
          controller: loginController,
          private: false,
          layout: false,
          admin: false
     },
     login: {
          path: "auth/login/index.html",
          controller: loginController,
          private: false,
          layout: false,
          admin: false
     },
     register: {
          path: "auth/register/index.html",
          controller: registerController,
          private: false,
          layout: false,
          admin: false
     },
     inicio: {
          path: "home/index.html",
          controller: homeController,
          private: true,
          layout: true,
          admin: false
     },
     metas: {
          path: "metas/index.html",
          controller: metasController,
          private: true,
          layout: true,
          admin: false
     },
     calendario: {
          path: "calendario/index.html",
          controller: calendarioController,
          private: true,
          layout: true,
          admin: false
     },
     historial: {
          path: "historial/index.html",
          controller: historialController,
          private: true,
          layout: true,
          admin: false
     },
     perfil: {
          path: "perfil/index.html",
          controller: perfilController,
          private: true,
          layout: true,
          admin: false
     },
     admin: {
          "": {
               path: "admin/inicio/index.html",
               controller: inicioAdminController,
               private: true,
               layout: true,
               admin: true
          },
          inicio: {
               path: "admin/inicio/index.html",
               controller: inicioAdminController,
               private: true,
               layout: true,
               admin: true
          },
          usuarios: {
               path: "admin/usuarios/index.html",
               controller: usuariosController,
               private: true,
               layout: true,
               admin: true
          },
          perfil: {
               path: "perfil/index.html",
               controller: perfilController,
               private: true,
               layout: true,
               admin: true
          }
     }
}