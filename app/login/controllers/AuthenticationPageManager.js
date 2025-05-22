import { AuthService } from '../services/AuthService.js';
import { CpfCnpjMask } from '../components/input-masks/CpfCnpjMask.js';
import { TelefoneMask } from '../components/input-masks/TelefoneMask.js';
import { NotificationService } from '../../../core/notifications.js';
import { FormValidator } from '../../../core/form-validator.js';

/**
 * Gerencia a página de autenticação
 * Controla o formulário de login/cadastro e suas interações
 */
export class AuthenticationPageManager {
    /**
     * Inicializa o gerenciador da página de autenticação
     * Configura os elementos DOM e estado inicial
     */    constructor() {
        this._setupUIElements();
        this._cacheFormElements();
        this._cacheInputElements();
        this.init();
        this._initializeFormValidation();
    }

    /**
     * Inicializa a validação dos formulários
     * @private
     */
    _initializeFormValidation() {
        this.loginForm.setAttribute('novalidate', '');
        this.signupForm.setAttribute('novalidate', '');

        // Criar instâncias do FormValidator para cada formulário
        this.loginValidator = new FormValidator(this.loginForm);
        this.signupValidator = new FormValidator(this.signupForm);
    }

    /**
     * Configura os elementos principais da UI
     */
    _setupUIElements() {
        document.getElementById('header').classList.add('d-none');
        document.getElementById('footer').classList.add('d-none');
        this.container = document.querySelector('.auth-container');
        this.isSignUpMode = false;
    }

    /**
     * Armazena referências aos formulários e botões
     */
    _cacheFormElements() {
        this.loginForm = document.getElementById('login-form');
        this.signupForm = document.getElementById('signup-form');
        this.signUpToggleBtn = document.getElementById('signup-toggle-btn');
        this.loginToggleBtn = document.getElementById('login-toggle-btn');
    }

    /**
     * Armazena referências aos campos de entrada
     */
    _cacheInputElements() {
        // Login form inputs
        this.loginEmailInput = document.getElementById('login-email');
        this.loginPasswordInput = document.getElementById('login-senha');

        // Signup form inputs
        this.signupNameInput = document.getElementById('signup-nome');
        this.signupCpfCnpjInput = document.getElementById('signup-cpf-cnpj');
        this.signupPhoneInput = document.getElementById('signup-telefone');
        this.signupEmailInput = document.getElementById('signup-email');
        this.signupPasswordInput = document.getElementById('signup-senha');
    }

    /**
     * Inicializa o componente de autenticação
     */
    init() {
        this.addEventListeners();
        this.initInputMasks();
        this._checkInitialMode();
    }

    /**
     * Configura todos os event listeners necessários
     */
    addEventListeners() {
        // Event listeners para alternar entre login e cadastro
        this.signUpToggleBtn.addEventListener('click', this.toggleMode.bind(this));
        this.loginToggleBtn.addEventListener('click', this.toggleMode.bind(this));

        // Event listeners para submissão dos formulários
        this.loginForm.addEventListener('submit', this.handleLoginSubmit.bind(this));
        this.signupForm.addEventListener('submit', this.handleSignupSubmit.bind(this));
    }

    /**
     * Inicializa as máscaras para os campos de CPF/CNPJ e telefone
     */
    initInputMasks() {
        this.cpfCnpjMask = new CpfCnpjMask('signup-cpf-cnpj');
        this.telefoneMask = new TelefoneMask('signup-telefone');
    }

    /**
     * Verifica e configura o modo inicial da interface
     * @private
     */
    _checkInitialMode() {
        this.isSignUpMode = false;
        this.toggleMode();
    }

    /**
     * Alterna entre os modos de login e cadastro
     */
    toggleMode() {
        this.isSignUpMode = !this.isSignUpMode;
        this.container.classList.toggle('sign-up-mode', this.isSignUpMode);
    }    /**
     * Manipula o envio do formulário de login
     * @param {Event} event Evento de submit do formulário
     */    async handleLoginSubmit(event) {
        event.preventDefault();
        
        if (!this.loginValidator.validateForm()) {
            return;
        }

        const formData = {
            email: this.loginEmailInput.value,
            senha: this.loginPasswordInput.value,
        };

        try {
            await AuthService.login(formData);
            NotificationService.showToast('Sucesso', 'Login realizado com sucesso!');
            this.loginValidator.reset(); // Reset antes de redirecionar
            this.showMainUI();
            window.loadComponent("main", "app/home/home.html", true);
        } catch (error) {
            NotificationService.showToast('Erro', error.message, 'error');
            this.loginValidator.reset(); // Limpa o formulário em caso de erro
            this.loginEmailInput.focus(); // Foca no campo de email para nova tentativa
        }
    }

    clearLoginForm() {
        this.loginValidator.reset();
    }

    showMainUI() {
        document.getElementById('header').classList.remove('d-none');
        document.getElementById('footer').classList.remove('d-none');
    }

    /**
     * Manipula o envio do formulário de cadastro
     * @param {Event} event Evento de submit do formulário
     */
    async handleSignupSubmit(event) {
        event.preventDefault();

        if (!this.signupValidator.validateForm()) {
            return;
        }

        const formData = {
            nome: this.signupNameInput.value,
            cpf_cnpj: this.signupCpfCnpjInput.value,
            telefone: this.signupPhoneInput.value,
            email: this.signupEmailInput.value,
            senha: this.signupPasswordInput.value,
        };

        try {
            await AuthService.signup(formData);
            NotificationService.showToast('Sucesso', 'Cadastro realizado com sucesso! Agora você pode fazer login.');
            this.clearSignupForm();
            this.switchToLoginMode();
        } catch (error) {
            NotificationService.showToast('Erro', error.message, 'error');
            this.signupValidator.reset();
        }
    }

    clearSignupForm() {
        this.signupValidator.reset();
    }

    switchToLoginMode() {
        this.isSignUpMode = false;
        this.toggleMode();
    }
}
