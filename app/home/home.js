import {ProductCard} from "../product-card/product-card.js";
import { initTipsCard } from "../tips-card/tips-card.js";

/**
 * Inicializa a página Home
 * Configura os componentes ProductCard e TipsCard e define o título da página
 */
export function initHome() {
    const productCard = new ProductCard(6);
    productCard.init();

    initTipsCard('tips-container');

    document.title = 'Home | Bonsai E-commerce';
}

