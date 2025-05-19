import { I18n } from './core/i18n.js';
import Header from './app/header/header.js';

const translateService = new I18n();
let headerComponent;

window.setLanguage = (lang) => translateService.setLanguage(lang);
window.i18nInstance = translateService;

// Carrega os componentes e inicializa a tradução
Promise.all([
  loadComponent("header", "app/header/header.html", false),
  loadComponent("footer", "app/footer/footer.html", false)
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
  return data;
}