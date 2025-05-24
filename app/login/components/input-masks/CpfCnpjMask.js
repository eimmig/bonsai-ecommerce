import { InputMask } from './InputMask.js';

/**
 * Máscara específica para CPF/CNPJ
 * Alterna automaticamente entre o formato de CPF e CNPJ baseado no número de dígitos
 */
export class CpfCnpjMask extends InputMask {
    constructor(elementId) {
        super(elementId, '');
    }

    /**
     * Aplica a máscara apropriada baseada no número de dígitos
     * CPF: 999.999.999-99
     * CNPJ: 99.999.999/9999-99
     */
    applyMask(event) {
        let value = this.inputElement.value.replace(/\D/g, '');
        let maskPattern = value.length <= 11 ? '999.999.999-99' : '99.999.999/9999-99';
        this.maskPattern = maskPattern;
        super.applyMask(event);
    }
}
