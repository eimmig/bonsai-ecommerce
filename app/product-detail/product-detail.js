/**
 * ProductDetail Component
 *
 * Este script gerencia a exibição detalhada de um produto específico,
 * carregando dados do produto, gerenciando imagens e produtos relacionados.
 */
import { NotificationService } from "../../core/notifications.js";
import { ProductCard } from "../product-card/product-card.js";

export class ProductDetail {
    constructor() {
        this.productData = null;
        this.allProducts = [];
        this.currentImageIndex = 0;
        this.productCard = new ProductCard();
        this.init();
    }

    /**
     * Inicializa o componente, configurando eventos e carregando dados
     */
    async init() {
        try {
            // Obter o ID do produto da URL
            const urlParams = new URLSearchParams(window.location.search);
            const productId = urlParams.get('id');

            if (!productId) {
                this.showError('ID do produto não especificado');
                return;
            }

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
            await this.productCard.loadProductsData();
            this.allProducts = this.productCard.productsData;

            // Encontrar o produto específico pelo ID
            this.productData = this.allProducts.find(product => product.id === productId);

            if (!this.productData) {
                throw new Error('Produto não encontrado');
            }

            // Renderizar os dados do produto
            this.renderProductDetails();

            // Renderizar produtos relacionados (excluindo o produto atual)
            this.renderRelatedProducts();

            // Esconder o indicador de carregamento e mostrar o conteúdo
            document.getElementById('loading-product').style.display = 'none';
            document.getElementById('product-content').style.display = 'flex';

        } catch (error) {
            console.error('Erro ao carregar dados do produto:', error);
            this.showError('Não foi possível carregar os detalhes do produto');
        }
    }

    /**
     * Renderiza os detalhes do produto na página
     */
    renderProductDetails() {
        // Título do produto
        document.getElementById('product-name').textContent = this.productData.nome;
        document.title = `${this.productData.nome} | Bonsai E-commerce`;

        // Descrição do produto
        document.getElementById('product-description').textContent = this.productData.descricao;

        // Informações fictícias sobre cuidados (em um cenário real, isso viria do banco de dados)
        document.getElementById('product-light-care').textContent = this.getCareInfo('light');
        document.getElementById('product-water-care').textContent = this.getCareInfo('water');
        document.getElementById('product-temp-care').textContent = this.getCareInfo('temperature');

        // Preços (original e com desconto)
        this.renderPriceArea();

        // Configurar imagens
        this.renderProductImages();
    }

    /**
     * Renderiza a seção de preço com desconto se aplicável
     */
    renderPriceArea() {
        const priceArea = document.getElementById('product-price-area');
        const hasDiscount = this.productData.porcentagemDesconto > 0;
        const discountedPrice = this.calculateDiscountedPrice(
            this.productData.valor,
            this.productData.porcentagemDesconto
        );

        let priceHTML = '';

        if (hasDiscount) {
            priceHTML += `<span class="original-price">${this.formatPrice(this.productData.valor)}</span>`;
            priceHTML += `<span class="discounted-price">${this.formatPrice(discountedPrice)}</span>`;
            priceHTML += `<span class="discount-badge">-${this.productData.porcentagemDesconto}%</span>`;
        } else {
            priceHTML += `<span class="discounted-price">${this.formatPrice(this.productData.valor)}</span>`;
        }

        priceArea.innerHTML = priceHTML;
    }

    /**
     * Renderiza a imagem principal e miniaturas do produto
     */
    renderProductImages() {
        // Configurar imagem principal
        const mainImage = document.getElementById('main-product-image');
        mainImage.src = this.productData.imagem[0].urlImagemDestaque;
        mainImage.alt = this.productData.nome;

        // Configurar miniaturas
        const thumbnailsContainer = document.querySelector('.product-thumbnails');
        thumbnailsContainer.innerHTML = '';

        // Criar array de todas as imagens (destaque + 3 imagens individuais)
        const imageUrls = [
            this.productData.imagem[0].urlImagemDestaque,
            this.productData.imagem[0].urlImagem1,
            this.productData.imagem[0].urlImagem2,
            this.productData.imagem[0].urlImagem3
        ];

        // Criar thumbnails para cada imagem
        imageUrls.forEach((url, index) => {
            const thumbnail = document.createElement('div');
            thumbnail.className = `thumbnail ${index === 0 ? 'active' : ''}`;
            thumbnail.dataset.index = index;

            const img = document.createElement('img');
            img.src = url;
            img.alt = `Thumbnail ${index + 1}`;

            thumbnail.appendChild(img);
            thumbnailsContainer.appendChild(thumbnail);

            // Adicionar evento de clique
            thumbnail.addEventListener('click', () => this.changeThumbnail(index));
        });
    }

