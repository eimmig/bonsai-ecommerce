// filepath: c:\Users\eduardo.immig\OneDrive - Senior Sistemas SA\Área de Trabalho\bonsai-ecommerce\app\product-detail\product-detail.js
import { CartUtils } from '../cart/utils/cart-utils.js';

export class ProductDetail {
    constructor() {
        this.productId = this._getProductIdFromUrl();
        this.cartUtils = new CartUtils();
        this.productData = null;
        
        this.quantityInput = document.getElementById('product-quantity');
        this.addToCartBtn = document.getElementById('add-to-cart-btn');
        
        this.init();
    }
    
    async init() {
        await this._loadProductData();
        this._renderProductDetails();
        this._setupEventListeners();
    }
    
    _getProductIdFromUrl() {
        // Exemplo: Se usarmos URL params
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get('id') || '1'; // Default para o primeiro produto se não especificado
    }
    
    async _loadProductData() {
        try {
            // Carregar produtos do localStorage
            const productsData = JSON.parse(localStorage.getItem('products') || '{"produtos":[]}');
            
            // Encontrar o produto específico pelo ID
            this.productData = productsData.produtos.find(p => p.id.toString() === this.productId.toString());
            
            if (!this.productData) {
                console.error(`Produto com ID ${this.productId} não encontrado`);
                // Redirecionamento para home ou exibição de mensagem de erro
            }
        } catch (error) {
            console.error('Erro ao carregar dados do produto:', error);
        }
    }
    
    _renderProductDetails() {
        if (!this.productData) return;
        
        // Preencher os elementos da página com os dados do produto
        document.getElementById('product-name').textContent = this.productData.nome;
        document.getElementById('product-description').textContent = this.productData.descricao;
        
        // Calcular preço com desconto
        const originalPrice = this.productData.valor;
        const discountPercentage = this.productData.porcentagemDesconto || 0;
        const discountedPrice = originalPrice * (1 - discountPercentage / 100);
        
        document.getElementById('product-price').textContent = this._formatCurrency(discountedPrice);
        
        // Se houver desconto, mostrar o preço original
        if (discountPercentage > 0) {
            document.getElementById('product-original-price').textContent = this._formatCurrency(originalPrice);
            document.getElementById('product-discount').textContent = `${discountPercentage}% OFF`;
        }
        
        // Imagens do produto
        if (this.productData.imagem && this.productData.imagem.length > 0) {
            document.getElementById('main-product-image').src = this.productData.imagem[0].urlImagemDestaque;
            
            // Preencher miniaturas se houver
            const thumbnailsContainer = document.getElementById('product-thumbnails');
            if (thumbnailsContainer) {
                thumbnailsContainer.innerHTML = '';
                
                this.productData.imagem.forEach(img => {
                    const thumbnail = document.createElement('div');
                    thumbnail.classList.add('product-thumbnail');
                    thumbnail.innerHTML = `<img src="${img.urlImagem1}" alt="${this.productData.nome}">`;
                    thumbnailsContainer.appendChild(thumbnail);
                    
                    // Adicionar evento de clique para trocar imagem principal
                    thumbnail.addEventListener('click', () => {
                        document.getElementById('main-product-image').src = img.urlImagem1;
                    });
                });
            }
        }
    }
    
    _setupEventListeners() {
        // Controle de quantidade
        document.getElementById('quantity-minus')?.addEventListener('click', () => {
            const currentValue = parseInt(this.quantityInput.value);
            if (currentValue > 1) {
                this.quantityInput.value = currentValue - 1;
            }
        });
        
        document.getElementById('quantity-plus')?.addEventListener('click', () => {
            const currentValue = parseInt(this.quantityInput.value);
            this.quantityInput.value = currentValue + 1;
        });
        
        // Botão adicionar ao carrinho
        this.addToCartBtn?.addEventListener('click', () => {
            const quantity = parseInt(this.quantityInput.value);
            this._addToCart(quantity);
        });
    }
    
    _addToCart(quantity) {
        if (!this.productData) return;
        
        if (this.cartUtils.addToCart(this.productId, quantity)) {
            // Exibir notificação de sucesso
            this._showNotification('Produto adicionado ao carrinho!');
        } else {
            // Exibir notificação de erro
            this._showNotification('Erro ao adicionar produto ao carrinho', 'error');
        }
    }
    
    _showNotification(message, type = 'success') {
        // Verificar se existe um serviço de notificação no projeto
        if (window.showNotification) {
            window.showNotification(message, type);
        } else {
            alert(message);
        }
    }
    
    _formatCurrency(value) {
        return `R$ ${value.toFixed(2).replace('.', ',')}`;
    }
}