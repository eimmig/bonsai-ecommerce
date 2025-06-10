import { initTipsCard } from "../tips-card/tips-card.js";

/**
 * Inicializa a página Sobre
 * Configura o componente TipsCard para a página Sobre e define o título da página
 */
export function initAbout() {
    initTipsCard('tips-container-about');
    document.title = 'Sobre | Bonsai E-commerce';
}