    /**
     * Muda a imagem principal ao clicar em uma miniatura
     * @param {number} index - Índice da imagem selecionada
     */
    changeThumbnail(index) {
        // Atualizar a classe ativa nas miniaturas
        const thumbnails = document.querySelectorAll('.thumbnail');
        thumbnails.forEach(thumb => thumb.classList.remove('active'));
        thumbnails[index].classList.add('active');

        // Atualizar a imagem principal
        const mainImage = document.getElementById('main-product-image');
        const imageUrls = [
            this.productData.imagem[0].urlImagemDestaque,
            this.productData.imagem[0].urlImagem1,
            this.productData.imagem[0].urlImagem2,
            this.productData.imagem[0].urlImagem3
        ];

        mainImage.src = imageUrls[index];
        this.currentImageIndex = index;
    }

    /**
     * Renderiza os produtos relacionados (outros produtos que não o atual)
     */
    renderRelatedProducts() {
        const container = document.querySelector('.related-products .products-container');
        container.innerHTML = '';

        // Filtrar produtos que não são o atual
        const relatedProducts = this.allProducts.filter(product => product.id !== this.productData.id);

        // Limitar a 4 produtos relacionados
        const productsToShow = relatedProducts.slice(0, 4);

        // Usar o método de criação de card do ProductCard
        productsToShow.forEach(product => {
            const card = this.createProductCard(product);
            container.appendChild(card);
        });
    }

    /**
     * Cria um card de produto para a seção de produtos relacionados
     * @param {Object} product - Dados do produto
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
                <h3 class="product-name">${product.nome}</h3>
                <p class="product-description">${product.descricao.substring(0, 80)}${product.descricao.length > 80 ? '...' : ''}</p>
                <div class="product-price">
                    ${hasDiscount ? `<span class="original-price">${this.formatPrice(product.valor)}</span>` : ''}
                    <span class="discounted-price">${this.formatPrice(discountedPrice)}</span>
                </div>
                <button class="view-details-btn">Ver detalhes</button>
            </div>
        `;

        return cardElement;
    }

    /**
     * Configura os event listeners para interações na página
     */
    setupEventListeners() {
        // Botão de adicionar ao carrinho
        const addToCartBtn = document.getElementById('add-to-cart-btn');
        if (addToCartBtn) {
            addToCartBtn.addEventListener('click', () => this.addToCart());
        }

        // Delegação de evento para produtos relacionados
        document.querySelector('.related-products').addEventListener('click', (event) => {
            if (event.target.classList.contains('view-details-btn')) {
                const card = event.target.closest('.product-card');
                if (card) {
                    const productId = card.dataset.productId;
                    window.location.href = `/app/product-detail/product-detail.html?id=${productId}`;
                }
            }
        });
    }

    /**
     * Adiciona o produto atual ao carrinho
     */
    addToCart() {
        // Simulação de adição ao carrinho
        console.log(`Produto ${this.productData.id} adicionado ao carrinho`);

        // Notificação de sucesso
        NotificationService.showToast('Sucesso', 'Produto adicionado ao carrinho com sucesso!', 'success');
    }

    /**
     * Mostra mensagem de erro quando não é possível carregar o produto
     * @param {string} message - Mensagem de erro a ser exibida
     */
    showError(message) {
        const container = document.querySelector('.product-detail');
        container.innerHTML = `
            <div class="error-message">
                <h2>Ops! Algo deu errado</h2>
                <p>${message}</p>
                <a href="../home/home.html" class="btn-primary">Voltar para a página inicial</a>
            </div>
        `;
    }

    /**
     * Retorna informações fictícias sobre cuidados com o bonsai
     * @param {string} type - Tipo de cuidado (light, water, temperature)
     * @returns {string} - Descrição do cuidado
     */
    getCareInfo(type) {
        // Em um cenário real, essas informações viriam do banco de dados
        const careInfo = {
            light: [
                'Luz indireta brilhante, ideal para ambientes internos com boa iluminação',
                'Meia-sombra, evite luz solar direta',
                'Luz solar filtrada, ideal para varandas cobertas',
                'Luz direta pela manhã e sombra à tarde'
            ],
            water: [
                'Mantenha o substrato levemente úmido, regando quando a superfície estiver seca',
                'Regar moderadamente, deixando o substrato secar entre as regas',
                'Regar abundantemente uma vez por semana, verificando a umidade do solo',
                'Borrifar as folhas diariamente e regar quando o substrato estiver seco'
            ],
            temperature: [
                '18°C a 24°C, proteger de temperaturas extremas',
                '15°C a 25°C, evite correntes de ar frio',
                '20°C a 30°C, ideal para espécies tropicais',
                '10°C a 20°C, resistente a temperaturas mais baixas'
            ]
        };

        // Usar o ID do produto para selecionar um cuidado de forma pseudo-aleatória
        const index = parseInt(this.productData.id) % 4;
        return careInfo[type][index];
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

// Inicializa o componente quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', () => {
    new ProductDetail();
});
