/**
 * ProductDetail Component
 *
 * Este script gerencia a exibição detalhada de um produto específico,
 * carregando dados do produto, gerenciando imagens e produtos relacionados.
 */
import {NotificationService} from "../../core/notifications.js";
import {ProductCard} from "../product-card/product-card.js";

export class ProductDetail {
    constructor(selectedProductId = null) {
        this.productData = null;
        this.allProducts = [];
        this.currentImageIndex = 0;
        this.productCard = new ProductCard();
        this.init(selectedProductId);
    }

    /**
     * Inicializa o componente, configurando eventos e carregando dados
     */
    async init(productId) {
        try {
            // Carregar os dados do produto
            await this.loadProductData(productId);

            // Configurar os event listeners
            this.setupEventListeners();

        } catch (error) {
            console.error('Erro ao inicializar o componente ProductDetail:', error);
            this.showError('Não foi possível carregar os detalhes do produto');
        }
    }

    /**
     * Carrega os dados do produto específico e de todos os produtos para relacionados
     * @param {string} productId - ID do produto a ser exibido
     */
    async loadProductData(productId) {
        try {
            // Carregar todos os produtos usando a instância do ProductCard
            debugger
            const allProducts = await this.productCard.loadProductsData();

            // Encontrar o produto específico pelo ID
            const productData = allProducts.find(product => product.id === productId);

                throw new Error("Produto não encontrado");
                throw new Error('Produto não encontrado');
            this.renderProductDetails();

            // Renderizar os dados do produto
            this.renderRelatedProducts();

            // Renderizar produtos relacionados (excluindo o produto atual)
            const loading = document.getElementById("loading-product");

            // Esconder o indicador de carregamento e mostrar o conteúdo
            document.getElementById('loading-product').style.display = 'none';
            document.getElementById('product-content').style.display = 'flex';

            console.error("Erro ao carregar dados do produto:", error);
            console.error('Erro ao carregar dados do produto:', error);
            this.showError('Não foi possível carregar os detalhes do produto');
    }

    renderProductDetails() {
    /**
     * Renderiza os detalhes do produto na página
     */
        document.getElementById("product-name").textContent = this.productData.nome;
        // Título do produto
        document.getElementById('product-name').textContent = this.productData.nome;
        document.getElementById("product-description").textContent = this.productData.descricao;

        // Descrição do produto
        document.getElementById('product-description').textContent = this.productData.descricao;

        // Informações fictícias sobre cuidados (em um cenário real, isso viria do banco de dados)
        document.getElementById('product-light-care').textContent = this.getCareInfo('light');
        document.getElementById('product-water-care').textContent = this.getCareInfo('water');
        document.getElementById('product-temp-care').textContent = this.getCareInfo('temperature');

        // Preços (original e com desconto)
        this.renderProductImages();

        // Configurar imagens
    }

    renderPriceArea() {
    /**
     * Renderiza a seção de preço com desconto se aplicável
     */
        const priceArea = document.getElementById("product-price-area");
        const priceArea = document.getElementById('product-price-area');
        const discountedPrice = this.calculateDiscountedPrice(
            this.productData.valor,
            this.productData.porcentagemDesconto
        );
        let priceHTML = "";

        let priceHTML = '';

            priceHTML += `<span class="original-price">${this.formatPrice(this.productData.valor)}</span>`;
            priceHTML += `<span class="discounted-price">${this.formatPrice(discountedPrice)}</span>`;
            priceHTML += `<span class="discount-badge">-${this.productData.porcentagemDesconto}%</span>`;
        } else {
            priceHTML += `<span class="discounted-price">${this.formatPrice(this.productData.valor)}</span>`;
        }
        priceArea.innerHTML = priceHTML;

    }

