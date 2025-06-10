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
  }  translateElement(element) {
    // Traduz textos com suporte a parâmetros
    element.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      if (this.translations?.[key]) {
        let params = {};
        const paramsAttr = el.getAttribute('data-i18n-params');
        if (paramsAttr) {
          try {
            params = JSON.parse(paramsAttr);
          } catch (e) {
            console.error('Invalid data-i18n-params JSON:', paramsAttr);
          }
        }
        el.innerHTML = this.translate(key, params);
      }
    });

    // Traduz placeholders com suporte a parâmetros
    element.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
      const key = el.getAttribute('data-i18n-placeholder');
      if (this.translations?.[key]) {
        let params = {};
        const paramsAttr = el.getAttribute('data-i18n-params');
        if (paramsAttr) {
          try {
            params = JSON.parse(paramsAttr);
          } catch (e) {
            console.error('Invalid data-i18n-params JSON:', paramsAttr);
          }
        }
        el.setAttribute('placeholder', this.translate(key, params));
      }
    });

    // Traduz valores de inputs com suporte a parâmetros
    element.querySelectorAll('[data-i18n-value]').forEach(el => {
      const key = el.getAttribute('data-i18n-value');
      if (this.translations?.[key]) {
        let params = {};
        const paramsAttr = el.getAttribute('data-i18n-params');
        if (paramsAttr) {
          try {
            params = JSON.parse(paramsAttr);
          } catch (e) {
            console.error('Invalid data-i18n-params JSON:', paramsAttr);
          }
        }
        el.value = this.translate(key, params);
      }
    });
  }

  setLanguage(lang) {
    this.translatePage(lang);
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
}