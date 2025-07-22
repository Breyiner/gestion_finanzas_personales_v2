import { router } from './router/router';
import './styles/style.css'

const header = document.querySelector("#header");
const app = document.querySelector("#app");

window.addEventListener('DOMContentLoaded', async () => {
  router(header, sidebar, app)
});

window.addEventListener('hashchange', async () => {
  router(header, sidebar, app)
})