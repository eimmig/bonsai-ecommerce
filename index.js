import { I18n } from './core/i18n.js';

const translateService = new I18n();

window.setLanguage = (lang) => translateService.setLanguage(lang);
window.i18nInstance = translateService;

Promise.all([
  translateService.loadComponent("header", "app/header/header.html"),
  translateService.loadComponent("footer", "app/footer/footer.html")
]).then(() => translateService.translatePage(translateService.currentLang));