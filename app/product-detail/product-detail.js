import { NotificationService } from "../../core/notifications.js";
import { formatCurrencyBRL, loadProductsFromStorage } from "../../core/functionUtils.js";
import { CartUtils } from "../cart/utils/cart-utils.js";
import { CepMask } from "../login/components/input-masks/CepMask.js";
import { ProductCard } from "../product-card/product-card.js";

export class ProductDetail {
    /**
     * Cria a instância do componente ProductDetail
     */
    constructor() {
        this.productData = null;
        this.allProducts = [];
        this.currentImageIndex = 0;
    }

    /**
     * Inicializa o componente, carregando dados e configurando eventos
     * @param {string} productId - ID do produto a ser exibido
     * @returns {ProductDetail} - Instância do componente
     */
    async init(productId) {
        try {
            if (!productId) {
                const urlParams = new URLSearchParams(window.location.search);
                productId = urlParams.get("id");
            }
            if (!productId) {
                this.showError(this._t('error_no_product_id'));
                return this;
            }
            await this.loadProductData(productId);
            this.setupEventListeners();
            const cepInput = document.getElementById("shipping-cep");
            if (cepInput) {
                CepMask(cepInput);
            }
        } catch (error) {
            console.error("Erro ao inicializar o componente ProductDetail:", error);
            this.showError(this._t('error_load_product_detail'));
        }
        return this;
    }

    /**
     * Carrega os dados do produto e renderiza detalhes
     */
    async loadProductData(productId) {
        try {
            this.allProducts = loadProductsFromStorage();
            if (!this.allProducts.length) {
                throw new Error(this._t('error_load_products'));
            }
            this.productData = this.allProducts.find(product => product.id === productId);
            if (!this.productData) {
                throw new Error(this._t('error_product_not_found'));
            }
            this.renderProductDetails();
            this.renderRelatedProducts();
            const loading = document.getElementById("loading-product");
            if (loading) loading.remove();
            const content = document.getElementById("product-content");
            if (content) content.style.display = "flex";
        } catch (error) {
            console.error("Erro ao carregar dados do produto:", error);
            this.showError(this._t('error_load_product_detail'));
        }
    }

    /**
     * Renderiza os detalhes do produto na página
     */
    renderProductDetails() {
        document.getElementById("product-name").textContent = this.productData.nome;
        document.title = `${this.productData.nome} | Bonsai E-commerce`;
        document.getElementById("product-description").textContent = this.productData.descricao;
        this.renderPriceArea();
        this.renderProductImages();
    }

    /**
     * Renderiza a área de preço e opções de parcelamento
     */
    renderPriceArea() {
        const priceArea = document.getElementById("product-price-area");
        const installmentOptions = document.getElementById("installment-options");
        const hasDiscount = this.productData.porcentagemDesconto > 0;
        const discountedPrice = this.calculateDiscountedPrice(
            this.productData.valor,
            this.productData.porcentagemDesconto
        );
        let priceHTML = "";
        if (hasDiscount) {
            priceHTML += `<span class="original-price">${formatCurrencyBRL(this.productData.valor)}</span>`;
            priceHTML += `<span class="discounted-price">${formatCurrencyBRL(discountedPrice)}</span>`;
            priceHTML += `<span class="discount-badge-detail">-${this.productData.porcentagemDesconto}%</span>`;
        } else {
            priceHTML += `<span class="discounted-price">${formatCurrencyBRL(this.productData.valor)}</span>`;
        }
        priceArea.innerHTML = priceHTML;
        const finalPrice = hasDiscount ? discountedPrice : this.productData.valor;
        const installmentHTML = this.generateInstallmentOptions(finalPrice);
        installmentOptions.innerHTML = installmentHTML;
    }    
    
    /**
     * Gera o HTML das opções de parcelamento
     */
    generateInstallmentOptions(price) {
        const maxInstallments = 12;
        const installmentValue = price / maxInstallments;
        
        const installmentDiv = document.createElement('div');
        installmentDiv.innerHTML = `
            <span data-i18n="installments_prefix" data-i18n-params='{"n":12}'>Em até 12x de</span>
            ${formatCurrencyBRL(installmentValue)}
            <span data-i18n="installments_suffix">sem juros</span>
        `;
        
        if (window.i18nInstance && typeof window.i18nInstance.translateElement === 'function') {
            window.i18nInstance.translateElement(installmentDiv);
        }
        
        return installmentDiv.innerHTML;
    }

