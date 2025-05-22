/**
 * Classe base para máscaras de input
 * Fornece funcionalidade básica para aplicar máscaras em campos de texto
 */
export class InputMask {
    /**
     * @param {string} elementId ID do elemento input
     * @param {string} maskPattern Padrão da máscara (ex: '999.999.999-99')
     */
    constructor(elementId, maskPattern) {
        this.inputElement = document.getElementById(elementId);
        this.maskPattern = maskPattern;
        this.init();
    }

    /**
     * Inicializa os event listeners para o input
     */
    init() {
        if (this.inputElement) {
            this.inputElement.addEventListener('input', this.applyMask.bind(this));
            this.inputElement.addEventListener('keydown', this.handleBackspace.bind(this));
            this.inputElement.addEventListener('focus', this.applyMask.bind(this));
        }
    }

    /**
     * Aplica a máscara ao valor do input
     * @param {Event} event Evento do input
     */
    applyMask(event) {
        let value = this.inputElement.value.replace(/\D/g, '');
        let maskedValue = '';
        let patternIndex = 0;
        let valueIndex = 0;

        while (patternIndex < this.maskPattern.length && valueIndex < value.length) {
            const patternChar = this.maskPattern[patternIndex];
            const valueChar = value[valueIndex];

            if (patternChar === '9' || patternChar === '*') {
                maskedValue += valueChar;
                valueIndex++;
            } else {
                maskedValue += patternChar;
                if (valueChar === patternChar) {
                    valueIndex++;
                }
            }
            patternIndex++;
        }
        this.inputElement.value = maskedValue;
    }

    handleBackspace(event) {
        if (event.key === 'Backspace') {
            const value = this.inputElement.value;
            const selectionStart = this.inputElement.selectionStart;

            if (selectionStart > 0 && this.maskPattern[selectionStart - 1] !== '9') {
                event.preventDefault();
                let newValue = value.substring(0, selectionStart - 1) + value.substring(selectionStart);
                this.inputElement.value = newValue;
                this.inputElement.setSelectionRange(selectionStart - 1, selectionStart - 1);
                this.applyMask();
            }
        }
    }
}
