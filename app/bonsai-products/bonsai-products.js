/**
 * BonsaiProducts Component
 * Renderiza todos os produtos do catálogo em formato de cards, semelhante à home.
 */
import { loadProductsFromStorage } from "../../core/functionUtils.js";

export class BonsaiProducts {
    constructor() {
        this.productsData = [];
    }

    /**
     * Inicializa o componente e renderiza todos os produtos
     * @returns {BonsaiProducts} - Instância do componente
     */
    init() {
        this.productsData = loadProductsFromStorage();
        this.renderProductCardsWithComponent();
        document.title = 'Produtos | Bonsai E-commerce';
        return this;
    }
    
    /**
     * Renderiza os cards reutilizando o ProductCard Component
     */
    renderProductCardsWithComponent() {
        const container = document.querySelector(".bonsai-products-container");
        if (!container) return;
        container.innerHTML = "";
        container.classList.add("bonsai-grid-4"); 
        import("../product-card/product-card.js").then(module => {
            const ProductCard = module.ProductCard;
            const cardComponent = new ProductCard();
            cardComponent.productsData = this.productsData;
            
            this.productsData.forEach(product => {
                const card = cardComponent.createProductCard(product);
                container.appendChild(card);
            });
            
            if (window.i18nInstance && typeof window.i18nInstance.translateElement === 'function') {
                window.i18nInstance.translateElement(container);
            }
            
            // Configura os event listeners para adicionar ao carrinho e ver detalhes
            container.addEventListener('click', (event) => {
                const card = event.target.closest('.product-card');
                if (!card) return;
                const productId = card.dataset.productId;

                if (event.target.classList.contains('add-to-cart-btn')) {
                    cardComponent.addToCart(productId);
                    return;
                }
                if (event.target.classList.contains('view-details-btn')) {
                    cardComponent.viewProductDetails(productId);
                    return;
                }
                
                if (card) {
                    cardComponent.viewProductDetails(productId);
                }
            });
        });
    }
}

/**
 * Inicializa o componente de produtos bonsai
 * @returns {BonsaiProducts} Instância do componente inicializado
 */
export function initBonsaiProducts() {
    return new BonsaiProducts().init();
}

/**
 * Inicializa a página de produtos bonsai completa
 * Além de inicializar o componente, também aplica as traduções
 */
export function initBonsaiProductsPage() {
    initBonsaiProducts();
    if (window.i18nInstance && typeof window.i18nInstance.translateElement === 'function') {
        window.i18nInstance.translateElement(document.querySelector('.bonsai-products-section'));
    }
}
