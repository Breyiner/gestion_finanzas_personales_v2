import { loginController } from "../views/auth/login/loginController";
import { registerController } from "../views/auth/register/registerController";
import { homeController } from "../views/home/homeController";

export const routes = {
   "": {
        path: "auth/login/index.html",
        controller: loginController,
        private: false,
        layout: false
   },
   login: {
        path: "auth/login/index.html",
        controller: loginController,
        private: false,
        layout: false
   },
   register:{
        path: "auth/register/index.html",
        controller: registerController,
        private: false,
        layout: false
   },
   home:{
        path: "home/index.html",
        controller: homeController,
        private: false,
        layout: true
   }
}