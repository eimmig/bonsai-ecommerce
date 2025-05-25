/**
 * TipsCard Component
 *
 * Este componente gerencia a exibição dos cards de dicas de cuidados com bonsai.
 * Utiliza o loadComponent global para carregar o conteúdo do HTML.
 */

export function initTipsCard(containerId = 'tips-container') {
    window.loadComponent(containerId, '../../app/tips-card/tips-card.html', true).then(() => {
        if (window.i18nInstance) {
            window.i18nInstance.translateElement(
                document.getElementById(containerId),
                window.i18nInstance.currentLang
            );
        }
    });
}
