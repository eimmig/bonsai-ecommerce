import { CartUtils } from '../utils/cart-utils.js';
import { NotificationService } from '../../../core/notifications.js';
import { formatCurrencyBRL, loadProductsFromStorage, calculateDiscountedPrice } from '../../../core/functionUtils.js';

/**
 * Classe responsável pela página de carrinho com itens
 */
export class Cart {
    /**
     * Constante de frete padrão
     */
    static DEFAULT_SHIPPING_COST = 50.00;
    
    /**
     * Inicializa o componente de carrinho com itens
     */
    init() {
        this._initializeElements();
        this._initializeData();
        this._setupEventListeners();
        this._renderCartItems();
        return this;
    }

    /**
     * Inicializa os elementos do DOM
     * @private
     */
    _initializeElements() {
        this.elements = {
            productsList: document.getElementById('cart-products-list'),
            summarySubtotal: document.getElementById('summary-subtotal'),
            summaryShipping: document.getElementById('summary-shipping'),
            summaryDiscount: document.getElementById('summary-discount'),
            summaryTotal: document.getElementById('summary-total'),
            continueShoppingBtn: document.getElementById('continue-shopping-btn'),
            checkoutBtn: document.getElementById('checkout-btn')
        };
    }
    
    /**
     * Inicializa os dados do carrinho
     * @private
     */
    _initializeData() {
        this.cartUtils = new CartUtils();
        this._refreshCartItems();
        this.products = loadProductsFromStorage();
        this.shippingCost = Cart.DEFAULT_SHIPPING_COST;
        this.discountAmount = 0;
    }
    
    /**
     * Formata um valor para exibição como moeda (R$)
     * @private
     * @param {number} value Valor a ser formatado
     * @returns {string} Valor formatado como moeda
     */
    _formatCurrency(value) {
        return formatCurrencyBRL(value);
    }
    
    /**
     * Calcula os valores do resumo do carrinho
     * @private
     */
    _calculateSummary() {
        const summary = this._calculateCartTotals();
        this.discountAmount = summary.totalDiscount;
        const total = summary.subtotal + this.shippingCost - this.discountAmount;

        this.elements.summarySubtotal.textContent = this._formatCurrency(summary.subtotal);
        this.elements.summaryShipping.textContent = this._formatCurrency(this.shippingCost);
        this.elements.summaryDiscount.textContent = this._formatCurrency(this.discountAmount);
        this.elements.summaryTotal.textContent = this._formatCurrency(total);
    }
    
    /**
     * Calcula os totais do carrinho (subtotal e desconto)
     * @private
     * @returns {Object} Objeto com subtotal e totalDiscount
     */
    _calculateCartTotals() {
        let subtotal = 0;
        let totalDiscount = 0;
        
        for (const item of this.cartItems) {
            const productInfo = this._getProductInfo(item.productId);
            if (!productInfo) continue;
            
            const originalPrice = productInfo.valor;
            const discountPercentage = productInfo.porcentagemDesconto || 0;
            const discountedPrice = calculateDiscountedPrice(originalPrice, discountPercentage);
            
            subtotal += discountedPrice * item.quantity;
            totalDiscount += (originalPrice - discountedPrice) * item.quantity;
        }
        
        return { subtotal, totalDiscount };
    }
    
    /**
     * Retorna o tipo de controle de quantidade ou null
     * @private
     * @param {HTMLElement} element
     * @returns {'decrement'|'increment'|null}
     */
    _getQuantityControlType(element) {
        if (element.classList.contains('quantity-minus')) return 'decrement';
        if (element.classList.contains('quantity-plus')) return 'increment';
        return null;
    }

    /**
     * Atualiza e renderiza o carrinho após alteração de quantidade
     * @private
     */
    _updateAndRenderCart() {
        this._refreshCartItems();
        if (!this.cartItems || this.cartItems.length === 0) {
            window.loadComponent('main', 'app/cart/cart.html', true);
            return;
        }
        this._renderCartItems();
    }

    /**
     * Atualiza os itens do carrinho na memória
     * @private
     */
    _refreshCartItems() {
        this.cartItems = this.cartUtils.getCartItems();
    }   

    /**
     * Habilita ou desabilita o botão de checkout
     * @private
     * @param {boolean} enable
     */
    _setCheckoutButtonEnabled(enable) {
        this.elements.checkoutBtn.disabled = !enable;
    }

    /**
     * Manipula as alterações de quantidade (+ e -)
     * @private
     * @param {Event} event Evento do DOM
     */
    _handleQuantityChange(event) {
        const productId = event.target.dataset.id;
        if (!productId) return;
        const item = this.cartItems.find(
            item => item.productId.toString() === productId.toString()
        );
        if (!item) return;
        const controlType = this._getQuantityControlType(event.target);
        if (controlType === 'decrement') {
            if (item.quantity > 1) {
                this.cartUtils.updateQuantity(item.productId, item.quantity - 1);
            } else {
                this.cartUtils.removeFromCart(item.productId);
            }
            this._updateAndRenderCart();
        } else if (controlType === 'increment') {
            this.cartUtils.updateQuantity(item.productId, item.quantity + 1);
            this._updateAndRenderCart();
        }
    }
    
