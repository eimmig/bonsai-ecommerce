import { HeaderCartManager } from './utils/header-cart.js';
import {  removeFromStorage } from '../../core/functionUtils.js';
import { AuthService } from '../login/services/AuthService.js';

export class Header {
    constructor() {
        this.loginState = false;
    }
    
    /**
     * Inicializa o componente Header
     * @returns {Header} Instância do header
     */
    init() {
        this.loginState = AuthService.isLoggedIn();
        this.setupObserver();
        this.setupAllLinks();
        this.setupProductSearch();
        return this;
    }
    
    /**
     * Configura todos os links de navegação
     */
    setupAllLinks() {
        this.setupHomeLink();
        this.setupAboutLink();
        this.setupCartLink();
        this.setupContactLink();
        this.setupLoginLink();
        this.setupBonsaisLink();
        this.setupLoginHandlers();
    }

    toggleLoginState() {
        this.loginState = !this.loginState;
        document.body.classList.toggle('is-logged-in');
    }

    logout() {
        removeFromStorage('currentUser');
        this.loginState = false;
        document.body.classList.remove('is-logged-in');
        document.dispatchEvent(new CustomEvent('cart-updated'));
        window.loadComponent('main', 'app/home/home.html', true);
    }

    setupLoginHandlers() {
        const loginBtns = document.querySelectorAll('.login-link');
        loginBtns.forEach(btn => {
            btn.addEventListener('click', async (e) => {
                e.preventDefault();
                await window.loadComponent("main", "app/login/login.html", true);
            });
        });

        const logoutBtns = document.querySelectorAll('.logout-link');
        logoutBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                this.logout();
            });
        });
    }

    setupObserver() {
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.addedNodes.length) {
                    const header = document.querySelector('#header nav');
                    if (header) {                        this.setupLoginHandlers();
                        this.setupHomeLink();
                        this.setupAboutLink();
                        this.setupCartLink();
                        this.setupContactLink();
                        this.setupLoginLink();
                        this.headerCartManager = new HeaderCartManager().init();
                        observer.disconnect();
                    }
                }
            });
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
        this.setupBonsaisLink();
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

    setupBonsaisLink() {
        const bonsaisLinks = document.querySelectorAll('.bonsais-link');
        bonsaisLinks.forEach(link => {
            link.addEventListener('click', async (e) => {
                e.preventDefault();
                await window.loadComponent("main", "app/bonsai-products/bonsai-products.html", true);
            });
        });
    }

    setupProductSearch() {
        const searchInputs = document.querySelectorAll('.search-input');
        searchInputs.forEach(input => {
            input.addEventListener('input', async (e) => {
                const searchTerm = Header.normalizeString(input.value.trim());
                const isOnProductsPage = window.location.hash.includes('bonsai-products') || document.querySelector('.bonsai-products-section');
                if (!isOnProductsPage) {
                    await window.loadComponent('main', 'app/bonsai-products/bonsai-products.html', true);
                    const observer = new MutationObserver((mutations, obs) => {
                        const hasCards = document.querySelector('.product-card');
                        if (hasCards) {
                            Header.filterProductCards(searchTerm);
                            obs.disconnect();
                        }
                    });
                    observer.observe(document.body, { childList: true, subtree: true });
                } else {
                    Header.filterProductCards(searchTerm);
                }
            });
        });
    }

    static normalizeString(str) {
        return str
            .normalize('NFD')                           
            .replace(/[\u0300-\u036f]/g, '')            
            .replace(/[^\p{L}\p{N} ]+/gu, '')           
            .toLowerCase();
    }


    static filterProductCards(searchTerm) {
        const productContainers = document.querySelectorAll('.products-container, .products-container-detail, .bonsai-products-container');
        productContainers.forEach(container => {
            const cards = container.querySelectorAll('.product-card');
            for (const card of cards) {
                const nameEl = card.querySelector('.product-name-card');
                const productName = nameEl ? Header.normalizeString(nameEl.textContent || nameEl.innerText || '') : '';
                if (!searchTerm || productName.includes(searchTerm)) {
                    card.style.display = '';
                } else {
                    card.style.display = 'none';
                }
            }        });
    }
}

/**
 * Função de inicialização do componente Header
 * @returns {Header} Instância do componente Header inicializado
 */
export function initHeader() {
    return new Header().init();
}
