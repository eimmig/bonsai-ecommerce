// Classe para internacionalização e tradução
export class I18n {
  constructor(defaultLang = 'pt') {
    this.currentLang = defaultLang;
    this.translations = {};
  }

  async loadTranslations(lang) {
    const res = await fetch(`translations/${lang}.json`);
    this.translations = await res.json();
  }

  async translatePage(lang = this.currentLang) {
    this.currentLang = lang;
    await this.loadTranslations(lang);
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      if (this.translations?.[key]) {
        el.innerHTML = this.translations[key];
      }
    });
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
      const key = el.getAttribute('data-i18n-placeholder');
      if (this.translations?.[key]) {
        el.setAttribute('placeholder', this.translations[key]);
      }
    });
  }

  setLanguage(lang) {
    this.translatePage(lang);
  }

  async loadComponent(id, path) {
    const res = await fetch(path);
    const data = await res.text();
    document.getElementById(id).innerHTML = data;
    await this.translatePage(this.currentLang);
  }
}

// Instância global para uso no index.js
export const i18n = new I18n();
