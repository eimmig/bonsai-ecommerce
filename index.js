import { I18n } from './core/i18n.js';
import { Header } from './app/header/header.js';
import { initLogin } from './app/login/login.js';
import { initHome } from "./app/home/home.js";
import { initAbout } from "./app/about/about.js";

const translateService = new I18n();
let headerComponent;

window.setLanguage = (lang) => translateService.setLanguage(lang);
window.i18nInstance = translateService;
window.loadComponent = loadComponent;

// Carrega os componentes e inicializa a tradução
Promise.all([
  loadComponent("header", "app/header/header.html", false),
  loadComponent("footer", "app/footer/footer.html", false),
  loadComponent("main", "app/home/home.html", false),
]).then(() => {
  translateService.translatePage(translateService.currentLang);
  headerComponent = new Header();
});

// Carrega um componente HTML e opcionalmente o traduz
async function loadComponent(id, path, translateAfterLoad = true) {
  const res = await fetch(path);
  const data = await res.text();
  document.getElementById(id).innerHTML = data;

  if (translateAfterLoad) {
    const element = document.getElementById(id);
    translateService.translateElement(element, translateService.currentLang);
  }

  if (path === "app/login/login.html") {
    initLogin();
  }

  if (path === "app/home/home.html") {
    initHome();
  }

  if (path === "app/about/about.html") {
    initAbout();
  }
  return data;
}

