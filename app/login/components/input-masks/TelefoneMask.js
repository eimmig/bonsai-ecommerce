import { InputMask } from './InputMask.js';

/**
 * Máscara específica para números de telefone
 * Alterna automaticamente entre formatos de 8 e 9 dígitos
 */
export class TelefoneMask extends InputMask {
    constructor(elementId) {
        super(elementId, '');
    }

    /**
     * Aplica a máscara apropriada baseada no número de dígitos
     * 8 dígitos: (99) 9999-9999
     * 9 dígitos: (99) 99999-9999
     */
    applyMask(event) {
        let value = this.inputElement.value.replace(/\D/g, '');
        this.maskPattern = value.length > 10 ? '(99) 99999-9999' : '(99) 9999-9999';
        super.applyMask(event);
    }
}
