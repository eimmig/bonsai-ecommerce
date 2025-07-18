import { AuthService } from '../services/AuthService.js';
import { CpfCnpjMask } from '../components/input-masks/CpfCnpjMask.js';
import { TelefoneMask } from '../components/input-masks/TelefoneMask.js';
import { NotificationService } from '../../../core/notifications.js';
import { FormValidator } from '../../../core/form-validator.js';

export class AuthenticationPageManager {
    /**
     * Inicializa o gerenciador de autenticação
     * @returns {AuthenticationPageManager} - Instância do gerenciador
     */
    init() {
        this._setupUIElements();
        this._cacheFormElements();
        this._cacheInputElements();
        this._initializeFormValidation();
        this._setupEventListeners();
        this._initInputMasks();
        this._checkInitialMode();
        document.title = 'Entrar | Bonsai E-commerce';
        return this;
    }

    _setupUIElements() {
        document.getElementById('header').classList.add('d-none');
        document.getElementById('footer').classList.add('d-none');
        document.getElementById('main').style.marginTop = '0';
        this.container = document.querySelector('.auth-container');
        this.isSignUpMode = false;
    }

    _cacheFormElements() {
        this.loginForm = document.getElementById('login-form');
        this.signupForm = document.getElementById('signup-form');
        this.signUpToggleBtn = document.getElementById('signup-toggle-btn');
        this.loginToggleBtn = document.getElementById('login-toggle-btn');
    }

    _cacheInputElements() {
        this.loginEmailInput = document.getElementById('login-email');
        this.loginPasswordInput = document.getElementById('login-senha');
        this.signupNameInput = document.getElementById('signup-nome');
        this.signupCpfCnpjInput = document.getElementById('signup-cpf-cnpj');
        this.signupPhoneInput = document.getElementById('signup-telefone');
        this.signupEmailInput = document.getElementById('signup-email');
        this.signupPasswordInput = document.getElementById('signup-senha');
    }

    _initializeFormValidation() {
        this.loginForm.setAttribute('novalidate', '');
        this.signupForm.setAttribute('novalidate', '');
        this.loginValidator = new FormValidator(this.loginForm);
        this.signupValidator = new FormValidator(this.signupForm);
    }

    _setupEventListeners() {
        this.signUpToggleBtn.addEventListener('click', this.toggleMode.bind(this));
        this.loginToggleBtn.addEventListener('click', this.toggleMode.bind(this));
        this.loginForm.addEventListener('submit', this.handleLoginSubmit.bind(this));
        this.signupForm.addEventListener('submit', this.handleSignupSubmit.bind(this));

        const btn1 = document.getElementById('back-to-home-btn');
        const btn2 = document.getElementById('back-to-home-btn-2');
        [btn1, btn2].forEach(btn => {
            if (btn) {
                btn.addEventListener('click', () => {
                    this._showMainUI();
                    window.loadComponent('main', 'app/home/home.html', true);
                });
            }
        });
    }

    _initInputMasks() {
        this.cpfCnpjMask = new CpfCnpjMask('signup-cpf-cnpj');
        this.telefoneMask = new TelefoneMask('signup-telefone');
    }

    _checkInitialMode() {
        this.isSignUpMode = false;
        this.toggleMode();
    }

    /**
     * Alterna entre os modos de login e cadastro, alterando a classe do container.
     */
    toggleMode() {
        this.isSignUpMode = !this.isSignUpMode;
        this.container.classList.toggle('sign-up-mode', this.isSignUpMode);
    }

    /**
     * Lida com o envio do formulário de login, faz validação, autentica e exibe mensagens.
     * @param {Event} event Evento de submit do formulário
     */
    async handleLoginSubmit(event) {
        event.preventDefault();
        if (!this.loginValidator.validateForm()) return;
        const formData = {
            email: this.loginEmailInput.value,
            senha: this.loginPasswordInput.value,
        };
        try {
            const result = await AuthService.login(formData);
            document.body.classList.add('is-logged-in');
            NotificationService.showToast(
                window.i18nInstance?.translate('toast_login_success_title') || 'Sucesso',
                window.i18nInstance?.translate('toast_login_success_message') || 'Login realizado com sucesso!',
                'success'
            );
            this.loginValidator.reset();
            this._showMainUI();
            document.dispatchEvent(new CustomEvent('user-logged-in', { detail: { user: result.user } }));
            document.dispatchEvent(new CustomEvent('cart-updated'));
            window.headerComponent?.headerCartManager?._updateCartCount();
            window.loadComponent('main', 'app/home/home.html', true);
        } catch (error) {
            NotificationService.showToast(
                window.i18nInstance?.translate('toast_error_title') || 'Erro',
                error.message,
                'error'
            );
            this.loginValidator.reset();
            this.loginEmailInput.focus();
        }
    }

    /**
     * Lida com o envio do formulário de cadastro, faz validação, registra usuário e exibe mensagens.
     * @param {Event} event Evento de submit do formulário
     */
    async handleSignupSubmit(event) {
        event.preventDefault();
        if (!this.signupValidator.validateForm()) return;
        const formData = {
            nome: this.signupNameInput.value,
            cpf_cnpj: this.signupCpfCnpjInput.value,
            telefone: this.signupPhoneInput.value,
            email: this.signupEmailInput.value,
            senha: this.signupPasswordInput.value,
        };
        try {
            await AuthService.signup(formData);
            NotificationService.showToast(
                window.i18nInstance?.translate('toast_signup_success_title') || 'Sucesso',
                window.i18nInstance?.translate('toast_signup_success_message') || 'Cadastro realizado com sucesso! Agora você pode fazer login.',
                'success'
            );
            this.clearSignupForm();
            this.switchToLoginMode();
        } catch (error) {
            NotificationService.showToast(
                window.i18nInstance?.translate('toast_error_title') || 'Erro',
                error.message,
                'error'
            );
            this.signupValidator.reset();
        }
    }

    /**
     * Limpa o formulário de login.
     */
    clearLoginForm() {
        this.loginValidator.reset();
    }

    /**
     * Limpa o formulário de cadastro.
     */
    clearSignupForm() {
        this.signupValidator.reset();
    }

    /**
     * Exibe o header e o footer principais da aplicação.
     */
    _showMainUI() {
        document.getElementById('header').classList.remove('d-none');
        document.getElementById('footer').classList.remove('d-none');
        document.getElementById('main').style.marginTop = '80px';
    }

    /**
     * Força a interface para o modo de login.
     */
    switchToLoginMode() {
        this.isSignUpMode = false;
        this.toggleMode();
    }

    togglePasswordVisibility(inputId, el) {
        const input = document.getElementById(inputId);
        if (!input) return;
        if (input.type === 'password') {
            input.type = 'text';
            el.querySelector('i').classList.remove('fa-eye');
            el.querySelector('i').classList.add('fa-eye-slash');
        } else {
            input.type = 'password';
            el.querySelector('i').classList.remove('fa-eye-slash');
            el.querySelector('i').classList.add('fa-eye');
        }
    }   
}