/**
 * ProductCard Component
 *
 * Este script gerencia a criação e interação dos cards de produtos,
 * incluindo cálculo de desconto, formatação de preço e interações de botões.
 */
import {NotificationService} from "../../core/notifications.js";
import { loadProductsFromStorage } from "../../core/functionUtils.js";

export class ProductCard {
    constructor(maxProducts = null) {
        this.productsData = [];
        this.maxProducts = maxProducts; // Recebe o número máximo de produtos como parâmetro, com valor padrão 6
    }

    /**
     * Inicializa o componente, carregando os dados e configurando eventos
     */
    async init() {
        try {
            await this.loadProductsData();
            this.renderProductCards();
            this.setupEventListeners();
        } catch (error) {
            console.error('Erro ao inicializar o componente ProductCard:', error);
        }
    }

    /**
     * Carrega os dados de produtos do arquivo JSON usando a função global loadComponent
     */
    async loadProductsData() {
        try {
            let jsonPath = '/data/products.json'; // Caminho absoluto a partir da raiz do servidor

            // Usa utilitário centralizado para tentar carregar do localStorage primeiro
            const localProducts = loadProductsFromStorage();
            if (localProducts?.length) {
                this.productsData = this.maxProducts ? localProducts.slice(0, this.maxProducts) : localProducts;
                console.log("Produtos carregados do localStorage:", this.productsData.length);
                return this.productsData;
            }

            // Se não encontrou no localStorage, busca via fetch
            const response = await fetch(jsonPath);
            if (!response.ok) {
                throw new Error('Não foi possível carregar os dados dos produtos');
            }

            const data = await response.json();
            this.productsData = data.produtos;

            if (this.maxProducts) {
                this.productsData = this.productsData.slice(0, this.maxProducts);
            }

            console.log("Produtos carregados via fetch:", this.productsData.length);
            return this.productsData;
        } catch (error) {
            console.error('Erro ao carregar dados de produtos:', error);
            this.productsData = [];
            return this.productsData;
        }
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

        // Garantir que a imagem seja a urlImagemDestaque
        const imageUrl = product.imagem[0].urlImagemDestaque;

        cardElement.innerHTML = `
            ${hasDiscount ? `<div class="discount-badge">-${product.porcentagemDesconto}%</div>` : ''}
            <div class="product-image">
                <img src="${imageUrl}" alt="${product.nome}">
            </div>
            <div class="product-info">
                <h3 class="product-name-card">${product.nome}</h3>
                <p class="product-description">${product.descricao}</p>
                <div class="product-price">
                    ${hasDiscount ? `<span class="original-price">${this.formatPrice(product.valor)}</span>` : ''}
                    <span class="discounted-price">${this.formatPrice(discountedPrice)}</span>
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
        document.addEventListener('click', (event) => {
            // Verificar se o clique foi em um botão de adicionar ao carrinho
            if (event.target.classList.contains('add-to-cart-btn')) {
                const card = event.target.closest('.product-card');
                if (card) {
                    const productId = card.dataset.productId;
                    this.addToCart(productId);
                }
            }

            // Verificar se o clique foi em um botão de ver detalhes
            if (event.target.classList.contains('view-details-btn')) {
                const card = event.target.closest('.product-card');
                if (card) {
                    const productId = card.dataset.productId;
                    this.viewProductDetails(productId);
                }
            }
        });
    }

    /**
     * Adiciona um produto ao carrinho
     * @param {string} productId - ID do produto a ser adicionado ao carrinho
     */
    addToCart(productId) {
        console.log(`Produto ${productId} adicionado ao carrinho`);
        // Implementação futura: integração com o carrinho de compras
        // Exemplo: usar localStorage ou enviar para API

        // Simular notificação de sucesso
        NotificationService.showToast('Sucesso', 'Produto adicionado ao carrinho com sucesso!', 'success');
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

    /**
     * Formata o valor para o formato de moeda brasileira
     * @param {number} value - Valor a ser formatado
     * @returns {string} - Valor formatado (ex: "R$ 299,90")
     */
    formatPrice(value) {
        return `R$ ${value.toFixed(2).replace('.', ',')}`;
    }
}

