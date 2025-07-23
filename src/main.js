import { router } from './router/router';
import './styles/style.css'

const layout = document.querySelector("#layout");
const header = document.querySelector("#header");
const sidebar = document.querySelector("#sidebar");
const app = document.querySelector("#app");

window.addEventListener('DOMContentLoaded', async () => {
  router(layout, header, sidebar, app)
});

window.addEventListener('hashchange', async () => {
  router(layout, header, sidebar, app)
})