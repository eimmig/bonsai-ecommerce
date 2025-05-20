export default class Header {
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
                        this.setupHomeLink();
                        this.setupAboutLink();
                        this.setupCartLink();
                        this.setupContactLink();
                        this.setupLoginLink();
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
    
    setupHomeLink() {
        const homeLinks = document.querySelectorAll('.home-link');
        homeLinks.forEach(link => {
            link.addEventListener('click', async (e) => {
                e.preventDefault();
                await window.loadComponent("main", "app/home/home.html", true);
            });
        });
    }
    
    setupAboutLink() {
        const aboutLinks = document.querySelectorAll('.about-link');
        aboutLinks.forEach(link => {
            link.addEventListener('click', async (e) => {
                e.preventDefault();
                await window.loadComponent("main", "app/about/about.html", true);
            });
        });
    }

    setupCartLink() {
        const cartLinks = document.querySelectorAll('.cart-link');
        cartLinks.forEach(link => {
            link.addEventListener('click', async (e) => {
                e.preventDefault();
                await window.loadComponent("main", "app/cart/cart.html", true);
            });
        });
    }

    setupContactLink() {
        const contactLinks = document.querySelectorAll('.contact-link');
        contactLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                document.getElementById('footer').scrollIntoView({ 
                    behavior: 'smooth',
                    block: 'start'
                });
            });
        });
    }

    setupLoginLink() {
        const loginLinks = document.querySelectorAll('.login-link');
        loginLinks.forEach(link => {
            link.addEventListener('click', async (e) => {
                e.preventDefault();
                await window.loadComponent("main", "app/login/login.html", true);
            });
        });
    }
}
