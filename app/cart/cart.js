import { Cart } from './cart-with-itens/cart-with-itens.js';
import { EmptyCartPage } from './empty-cart/empty-cart.js';
import { CartUtils } from './utils/cart-utils.js';

/**
 * Função que inicializa o módulo do carrinho
 * Escolhe entre mostrar o carrinho vazio ou o carrinho com itens
 * dependendo se existem itens no carrinho do usuário atual
 */
export function initCart() {
    const cartManager = new CartManager();
    cartManager.initialize();
}

/**
 * Classe responsável por gerenciar o carrinho
 * Decide entre mostrar carrinho vazio ou com itens baseado no estado atual
 */
class CartManager {
    /**
     * Inicializa o gerenciador de carrinho
     */
    constructor() {
        this.cartUtils = new CartUtils();
    }    /**
     * Carrega os produtos do localStorage
     * @private
     * @returns {Array} Array de produtos
     */
    _loadProducts() {
        try {
            return JSON.parse(localStorage.getItem('products') || '{"produtos":[]}').produtos;
        } catch (error) {
            console.error("Erro ao carregar produtos:", error);
            return [];
        }
    }
    
    /**
     * Inicializa o carrinho - decide qual componente mostrar
     * @public
     */
    async initialize() {
        if (this._shouldShowEmptyCart()) {
            await this._loadEmptyCartView();
        } else {
            await this._loadCartWithItemsView();
        }
    }
    
    /**
     * Verifica se deve mostrar o carrinho vazio
     * @private
     * @returns {boolean} True se o carrinho estiver vazio
     */
    _shouldShowEmptyCart() {
        return this.cartUtils.isCartEmpty();
    }

    /**
     * Carrega a visualização de carrinho vazio
     * @private
     */
    async _loadEmptyCartView() {
        try {
            await this._loadComponent('app/cart/empty-cart/empty-cart.html');
            this._initializeEmptyCartPage();
        } catch (error) {
            this._handleViewLoadError("Erro ao carregar carrinho vazio", error);
        }
    }

    /**
     * Carrega a visualização de carrinho com itens
     * @private
     */
    async _loadCartWithItemsView() {
        try {
            await this._loadComponent('app/cart/cart-with-itens/cart-with-itens.html');
            this._initializeCartWithItems();
        } catch (error) {
            this._handleViewLoadError("Erro ao carregar carrinho com itens", error);
        }
    }
    
    /**
     * Carrega um componente usando a função global loadComponent
     * @private
     * @param {string} path Caminho do componente
     * @returns {Promise} Promise que resolve quando o componente é carregado
     */
    async _loadComponent(path) {
        return window.loadComponent('main', path, true);
    }
    
    /**
     * Inicializa a página de carrinho vazio
     * @private
     */
    _initializeEmptyCartPage() {
        new EmptyCartPage();
    }
    
    /**
     * Inicializa o carrinho com itens
     * @private
     */
    _initializeCartWithItems() {
        new Cart();
    }
    
    /**
     * Trata erros de carregamento de visualização
     * @private
     * @param {string} message Mensagem de erro
     * @param {Error} error Objeto de erro
     */
    _handleViewLoadError(message, error) {
        console.error(message, error);
    }
}
