export class I18n {
  constructor() {
    this.currentLang = navigator.language.split('-')[0] || 'en';
    this.translations = {};
  }

  async loadTranslations(lang) {
    const res = await fetch(`translations/${lang}.json`);
    this.translations = await res.json();
  }

  async translatePage(lang = this.currentLang) {
    this.currentLang = lang;
    await this.loadTranslations(lang);
    this.translateElement(document);
  }

  translateElement(element, lang = this.currentLang) {
    // Traduz textos
    element.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      if (this.translations?.[key]) {
        el.innerHTML = this.translations[key];
      }
    });

    // Traduz placeholders
    element.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
      const key = el.getAttribute('data-i18n-placeholder');
      if (this.translations?.[key]) {
        el.setAttribute('placeholder', this.translations[key]);
      }
    });
  }

  setLanguage(lang) {
    this.translatePage(lang);
  }
}