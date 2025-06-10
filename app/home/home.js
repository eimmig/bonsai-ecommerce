import {ProductCard} from "../product-card/product-card.js";
import { initTipsCard } from "../tips-card/tips-card.js";

export function initHome() {
    const productCard = new ProductCard(6);
    productCard.init();

    initTipsCard('tips-container');

    document.title = 'Home | Bonsai E-commerce';
}

