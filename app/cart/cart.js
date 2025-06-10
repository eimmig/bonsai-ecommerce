import { Cart } from './cart-with-itens/cart-with-itens.js';
import { EmptyCartPage } from './empty-cart/empty-cart.js';
import { CartUtils } from './utils/cart-utils.js';
import { AuthService } from '../login/services/AuthService.js';
import { getFromStorage } from '../../core/functionUtils.js';

/**
 * Função que inicializa o módulo do carrinho
 * Escolhe entre mostrar o carrinho vazio ou o carrinho com itens
 * dependendo se existem itens no carrinho do usuário atual
 */
export function initCart() {
    const currentUser = AuthService.getCurrentUser ? AuthService.getCurrentUser() : getFromStorage('currentUser');
    if (!currentUser?.email) {
        window.loadComponent('main', 'app/login/login.html', true);
        return;
    }

    const cartManager = new CartManager();
    cartManager.initialize();
    
    if (window.i18nInstance && typeof window.i18nInstance.translateElement === 'function') {
        const main = document.getElementById('main');
        window.i18nInstance.translateElement(main, window.i18nInstance.currentLang);
    }
}

/**
 * Classe responsável por gerenciar o carrinho
 * Decide entre mostrar carrinho vazio ou com itens baseado no estado atual
 */
class CartManager {
    /**
     * Inicializa o gerenciador de carrinho com uma instância do CartUtils
     */
    constructor() {
        this.cartUtils = new CartUtils();
    }    
    
    /**
     * Inicializa o carrinho - decide qual componente mostrar baseado no estado do carrinho
     * Carrega o componente apropriado (vazio ou com itens) e atualiza o título da página
     * @returns {Promise<void>}
     */
    async initialize() {
        if (this.cartUtils.isCartEmpty()) {
            await window.loadComponent('main', 'app/cart/empty-cart/empty-cart.html', true);
            this.emptyCartPage = new EmptyCartPage().init();
        } else {
            await window.loadComponent('main', 'app/cart/cart-with-itens/cart-with-itens.html', true);
            this.cartWithItems = new Cart().init();
        }

        document.title = 'Carrinho | Bonsai E-commerce';
    }
}
