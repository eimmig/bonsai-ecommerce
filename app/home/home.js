import {ProductCard} from "../product-card/product-card.js";

/**
 * Função de inicialização do módulo de cards de produtos
 * @returns {ProductCard} Instância do gerenciador de cards de produtos
 */
export function initProductCard() {
    return new ProductCard(6);
}