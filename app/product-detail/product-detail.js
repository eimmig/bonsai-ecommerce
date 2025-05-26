import { NotificationService } from "../../core/notifications.js";
import { ProductCard } from "../product-card/product-card.js";

export class ProductDetail {
    constructor(selectedProductId = null) {
        this.productData = null;
        this.allProducts = [];
        this.currentImageIndex = 0;
        this.productCard = new ProductCard();
        this.init(selectedProductId);
    }

    async init(productId) {
        try {
            if (!productId) {
                const urlParams = new URLSearchParams(window.location.search);
                productId = urlParams.get("id");
            }
            if (!productId) {
                this.showError("ID do produto não especificado");
                return;
            }
            await this.loadProductData(productId);
            this.setupEventListeners();
        } catch (error) {
            console.error("Erro ao inicializar o componente ProductDetail:", error);
            this.showError("Não foi possível carregar os detalhes do produto");
        }
    }

    async loadProductData(productId) {
        try {
            // Descomenta e garante o carregamento dos produtos
            await this.productCard.loadProductsData();
            this.allProducts = this.productCard.productsData || [];

            if (this.allProducts.length === 0) {
                throw new Error("Não foi possível carregar os produtos");
            }

            this.productData = this.allProducts.find(product => product.id === productId);
            if (!this.productData) {
                throw new Error("Produto não encontrado");
            }

            this.renderProductDetails();
            this.renderRelatedProducts();
            const loading = document.getElementById("loading-product");
            const content = document.getElementById("product-content");
            if (loading) loading.style.display = "none";
            if (content) content.style.display = "flex";
        } catch (error) {
            console.error("Erro ao carregar dados do produto:", error);
            this.showError("Não foi possível carregar os detalhes do produto");
        }
    }

    renderProductDetails() {
        document.getElementById("product-name").textContent = this.productData.nome;
        document.title = `${this.productData.nome} | Bonsai E-commerce`;
        document.getElementById("product-description").textContent = this.productData.descricao;
        this.renderPriceArea();
        this.renderProductImages();
    }

    renderPriceArea() {
        const priceArea = document.getElementById("product-price-area");
        const installmentOptions = document.getElementById("installment-options");
        const hasDiscount = this.productData.porcentagemDesconto > 0;
        const discountedPrice = this.calculateDiscountedPrice(
            this.productData.valor,
            this.productData.porcentagemDesconto
        );

        // Renderiza área de preço
        let priceHTML = "";
        if (hasDiscount) {
            priceHTML += `<span class="original-price">${this.formatPrice(this.productData.valor)}</span>`;
            priceHTML += `<span class="discounted-price">${this.formatPrice(discountedPrice)}</span>`;
            priceHTML += `<span class="discount-badge-detail">-${this.productData.porcentagemDesconto}%</span>`;
        } else {
            priceHTML += `<span class="discounted-price">${this.formatPrice(this.productData.valor)}</span>`;
        }
        priceArea.innerHTML = priceHTML;

        // Renderiza opções de parcelamento
        const finalPrice = hasDiscount ? discountedPrice : this.productData.valor;
        const installmentHTML = this.generateInstallmentOptions(finalPrice);
        installmentOptions.innerHTML = installmentHTML;
    }

    generateInstallmentOptions(price) {
        // Gera opções de parcelamento até 12x
        const maxInstallments = 12;
        const installmentValue = price / maxInstallments;
        return `Em até ${maxInstallments}x de ${this.formatPrice(installmentValue)} sem juros`;
    }

    renderProductImages() {
        const mainImage = document.getElementById("main-product-image");
        mainImage.src = this.productData.imagem[0].urlImagemDestaque;
        mainImage.alt = this.productData.nome;
        const thumbnailsContainer = document.querySelector(".product-thumbnails");
        thumbnailsContainer.innerHTML = "";
        const imageUrls = [
            this.productData.imagem[0].urlImagemDestaque,
            this.productData.imagem[0].urlImagem1,
            this.productData.imagem[0].urlImagem2,
            this.productData.imagem[0].urlImagem3
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

    changeThumbnail(index) {
        const thumbnails = document.querySelectorAll(".thumbnail");
        thumbnails.forEach(thumb => thumb.classList.remove("active"));
        thumbnails[index].classList.add("active");
        const mainImage = document.getElementById("main-product-image");
        const imageUrls = [
            this.productData.imagem[0].urlImagemDestaque,
            this.productData.imagem[0].urlImagem1,
            this.productData.imagem[0].urlImagem2,
            this.productData.imagem[0].urlImagem3
        ];
        mainImage.src = imageUrls[index];
        this.currentImageIndex = index;
    }

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
    }

    createProductCard(product) {
        const hasDiscount = product.porcentagemDesconto > 0;
        const discountedPrice = this.calculateDiscountedPrice(product.valor, product.porcentagemDesconto);
        const cardElement = document.createElement("div");
        cardElement.className = `product-card ${!hasDiscount ? "no-discount" : ""}`;
        cardElement.dataset.productId = product.id;
        const imageUrl = product.imagem[0].urlImagemDestaque;
        cardElement.innerHTML = `
            ${hasDiscount ? `<div class="discount-badge">-${product.porcentagemDesconto}%</div>` : ""}
            <div class="product-image">
                <img src="${imageUrl}" alt="${product.nome}">
            </div>
            <div class="product-info">
                <h3 class="product-name">${product.nome}</h3>
                <p class="product-description">${product.descricao.substring(0, 80)}${product.descricao.length > 80 ? "..." : ""}</p>
                <div class="product-price">
                    ${hasDiscount ? `<span class="original-price">${this.formatPrice(product.valor)}</span>` : ""}
                    <span class="discounted-price">${this.formatPrice(discountedPrice)}</span>
                </div>
                <button class="view-details-btn">Ver produto</button>
            </div>
        `;
        return cardElement;
    }

    setupEventListeners() {
        const addToCartBtn = document.getElementById("add-to-cart-btn");
        if (addToCartBtn) {
            addToCartBtn.addEventListener("click", () => this.addToCart());
        }
        const related = document.querySelector(".related-products");
        if (related) {
            related.addEventListener("click", (event) => {
                if (event.target.classList.contains("view-details-btn")) {
                    const card = event.target.closest(".product-card");
                    if (card) {
                        const productId = card.dataset.productId;
                        if (window.loadComponent) {
                            window.loadComponent("main", "app/product-detail/product-detail.html", true, productId);
                        } else {
                            window.location.href = `/app/product-detail/product-detail.html?id=${productId}`;
                        }
                    }
                }
            });
        }
    }

    addToCart() {
        NotificationService.showToast("Sucesso", "Produto adicionado ao carrinho com sucesso!", "success");
    }

    showError(message) {
        let container = document.querySelector(".product-detail");
        if (!container) container = document.getElementById("main");
        if (container) {
            container.innerHTML = `
                <div class="error-message">
                    <h2>Ops! Algo deu errado</h2>
                    <p>${message}</p>
                    <a href="/index.html" class="btn-primary">Voltar para a página inicial</a>
                </div>
            `;
        } else {
            alert(message);
        }

    }

    calculateDiscountedPrice(originalPrice, discountPercentage) {
        if (!discountPercentage || discountPercentage <= 0) return originalPrice;
        const discount = (originalPrice * discountPercentage) / 100;
        return originalPrice - discount;
    }

    formatPrice(value) {
        return `R$ ${value.toFixed(2).replace('.', ',')}`;
    }
}

export function initProductDetail(selectedProductId) {
    return new ProductDetail(selectedProductId);
}
