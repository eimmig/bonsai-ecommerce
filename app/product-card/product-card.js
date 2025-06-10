import { NotificationService } from "../../core/notifications.js";
import { loadProductsFromStorage, formatCurrencyBRL } from "../../core/functionUtils.js";
import { CartUtils } from "../cart/utils/cart-utils.js";

export class ProductCard {
    /**
     * Construtor da classe
     * @param {number|null} maxProducts - Número máximo de produtos para exibir
     */
    constructor(maxProducts = null) {
        this.productsData = [];
        this.maxProducts = maxProducts;
    }    
    
    /**
     * Inicializa o componente, carregando os dados e configurando eventos
     * @returns {ProductCard} - Instância do componente
     */    init() {
        try {
            this.loadProductsData();
            this.renderProductCards();
            this.setupEventListeners();
        } catch (error) {
            console.error('Erro ao inicializar o componente ProductCard:', error);
        }
        return this;
    }
    
    /**
     * Carrega os dados de produtos do localStorage
     */
    loadProductsData() {
        const products = loadProductsFromStorage();
        this.productsData = this.maxProducts ? products.slice(0, this.maxProducts) : products;
        return this.productsData;
    }

    /**
     * Renderiza os cards de produtos baseados nos dados carregados
     */
    renderProductCards() {
        const container = document.querySelector('.products-container');
        if (container) {
            container.innerHTML = '';
            this.productsData.forEach(product => {
                container.appendChild(this.createProductCard(product));
            });

            window.i18nInstance.translateElement(container);
        }
    }    
    
    /**
     * Cria um elemento de card de produto baseado nos dados fornecidos
     * @param {Object} product - Dados do produto a ser exibido
     * @returns {HTMLElement} - Elemento DOM do card de produto
     */
    createProductCard(product) {
        const hasDiscount = product.porcentagemDesconto > 0;
        const discountedPrice = this.calculateDiscountedPrice(product.valor, product.porcentagemDesconto);
        const cardElement = document.createElement('div');
        cardElement.className = `product-card ${!hasDiscount ? 'no-discount' : ''}`;
        cardElement.dataset.productId = product.id;
        const imageUrl = product.imagem.urlImagemDestaque;

        const installmentValue = discountedPrice / 12;

        cardElement.innerHTML = `
            ${hasDiscount ? `<div class="discount-badge">-${product.porcentagemDesconto}%</div>` : ''}
            <div class="product-image">
                <img src="${imageUrl}" alt="${product.nome}">
            </div>
            <div class="product-info">
                <h3 class="product-name-card">${product.nome}</h3>
                <p class="product-description">${product.descricao.substring(0, 100)}${product.descricao.length > 100 ? "..." : ""}</p>
                <div class="product-price">
                    ${hasDiscount ? `<span class="original-price">${formatCurrencyBRL(product.valor)}</span>` : ''}
                    <span class="discounted-price">${formatCurrencyBRL(discountedPrice)}</span>
                </div>
                <div class="installments">
                    <span data-i18n="installments_prefix" data-i18n-params='{"n":12}'>Em até 12x de</span>
                    ${formatCurrencyBRL(installmentValue)}
                    <span data-i18n="installments_suffix">sem juros</span>
                </div>
                <button class="add-to-cart-btn" data-i18n="btn_add_to_cart">Adicionar ao carrinho</button>
                <button class="view-details-btn" data-i18n="btn_view_product">Ver detalhes</button>
            </div>
        `;
        return cardElement;
    }

    /**
     * Configura os event listeners para os botões do card
     */
    setupEventListeners() {
        const container = document.querySelector('.products-container');
        if (!container) return;
        container.addEventListener('click', (event) => {
            const card = event.target.closest('.product-card');
            if (!card) return;
            const productId = card.dataset.productId;

            if (event.target.classList.contains('add-to-cart-btn')) {
                this.addToCart(productId);
                return;
            }
            if (event.target.classList.contains('view-details-btn')) {
                this.viewProductDetails(productId);
                return;
            }
            this.viewProductDetails(productId);
        });
    }    
    
    /**
     * Adiciona um produto ao carrinho
     * @param {string} productId - ID do produto a ser adicionado ao carrinho
     */
    addToCart(productId) {
        const cartUtils = new CartUtils();
        const added = cartUtils.addToCart(productId, 1);
        
        if (added) {
            NotificationService.showToast(
                window.i18nInstance?.translate('toast_item_added_title') || 'Sucesso',
                window.i18nInstance?.translate('toast_item_added_message') || 'Produto adicionado ao carrinho!',
                'success'
            );
        }
    }

    /**
     * Redireciona para a página de detalhes do produto
     * @param {string} productId - ID do produto a visualizar
     */
    viewProductDetails(productId) {
        console.log(`Redirecionando para detalhes do produto ${productId}`);
        window.loadComponent('main', 'app/product-detail/product-detail.html', true, productId);
    }

    /**
     * Calcula o preço com desconto
     * @param {number} originalPrice - Preço original do produto
     * @param {number} discountPercentage - Percentual de desconto
     * @returns {number} - Preço com desconto aplicado
     */
    calculateDiscountedPrice(originalPrice, discountPercentage) {
        if (!discountPercentage || discountPercentage <= 0) {
            return originalPrice;
        }
        const discount = (originalPrice * discountPercentage) / 100;
        return originalPrice - discount;
    }
}