    /**
     * Renderiza as imagens principais e miniaturas do produto
     */
    renderProductImages() {
        const mainImage = document.getElementById("main-product-image");
        mainImage.src = this.productData.imagem.urlImagemDestaque;
        mainImage.alt = this.productData.nome;
        const thumbnailsContainer = document.querySelector(".product-thumbnails");
        thumbnailsContainer.innerHTML = "";
        
        const imageUrls = [
            this.productData.imagem.urlImagemDestaque,
            this.productData.imagem.urlImagem1,
            this.productData.imagem.urlImagem2,
            this.productData.imagem.urlImagem3
        ];

        imageUrls.forEach((url, index) => {
            const thumbnail = document.createElement("div");
            thumbnail.className = `thumbnail ${index === 0 ? "active" : ""}`;
            thumbnail.dataset.index = index;
            const img = document.createElement("img");
            img.src = url;
            img.alt = `Thumbnail ${index + 1}`;
            thumbnail.appendChild(img);
            thumbnailsContainer.appendChild(thumbnail);
            thumbnail.addEventListener("click", () => this.changeThumbnail(index));
        });
    }

    /**
     * Altera a imagem principal ao clicar em uma miniatura
     */
    changeThumbnail(index) {
        const thumbnails = document.querySelectorAll(".thumbnail");
        thumbnails.forEach(thumb => thumb.classList.remove("active"));
        thumbnails[index].classList.add("active");
        const mainImage = document.getElementById("main-product-image");
        const imageUrls = [
            this.productData.imagem.urlImagemDestaque,
            this.productData.imagem.urlImagem1,
            this.productData.imagem.urlImagem2,
            this.productData.imagem.urlImagem3
        ];
        mainImage.src = imageUrls[index];
        this.currentImageIndex = index;
    }

    /**
     * Renderiza os produtos relacionados
     */
    renderRelatedProducts() {
        const container = document.querySelector(".related-products .products-container-detail");
        if (!container) return;
        container.innerHTML = "";
        const relatedProducts = this.allProducts.filter(product => product.id !== this.productData.id);
        const productsToShow = relatedProducts.slice(0, 3);
        productsToShow.forEach(product => {
            const card = this.createProductCard(product);
            container.appendChild(card);
        });
        
        if (window.i18nInstance && typeof window.i18nInstance.translateElement === 'function') {
            window.i18nInstance.translateElement(container);
        }
        
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }    
    
    /**
     * Cria o card de produto relacionado
     */
    createProductCard(product) {
        if (!this.cardComponent) {
            this.cardComponent = new ProductCard();
        }
        return this.cardComponent.createProductCard(product);
    }

    /**
     * Configura os event listeners dos botões e produtos relacionados
     */
    setupEventListeners() {
        const addToCartBtn = document.getElementById("add-to-cart-btn");
        if (addToCartBtn) {
            addToCartBtn.addEventListener("click", () => this.addToCart());
        }
        
        const relatedContainer = document.querySelector(".related-products .products-container-detail");
        if (relatedContainer) {
            relatedContainer.addEventListener('click', (event) => {
                const card = event.target.closest('.product-card');
                if (!card) return;
                const productId = card.dataset.productId;

                if (event.target.classList.contains('add-to-cart-btn')) {
                    if (!this.cardComponent) {
                        this.cardComponent = new ProductCard();
                    }
                    this.cardComponent.addToCart(productId);
                    return;
                }
                
                if (event.target.classList.contains('view-details-btn') || card) {
                    window.loadComponent("main", "app/product-detail/product-detail.html", true, productId);
                }
            });
        }
    }
    
    /**
     * Adiciona o produto ao carrinho
     */
    addToCart() {
        if (!this.productData?.id) {
            NotificationService.showToast(
                this._t('toast_error_title'),
                this._t('error_product_not_found'),
                'error'
            );
            return;
        }
        
        const cartUtils = new CartUtils();
        const added = cartUtils.addToCart(this.productData.id, 1);
        
        if (added) {
            NotificationService.showToast(
                this._t('toast_item_added_title'),
                this._t('msg_product_added_cart'),
                'success'
            );
        }
    }

    /**
     * Exibe mensagem de erro customizada
     */
    showError(message) {
        let container = document.querySelector(".product-detail");
        if (!container) container = document.getElementById("main");
        if (container) {
            container.innerHTML = `
                <div class="error-message">
                    <h2 data-i18n="error_title">${this._t('error_title')}</h2>
                    <p>${message}</p>
                    <a href="/index.html" class="btn-primary" data-i18n="btn_back_home">${this._t('btn_back_home')}</a>
                </div>
            `;
        } else {
            alert(message);
        }
    }

    /**
     * Calcula o preço com desconto
     */
    calculateDiscountedPrice(originalPrice, discountPercentage) {
        if (!discountPercentage || discountPercentage <= 0) return originalPrice;
        const discount = (originalPrice * discountPercentage) / 100;
        return originalPrice - discount;
    }

    /**
     * Função de tradução local
     */
    _t(key, params = {}) {
        if (window.i18nInstance && typeof window.i18nInstance.translate === 'function') {
            return window.i18nInstance.translate(key, params) || key;
        }
        return key;
    }
}

/**
 * Função de inicialização do componente de detalhes do produto
 * @param {string} selectedProductId - ID do produto selecionado
 * @returns {ProductDetail} Instância do componente de detalhes do produto
 */
export function initProductDetail(selectedProductId) {
    return new ProductDetail().init(selectedProductId);
}
