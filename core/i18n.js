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
  /**
   * Traduz o conteúdo de um elemento e seus descendentes
   * @param {HTMLElement} element - O elemento a ser traduzido
   */
  translateElement(element) {
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

    // Traduz valores de inputs
    element.querySelectorAll('[data-i18n-value]').forEach(el => {
      const key = el.getAttribute('data-i18n-value');
      if (this.translations?.[key]) {
        el.value = this.translations[key];
      }
    });
  }

  /**
   * Traduz uma chave com suporte a parâmetros
   * @param {string} key
   * @param {object} params
   * @returns {string}
   */
  translate(key, params = {}) {
    let text = this.translations?.[key] || key;
    if (params && typeof text === 'string') {
      Object.entries(params).forEach(([k, v]) => {
        text = text.replace(new RegExp(`{${k}}`, 'g'), v);
      });
    }
    return text;
  }

  setLanguage(lang) {
    this.translatePage(lang);
  }
}