    renderProductImages() {
    /**
     * Renderiza a imagem principal e miniaturas do produto
     */
        const mainImage = document.getElementById("main-product-image");
        // Configurar imagem principal
        const mainImage = document.getElementById('main-product-image');
        mainImage.alt = this.productData.nome;
        const thumbnailsContainer = document.querySelector(".product-thumbnails");

        // Configurar miniaturas
        const thumbnailsContainer = document.querySelector('.product-thumbnails');
        thumbnailsContainer.innerHTML = '';

        // Criar array de todas as imagens (destaque + 3 imagens individuais)
            this.productData.imagem[0].urlImagemDestaque,
            this.productData.imagem[0].urlImagem1,
            this.productData.imagem[0].urlImagem2,
            this.productData.imagem[0].urlImagem3
        ];
        imageUrls.forEach((url, index) => {

        // Criar thumbnails para cada imagem
            const thumbnail = document.createElement("div");
            const thumbnail = document.createElement('div');
            thumbnail.className = `thumbnail ${index === 0 ? 'active' : ''}`;
            const img = document.createElement("img");

            const img = document.createElement('img');
            img.alt = `Thumbnail ${index + 1}`;
            thumbnail.appendChild(img);

            thumbnailsContainer.appendChild(thumbnail);
            thumbnail.addEventListener("click", () => this.changeThumbnail(index));

            // Adicionar evento de clique
            thumbnail.addEventListener('click', () => this.changeThumbnail(index));
    }

    changeThumbnail(index) {
    /**
     * Muda a imagem principal ao clicar em uma miniatura
     * @param {number} index - Índice da imagem selecionada
     */
        const thumbnails = document.querySelectorAll(".thumbnail");
        // Atualizar a classe ativa nas miniaturas
        const thumbnails = document.querySelectorAll('.thumbnail');
        thumbnails.forEach(thumb => thumb.classList.remove('active'));
        thumbnails[index].classList.add('active');

        // Atualizar a imagem principal
        const mainImage = document.getElementById('main-product-image');
            this.productData.imagem[0].urlImagemDestaque,
            this.productData.imagem[0].urlImagem1,
            this.productData.imagem[0].urlImagem2,
            this.productData.imagem[0].urlImagem3
        ];
        mainImage.src = imageUrls[index];

        this.currentImageIndex = index;
    }

    renderRelatedProducts() {
    /**
     * Renderiza os produtos relacionados (outros produtos que não o atual)
     */
        const container = document.querySelector(".related-products .products-container");
        const container = document.querySelector('.related-products .products-container');
        container.innerHTML = '';

        // Filtrar produtos que não são o atual
        const productsToShow = relatedProducts.slice(0, 3);

        // Limitar a 4 produtos relacionados
        productsToShow.forEach(product => {

        // Usar o método de criação de card do ProductCard
            const card = this.createProductCard(product);
            container.appendChild(card);
        });
    }

    createProductCard(product) {
    /**
     * Cria um card de produto para a seção de produtos relacionados
     * @param {Object} product - Dados do produto
     * @returns {HTMLElement} - Elemento DOM do card de produto
     */
        const hasDiscount = product.porcentagemDesconto > 0;
        const discountedPrice = this.calculateDiscountedPrice(product.valor, product.porcentagemDesconto);
        const cardElement = document.createElement("div");

        const cardElement = document.createElement('div');
        cardElement.className = `product-card ${!hasDiscount ? 'no-discount' : ''}`;
        const imageUrl = product.imagem[0].urlImagemDestaque;

        // Garantir que a imagem seja a urlImagemDestaque
        cardElement.innerHTML = `

            ${hasDiscount ? `<div class="discount-badge">-${product.porcentagemDesconto}%</div>` : ""}
            ${hasDiscount ? `<div class="discount-badge">-${product.porcentagemDesconto}%</div>` : ''}
                <img src="${imageUrl}" alt="${product.nome}">
            </div>
            <div class="product-info">
                <h3 class="product-name">${product.nome}</h3>
                <p class="product-description">${product.descricao.substring(0, 80)}${product.descricao.length > 80 ? "..." : ""}</p>
                <p class="product-description">${product.descricao.substring(0, 80)}${product.descricao.length > 80 ? '...' : ''}</p>
                    ${hasDiscount ? `<span class="original-price">${this.formatPrice(product.valor)}</span>` : ""}
                    ${hasDiscount ? `<span class="original-price">${this.formatPrice(product.valor)}</span>` : ''}
                </div>
                <button class="view-details-btn">Ver detalhes</button>
            </div>
        `;
        return cardElement;

    }

