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
     */
    async init() {
        this.productsData = loadProductsFromStorage();
        this.renderProductCardsWithComponent();
    }

    /**
     * Renderiza os cards reutilizando o ProductCard Component
     */
    renderProductCardsWithComponent() {
        const container = document.querySelector(".bonsai-products-container");
        if (!container) return;
        container.innerHTML = "";
        container.classList.add("bonsai-grid-4"); // Garante a classe de grid para 4 colunas
        // Reutiliza o ProductCard para renderizar todos os produtos
        import("../product-card/product-card.js").then(module => {
            const ProductCard = module.ProductCard;
            const cardComponent = new ProductCard();
            cardComponent.productsData = this.productsData;
            // Renderiza os cards no container customizado
            cardComponent.renderProductCards = function() {
                this.productsData.forEach(product => {
                    const card = this.createProductCard(product);
                    container.appendChild(card);
                });
                if (window.i18nInstance && typeof window.i18nInstance.translateElement === 'function') {
                    window.i18nInstance.translateElement(container);
                }
            };
            cardComponent.renderProductCards();
        });
    }
}

export function initBonsaiProducts() {
    const bonsaiProducts = new BonsaiProducts();
    bonsaiProducts.init();
    return bonsaiProducts;
}
