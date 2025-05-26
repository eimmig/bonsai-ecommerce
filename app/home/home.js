import {ProductCard} from "../product-card/product-card.js";
import { initTipsCard } from "../tips-card/tips-card.js";

export function initHome() {
    // Renderiza os cards de produtos
    const productCard = new ProductCard(6);
    productCard.init();

    // Carrega os tips-cards no container da home
    initTipsCard('tips-container');
}

