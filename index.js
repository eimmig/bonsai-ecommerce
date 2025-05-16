import { I18n } from './core/i18n.js';

const translateService = new I18n();

window.setLanguage = (lang) => translateService.setLanguage(lang);
window.i18nInstance = translateService;

Promise.all([
  loadComponent("header", "app/header/header.html", false),
  loadComponent("footer", "app/footer/footer.html", false)
]).then(() => translateService.translatePage(translateService.currentLang));

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