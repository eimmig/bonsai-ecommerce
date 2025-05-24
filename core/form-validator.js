export class FormValidator {
    constructor(form) {
        this.form = form;
        this.fields = {};
        this.errors = new Map();
        this.wasSubmitted = false;
        this._setupFields();
    }

    /**
     * Configura os campos do formulário
     * @private
     */
    _setupFields() {
        const inputs = this.form.querySelectorAll('input[required], input[pattern], input[minlength]');
        inputs.forEach(input => {
            this.fields[input.name] = {
                element: input,
                initialValue: input.value,
                value: input.value,
                valid: true,
                errors: [],
                touched: false
            };

            input.addEventListener('input', () => {
                this.fields[input.name].touched = true;
                this._validateField(input);
            });

            input.addEventListener('blur', () => {
                this.fields[input.name].touched = true;
                this._validateField(input);
            });
        });
    }

    /**
     * Valida um campo específico
     * @param {HTMLInputElement} input Campo a ser validado
     * @private
     */
    _validateField(input) {
        const field = this.fields[input.name];
        field.value = input.value;
        field.errors = [];

        if (!input.value && !input.hasAttribute('required')) {
            field.valid = true;
            this._updateFieldUI(input);
            return;
        }

        if (input.type === 'email' && this.form.classList.contains('register-form')) {
            field.valid = this._validateEmail(input.value);
            if (!field.valid) {
                field.errors.push('error_invalid_email');
            }
        } else {
            field.valid = input.checkValidity();

            if (!field.valid) {
                if (input.validity.valueMissing) {
                    field.errors.push('error_required_field');
                } else if (input.validity.tooShort) {
                    field.errors.push(input.name === 'senha' ? 'error_min_password' : 'error_min_name');
                } else if (input.validity.patternMismatch) {
                    if (input.name === 'cpf_cnpj') {
                        field.errors.push('error_invalid_cpf_cnpj');
                    }
                }
            }
        }

        this._updateFieldUI(input);
    }

    /**
     * Valida um endereço de email
     * @param {string} email Email a ser validado
     * @returns {boolean} true se o email é válido
     * @private
     */
    _validateEmail(email) {
        if (!email) return false;

        if (email.includes('@') && !email.includes('.', email.indexOf('@'))) {
            return true;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    /**
     * Atualiza a UI do campo baseado no estado de validação
     * @param {HTMLInputElement} input Campo a ser atualizado
     * @private
     */
    _updateFieldUI(input) {
        const field = this.fields[input.name];
        const container = input.closest('.auth-input-field');
        const feedback = container.querySelector('.invalid-feedback');

        if (!field.valid && (this.wasSubmitted || field.value)) {
            container.classList.add('is-invalid');
            if (feedback && field.errors.length > 0) {
                feedback.setAttribute('data-i18n', field.errors[0]);
                window.i18nInstance?.translateElement(feedback);
            }
        } else {
            container.classList.remove('is-invalid');
        }
    }

    /**
     * Valida o formulário
     * @returns {boolean} Verdadeiro se o formulário é válido
     */
    validateForm() {
        this.wasSubmitted = true;
        let isValid = true;

        Object.values(this.fields).forEach(field => {
            this._validateField(field.element);
            if (!field.valid) {
                isValid = false;
            }
        });

        return isValid;
    }

    /**
     * Reseta o estado do formulário
     */
    reset() {
        this.wasSubmitted = false;
        this.form.reset();

        Object.values(this.fields).forEach(field => {
            field.element.value = '';
            field.value = '';
            field.valid = true;
            field.errors = [];

            const container = field.element.closest('.auth-input-field');
            container.classList.remove('is-invalid');

            const feedback = container.querySelector('.invalid-feedback');
            if (feedback) {
                feedback.textContent = '';
            }
        });

        this.form.style.display = 'none';
        setTimeout(() => this.form.style.display = '', 0);
    }
}