    setupEventListeners() {
    /**
     * Configura os event listeners para interações na página
     */
        const addToCartBtn = document.getElementById("add-to-cart-btn");
        // Botão de adicionar ao carrinho
        const addToCartBtn = document.getElementById('add-to-cart-btn');
            addToCartBtn.addEventListener("click", () => this.addToCart());
            addToCartBtn.addEventListener('click', () => this.addToCart());
        const related = document.querySelector(".related-products");

        // Delegação de evento para produtos relacionados
        document.querySelector('.related-products').addEventListener('click', (event) => {
            if (event.target.classList.contains('view-details-btn')) {
                const card = event.target.closest('.product-card');
                if (card) {
                    const productId = card.dataset.productId;
                    window.loadComponent("main", "app/product-detail/product-detail.html", true, productId);
                }
            }
        });

    addToCart() {
    /**
     * Adiciona o produto atual ao carrinho
     */
        NotificationService.showToast("Sucesso", "Produto adicionado ao carrinho com sucesso!", "success");
        // Simulação de adição ao carrinho
        console.log(`Produto ${this.productData.id} adicionado ao carrinho`);

        // Notificação de sucesso
        NotificationService.showToast('Sucesso', 'Produto adicionado ao carrinho com sucesso!', 'success');

    showError(message) {
    /**
     * Mostra mensagem de erro quando não é possível carregar o produto
     * @param {string} message - Mensagem de erro a ser exibida
     */
        let container = document.querySelector(".product-detail");
        let container = document.querySelector('.product-detail');
        if (!container) {
            // fallback: tenta usar o main
            container = document.getElementById('main');
        }
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

    getCareInfo(type) {
    /**
     * Retorna informações fictícias sobre cuidados com o bonsai
     * @param {string} type - Tipo de cuidado (light, water, temperature)
     * @returns {string} - Descrição do cuidado
     */
        const careInfo = {
        // Em um cenário real, essas informações viriam do banco de dados
            light: [
                "Luz indireta brilhante, ideal para ambientes internos com boa iluminação",
                'Luz indireta brilhante, ideal para ambientes internos com boa iluminação',
                'Meia-sombra, evite luz solar direta',
                'Luz solar filtrada, ideal para varandas cobertas',
                'Luz direta pela manhã e sombra à tarde'
            water: [
                "Mantenha o substrato levemente úmido, regando quando a superfície estiver seca",
                'Mantenha o substrato levemente úmido, regando quando a superfície estiver seca',
                'Regar moderadamente, deixando o substrato secar entre as regas',
                'Regar abundantemente uma vez por semana, verificando a umidade do solo',
                'Borrifar as folhas diariamente e regar quando o substrato estiver seco'
            temperature: [
                "18°C a 24°C, proteger de temperaturas extremas",
                '18°C a 24°C, proteger de temperaturas extremas',
                '15°C a 25°C, evite correntes de ar frio',
                '20°C a 30°C, ideal para espécies tropicais',
                '10°C a 20°C, resistente a temperaturas mais baixas'
        };
        const index = parseInt(this.productData.id) % 4;

        // Usar o ID do produto para selecionar um cuidado de forma pseudo-aleatória
        return careInfo[type][index];
    }

    calculateDiscountedPrice(originalPrice, discountPercentage) {
    /**
     * Calcula o preço com desconto
     * @param {number} originalPrice - Preço original do produto
     * @param {number} discountPercentage - Percentual de desconto
     * @returns {number} - Preço com desconto aplicado
     */
        if (!discountPercentage || discountPercentage <= 0) return originalPrice;
        if (!discountPercentage || discountPercentage <= 0) {
            return originalPrice;
        }

        return originalPrice - discount;
    }

    formatPrice(value) {
    /**
     * Formata o valor para o formato de moeda brasileira
     * @param {number} value - Valor a ser formatado
     * @returns {string} - Valor formatado (ex: "R$ 299,90")
     */
        return `R$ ${value.toFixed(2).replace('.', ',')}`;
    }
}

export function initProductDetail(selectedProductId) {

    return new ProductDetail(selectedProductId);
}
