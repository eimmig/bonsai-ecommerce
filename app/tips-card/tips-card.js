/**
 * TipsCard Component
 *
 * Este componente gerencia a exibição dos cards de dicas de cuidados com bonsai.
 * Utiliza o loadComponent global para carregar o conteúdo do HTML.
 */

export function initTipsCard() {
    loadTipsComponent();
}

/**
 * Carrega o componente de dicas usando a função global loadComponent
 */
async function loadTipsComponent() {
    try {
        // Verifica se a função global loadComponent está disponível
        if (typeof window.loadComponent === 'function') {
            // Carrega o conteúdo do arquivo HTML de dicas no container
            await window.loadComponent('tips-container', '../../app/tips-card/tips-card.html', true);

            // Aplica a tradução se o serviço de tradução estiver disponível
            if (window.i18nInstance) {
                window.i18nInstance.translateElement(
                    document.getElementById('tips-container'),
                    window.i18nInstance.currentLang
                );
            }

            console.log('Componente de dicas carregado com sucesso');
        } else {
            console.error('A função loadComponent não está disponível');
        }
    } catch (error) {
        console.error('Erro ao carregar o componente de dicas:', error);
    }
}
