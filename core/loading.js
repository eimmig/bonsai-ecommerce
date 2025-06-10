/**
 * Renderiza um componente de carregamento (loading) no container especificado
 * @param {string|HTMLElement} containerId - ID do container ou elemento HTML onde o loading será renderizado
 * @param {string} message - Mensagem a ser exibida durante o carregamento
 */
export function renderLoadingComponent(containerId, message = 'Carregando...') {
    const container = typeof containerId === 'string' ? document.getElementById(containerId) : containerId;
    if (!container) return;
    container.innerHTML = `
        <div class="loading-indicator" id="loading-component">
            <div class="spinner"></div>
            <p>${message}</p>
        </div>
    `;
}

/**
 * Remove o componente de carregamento (loading) do container especificado
 * @param {string|HTMLElement} containerId - ID do container ou elemento HTML de onde o loading será removido
 */
export function removeLoadingComponent(containerId) {
    const container = typeof containerId === 'string' ? document.getElementById(containerId) : containerId;
    if (!container) return;
    const loading = container.querySelector('#loading-component');
    if (loading) loading.remove();
}
