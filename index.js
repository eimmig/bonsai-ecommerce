import { i18n } from './core/i18n.js';

window.setLanguage = (lang) => i18n.setLanguage(lang);
window.i18nInstance = i18n;

Promise.all([
  i18n.loadComponent("header", "app/header/header.html"),
  i18n.loadComponent("footer", "app/footer/footer.html")
]).then(() => i18n.translatePage(i18n.currentLang));