    /**
     * Configura os listeners de eventos
     * @private
     */
    _setupEventListeners() {
        this._setupContinueShoppingButton();
        this._setupCheckoutButton();
        this._setupQuantityControls();
    }
    
    /**
     * Configura o botão de continuar comprando
     * @private
     */
    _setupContinueShoppingButton() {
        this.elements.continueShoppingBtn.addEventListener('click', this._handleContinueShopping.bind(this));
    }
    
    /**
     * Configura o botão de checkout
     * @private
     */
    _setupCheckoutButton() {
        this.elements.checkoutBtn.addEventListener('click', this._handleCheckout.bind(this));
    }
    
    /**
     * Configura os controles de quantidade
     * @private
     */
    _setupQuantityControls() {
        this.elements.productsList.addEventListener('click', (event) => {
            if (this._getQuantityControlType(event.target)) {
                this._handleQuantityChange(event);
            }
        });
    }
    
    /**
     * Manipula o clique no botão de continuar comprando
     * @private
     */
    _handleContinueShopping() {
        window.loadComponent('main', 'app/home/home.html', true);
    }
    
    /**
     * Manipula o clique no botão de checkout
     * @private
     */
    _handleCheckout() {
        //TODO: Implementar lógica de checkout
        NotificationService.showToast(
            window.i18nInstance?.translate('toast_checkout_redirect_title') || 'Redirecionando',
            window.i18nInstance?.translate('toast_checkout_redirect_message') || 'Preparando página de pagamento',
            'info'
        );
        // window.loadComponent('main', 'app/payment/checkout/checkout.html', true);
    }    
    
    /**
     * Renderiza os itens do carrinho
     * @private
     */
    _renderCartItems() {
        const productsList = this.elements.productsList;
        productsList.innerHTML = '';
        if (!this.cartItems || this.cartItems.length === 0) {
            this._setCheckoutButtonEnabled(false);
            return;
        }
        this._setCheckoutButtonEnabled(true);
        this._renderEachCartItem(productsList);
        this._calculateSummary();
    }
    
    /**
     * Renderiza cada item do carrinho
     * @private
     * @param {HTMLElement} container Elemento onde os itens serão renderizados
     */
    _renderEachCartItem(container) {
        this.cartItems.forEach(item => {
            const productInfo = this._getProductInfo(item.productId);
            
            if (!productInfo) {
                console.error(`Produto id=${item.productId} não encontrado na base de produtos.`);
                return;
            }
            
            const cartItemElement = this._createCartItemElement(item, productInfo);
            container.appendChild(cartItemElement);
        });
    }
    
    /**
     * Cria o elemento HTML para um item do carrinho
     * @private
     * @param {Object} item Item do carrinho
     * @param {Object} productInfo Informações do produto
     * @returns {HTMLElement} Elemento do item do carrinho
     */
    _createCartItemElement(item, productInfo) {
        const price = productInfo.valor;
        const discountPercentage = productInfo.porcentagemDesconto || 0;
        const discountedPrice = calculateDiscountedPrice(price, discountPercentage);
        const imageUrl = this._getProductImageUrl(productInfo);
        
        const productItemDiv = document.createElement('div');
        productItemDiv.classList.add('cart-product-item');
        productItemDiv.setAttribute('data-product-id', item.productId);

        productItemDiv.innerHTML = this._getCartItemTemplate(item, productInfo, imageUrl, discountedPrice);
        
        return productItemDiv;
    }
    
    /**
     * Obtém a URL da imagem do produto
     * @private
     * @param {Object} productInfo Informações do produto
     * @returns {string} URL da imagem
     */
    _getProductImageUrl(productInfo) {
        return productInfo.imagem && productInfo.imagem.length > 0 
            ? productInfo.imagem.urlImagemDestaque 
            : 'assets/images/products/default.svg';
    }
    
    /**
     * Obtém o template HTML para um item do carrinho
     * @private
     * @param {Object} item Item do carrinho
     * @param {Object} productInfo Informações do produto
     * @param {string} imageUrl URL da imagem
     * @param {number} price Preço do produto
     * @returns {string} Template HTML
     */
    _getCartItemTemplate(item, productInfo, imageUrl, price) {
        return `
            <div class="product-image-wrapper">
                <img src="${imageUrl}" alt="${productInfo.nome}" class="product-image">
            </div>
            <span class="product-name">${productInfo.nome}</span>
            <span class="product-price">${this._formatCurrency(price)}</span>
            <div class="quantity-control">
                <button class="quantity-minus" data-id="${item.productId}">-</button>
                <input type="number" class="quantity-input" value="${item.quantity}" min="1" data-id="${item.productId}" readonly>
                <button class="quantity-plus" data-id="${item.productId}">+</button>
            </div>
        `;
    }
    
    /**
     * Busca informações do produto pelo ID
     * @private
     * @param {string|number} productId ID do produto
     * @returns {Object|undefined} Informações do produto ou undefined
     */
    _getProductInfo(productId) {
        return this.products.find(p => p.id.toString() === productId.toString());
    }
}

/**
 * Função de inicialização do módulo de carrinho com itens
 * @returns {Cart} Instância do carrinho
 */
export function initCartWithItems() {
    return new Cart().init();
}