class Header {
    constructor() {
        this.loginState = false;
        this.setupObserver();
    }

    toggleLoginState() {
        this.loginState = !this.loginState;
        document.body.classList.toggle('is-logged-in');
    }

    setupLoginHandlers() {
        // Configura listeners para login (desktop e mobile)
        const loginBtns = document.querySelectorAll('.logged-out-only');
        loginBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                this.toggleLoginState();
            });
        });

        // Configura listeners para logout (desktop e mobile)
        const logoutBtns = document.querySelectorAll('[data-i18n="logout"]');
        logoutBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                this.toggleLoginState();
            });
        });
    }

    setupObserver() {
        // Observa mudanças no DOM para detectar quando o header é carregado
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.addedNodes.length) {
                    const header = document.querySelector('#header nav');
                    if (header) {
                        this.setupLoginHandlers();
                        observer.disconnect();
                    }
                }
            });
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }
}

export default Header;
