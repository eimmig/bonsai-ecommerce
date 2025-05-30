import { CartUtils } from '../../cart/utils/cart-utils.js';
import { getFromStorage } from '../../../core/functionUtils.js';

/**
 * Classe responsável por atualizar a contagem de itens no carrinho no cabeçalho
 * Mantém os badges do carrinho atualizados com a quantidade de itens
 */
export class HeaderCartManager {
    /**
     * Inicializa o gerenciador de carrinho do cabeçalho
     */
    constructor() {
        this._initializeDependencies();
        this._initialize();
    }

    /**
     * Inicializa as dependências
     * @private
     */
    _initializeDependencies() {
        this.cartUtils = new CartUtils();
        this.cartBadges = this._getCartBadges();
    }
    
    /**
     * Obtém todos os badges do carrinho
     * @private
     * @returns {NodeList} Lista de badges
     */
    _getCartBadges() {
        return document.querySelectorAll('.cart-link .badge');
    }

    /**
     * Inicializa o gerenciador
     * @private
     */
    _initialize() {
        this._updateCartCount();
        this._setupEventListeners();
    }    /**
     * Atualiza o contador de itens nos badges do carrinho
     * @private
     */
    _updateCartCount() {
        // Checa se há usuário logado
        let user = null;
        try {
            user = getFromStorage('currentUser');
        } catch {}
        // Sempre instancia CartUtils para garantir currentUserIdentifier correto
        this.cartUtils = new CartUtils();
        const cartItemCount = user?.email ? this.cartUtils.getCartItemCount() : 0;
        this._updateAllBadges(cartItemCount);
    }
    
    /**
     * Atualiza todos os badges do carrinho com a contagem de itens
     * @private
     * @param {number} itemCount Número de itens no carrinho
     */
    _updateAllBadges(itemCount) {
        this.cartBadges.forEach(badge => {
            this._updateBadgeText(badge, itemCount);
            this._toggleBadgeVisibility(badge, itemCount);
        });
    }
    
    /**
     * Atualiza o texto do badge
     * @private
     * @param {HTMLElement} badge Elemento do badge
     * @param {number} count Contagem de itens
     */
    _updateBadgeText(badge, count) {
        badge.textContent = count;
    }
    
    /**
     * Alterna a visibilidade do badge baseado na contagem
     * @private
     * @param {HTMLElement} badge Elemento do badge
     * @param {number} count Contagem de itens
     */
    _toggleBadgeVisibility(badge, count) {
        if (count === 0) {
            badge.classList.add('d-none');
        } else {
            badge.classList.remove('d-none');
        }
    }

    /**
     * Configura os ouvintes de eventos
     * @private
     */
    _setupEventListeners() {
        document.addEventListener('cart-updated', this._handleCartUpdated.bind(this));
        document.addEventListener('user-logged-in', this._handleCartUpdated.bind(this));
        document.addEventListener('user-logged-out', this._handleCartUpdated.bind(this));
    }
    
    /**
     * Manipula o evento de atualização do carrinho
     * @private
     */
    _handleCartUpdated() {
        this._updateCartCount();
    }
}
